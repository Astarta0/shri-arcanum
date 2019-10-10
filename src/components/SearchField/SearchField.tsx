import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Input from 'src/components/Input';
import { AppStateType } from 'src/types/store';
import * as globalSelectors from '../../client/selectors/global';
import * as globalActions from '../../client/actions/global';

import './SearchField.css';

const mapStateToProps = (state: AppStateType) => ({
    searchName: globalSelectors.getSearchName(state),
});

const mapDispatchtoprops = ({
    searchFiles: globalActions.searchFiles
});

interface ISearchFieldProps {
    searchName: string,
    searchFiles: (searchName: string) => void,
    isDisabled?: boolean,
    className?: string
}

class SearchField extends Component<ISearchFieldProps> {
    handleOnChange: React.ReactEventHandler<HTMLInputElement> = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const { searchFiles } = this.props;
        const { value } = ev.currentTarget;
        searchFiles(value);
    };

    render() {
        const { searchName, className = '', isDisabled = false } = this.props;

        return (
            <div className={classNames('search', className)}>
                <Input
                    className={classNames('search__input', isDisabled && 'search__input_disabled')}
                    value={searchName}
                    autoFocus
                    placeholder="Filter by file name..."
                    onChange={this.handleOnChange}
                    disabled={isDisabled}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchtoprops)(SearchField);
