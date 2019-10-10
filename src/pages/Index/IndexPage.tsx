import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import * as globalSelectors from 'src/client/selectors/global';
import Breadcrumbs from 'src/components/Breadcrumbs';
import Tabs from 'src/components/Tabs';
import Info from 'src/components/Info';
import SearchField from 'src/components/SearchField';
import TabContent from 'src/components/TabContent';
import { FILES_TYPES, TABS_TYPES } from 'src/client/constants';
import { AppStateType } from 'src/types/store';
import { TabNameType } from 'src/components/Tabs/types';
import { BreadcrumbItemType } from 'src/components/Breadcrumbs/types';

const mapStateToProps = (state: AppStateType) => ({
    currentRepo: globalSelectors.getCurrentRepo(state),
    activeCrumb: globalSelectors.getLastActiveBreadcrumbItem(state),
    activeTabName: globalSelectors.getActiveTabName(state)
});

interface IindexPage {
    currentRepo: string,
    activeCrumb: BreadcrumbItemType,
    activeTabName: TabNameType
}

class IndexPage extends Component<IindexPage> {
    render() {
        const { activeCrumb, activeTabName, currentRepo } = this.props;

        if (!currentRepo) {
            return <Redirect to="/notFound" />;
        }

        const activeCrumbType = activeCrumb.type;
        const isSearchFieldDisabled = activeCrumbType === FILES_TYPES.blob || activeTabName !== TABS_TYPES.files;

        return (
            <>
                <Breadcrumbs />
                <Info>
                    <SearchField className="info__search" isDisabled={isSearchFieldDisabled} />
                </Info>
                <Tabs />
                <TabContent />
            </>
        );
    }
}

export default withRouter(connect(mapStateToProps)(IndexPage));
