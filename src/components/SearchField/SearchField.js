import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Input from 'src/components/Input';
import * as globalSelectors from '../../client/selectors/global';
import * as globalActions from '../../client/actions/global';

import './SearchField.css';

@connect(
    state => ({
        searchName: globalSelectors.getSearchName(state),
    }),
    dispatch => ({
        searchFiles: value => dispatch(globalActions.searchFiles(value))
    })
)
export default class SearchField extends Component {
    handleOnChange = e => {
        const { searchFiles } = this.props;
        const { value } = e.target;
        searchFiles(value);
    };

    render() {
        const { searchName, className, isDisabled = false } = this.props;

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
