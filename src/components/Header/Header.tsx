/* global document */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logo from 'src/components/Icons/Logo';
import DropDown from 'src/components/DropDown';

import { AppStateType } from 'src/types/store';
import { BreadcrumbItemType } from 'src/components/Breadcrumbs/types';
import { TabNameType } from 'src/components/Tabs/types';

import { FILES_TYPES, TABS_TYPES } from 'src/client/constants';
import * as globalSelectors from '../../client/selectors/global';
import * as globalActions from '../../client/actions/global';

import './Header.css';

const mapStateToProps = (state: AppStateType) => ({
    repositories: globalSelectors.getRepositoriesList(state),
    currentRepo: globalSelectors.getCurrentRepo(state)
});

const mapDispatchToprops = {
    setCurrentRepository: globalActions.setCurrentRepository,
    setNewBreadcrumbPath: globalActions.setNewBreadcrumbPath,
    setActiveTab: globalActions.setActiveTab,
    fetchFilesList: globalActions.fetchFilesList
};

interface IHeaderProps {
    repositories: Array<string>,
    currentRepo: string,
    setCurrentRepository: (item: string) => void,
    setNewBreadcrumbPath: (item: BreadcrumbItemType) => void,
    setActiveTab: (tabName: TabNameType) => void,
    fetchFilesList: ({ url } : { url: string }) => void,
}

interface IHeaderState {
    selectedValue: string,
    isMenuOpened: boolean
}

class Header extends Component<IHeaderProps, IHeaderState> {
    private refWrapper = React.createRef<HTMLDivElement>();

    constructor(props: IHeaderProps) {
        super(props);

        const { currentRepo } = this.props;

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

    handleClickOutside = (e: MouseEvent): void => {
        const { target } = e;

        if (!this.refWrapper) return;

        const { current } = this.refWrapper;

        if (current && !current.contains(target as Node)) {
            this.setState({
                isMenuOpened: false,
            });
        }
    };

    handleDropDownClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const { target } = e;
        const dropDown = this.refWrapper;

        if (!dropDown.current || !dropDown.current.firstChild || !dropDown.current.firstChild.contains(target as Node)) return;

        this.setState(state => {
            return {
                isMenuOpened: !state.isMenuOpened,
            };
        });
    };

    handleItemClick = (item: string) => {
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

export default connect(mapStateToProps, mapDispatchToprops)(Header);
