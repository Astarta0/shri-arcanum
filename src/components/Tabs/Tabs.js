import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import * as globalSelectors from 'src/client/selectors/global';
import * as globalActions from 'src/client/actions/global';
import { TABS_BY_BREADCRUMB_TYPE } from 'src/client/constants';

import Tab from './Tab';

import './Tabs.css';

@connect(
    state => ({
        activeBreadcrumbItemType: globalSelectors.getLastActiveBreadcrumbItem(state).type,
        activeTabName: globalSelectors.getActiveTabName(state),
    }),
    dispatch => ({
        setActiveTab: tabName => dispatch(globalActions.setActiveTab(tabName))
    })
)

export default class Tabs extends Component {
    setActiveTab = tabName => {
        const { setActiveTab } = this.props;
        setActiveTab(tabName);
    };

    render() {
        const { activeBreadcrumbItemType, activeTabName } = this.props;

        return (
            <div className="tabs">
                {
                    TABS_BY_BREADCRUMB_TYPE[activeBreadcrumbItemType]
                        .map(tabName => (
                            <Tab
                                key={tabName}
                                onClick={() => this.setActiveTab(tabName)}
                                className={activeTabName === tabName ? 'tabs__item_active' : ''}
                            >
                                {tabName.toLocaleUpperCase()}
                            </Tab>
                        ))
                }
            </div>
        );
    }
}

Tabs.propTypes = {
    activeBreadcrumbItemType: PropTypes.oneOf([ 'tree', 'blob' ]),
    setActiveTab: PropTypes.func,
};
