import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import * as globalSelectors from 'src/client/selectors/global';
import Breadcrumbs from 'src/components/Breadcrumbs';
import Tabs from 'src/components/Tabs';
import Info from 'src/components/Info';
import SearchField from 'src/components/SearchField';
import TabContent from 'src/components/TabContent';

@withRouter
@connect(
    state => ({
        currentRepo: globalSelectors.getCurrentRepo(state)
    })
)

export default class IndexPage extends Component {
    render() {
        if (!this.props.currentRepo) {
            return <Redirect to="/notFound" replace />;
        }

        return (
            <>
                <Breadcrumbs />
                <Info>
                    <SearchField className="info__search" />
                </Info>
                <Tabs />
                <TabContent />
            </>
        );
    }
}
