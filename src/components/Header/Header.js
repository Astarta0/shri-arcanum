/* global document */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logo from 'src/components/Icons/Logo';
import DropDown from 'src/components/DropDown';

import { FILES_TYPES, TABS_TYPES } from 'src/client/constants';
import * as globalSelectors from '../../client/selectors/global';
import * as globalActions from '../../client/actions/global';

import './Header.css';

@connect(
    state => ({
        repositories: globalSelectors.getRepositoriesList(state),
        currentRepo: globalSelectors.getCurrentRepo(state)
    }),
    dispatch => ({
        setCurrentRepository: item => dispatch(globalActions.setCurrentRepository(item)),
        setNewBreadcrumbPath: ({ name, type }) => dispatch(globalActions.setNewBreadcrumbPath({ name, type })),
        setActiveTab: tabName => dispatch(globalActions.setActiveTab(tabName)),
        fetchFilesList: ({ url }) => dispatch(globalActions.fetchFilesList({ url }))
    })
)

class Header extends Component {
    constructor(props) {
        super(props);

        const { currentRepo } = this.props;
        this.refWrapper = React.createRef();

        this.state = {
            selectedValue: currentRepo,
            isMenuOpened: false,
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = e => {
        const { target } = e;

        if (!this.refWrapper) return;

        const { current } = this.refWrapper;

        if (current && !current.contains(target)) {
            this.setState({
                isMenuOpened: false,
            });
        }
    };

    handleDropDownClick = e => {
        const { target } = e;
        const dropDown = this.refWrapper;

        if (!dropDown.current.firstChild.contains(target)) return;

        this.setState(state => {
            return {
                isMenuOpened: !state.isMenuOpened,
            };
        });
    };

    handleItemClick = item => {
        const { setCurrentRepository, setNewBreadcrumbPath, setActiveTab, fetchFilesList } = this.props;

        this.setState(state => ({
            isMenuOpened: false,
            selectedValue: item,
        }));

        setCurrentRepository(item);
        setNewBreadcrumbPath({
            name: item,
            type: FILES_TYPES.tree
        });
        setActiveTab(TABS_TYPES.files);

        const url = `${item}`;
        fetchFilesList({ url });
    };


    render() {
        const { repositories } = this.props;
        const { isMenuOpened, selectedValue } = this.state;

        return (
            <header className="header">
                <a className="header__item" href="/">
                    <Logo className="header__logo" />
                </a>

                <div className="header__item header__item_selected" dir="ltr">
                    <DropDown
                        items={repositories}
                        value={selectedValue}
                        onDropDownClick={this.handleDropDownClick}
                        isOpen={isMenuOpened}
                        onItemClick={this.handleItemClick}
                        setRef={this.refWrapper}
                    />
                </div>
            </header>
        );
    }
}

export default Header;
