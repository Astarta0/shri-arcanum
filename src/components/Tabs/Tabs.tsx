import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch as DispatchType } from 'redux';

import * as globalSelectors from 'src/client/selectors/global';
import * as globalActions from 'src/client/actions/global';
import { TABS_BY_BREADCRUMB_TYPE } from 'src/client/constants';
import { AppStateType } from 'src/types/store';
import { TabsComponentProps, TabNameType } from './types';
import Tab from './Tab';

import './Tabs.css';

const mapStateToProps = (state: AppStateType) => ({
    activeBreadcrumbItemType: globalSelectors.getLastActiveBreadcrumbItem(state).type,
    activeTabName: globalSelectors.getActiveTabName(state),
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
    setActiveTab: (tabName: TabNameType) => dispatch(globalActions.setActiveTab(tabName))
});

class Tabs extends Component<TabsComponentProps> {
    setActiveTab = (tabName: TabNameType) => {
        const { setActiveTab } = this.props;
        setActiveTab(tabName);
    };

    render() {
        const { activeBreadcrumbItemType, activeTabName } = this.props;

        return (
            <div className="tabs">
                {
                    TABS_BY_BREADCRUMB_TYPE[activeBreadcrumbItemType]
                        .map((tabName: TabNameType) => (
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

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
