import React, { Component } from 'react';

import Breadcrumbs from 'src/components/Breadcrumbs';
import Tabs from 'src/components/Tabs';
import Info from 'src/components/Info';
import SearchField from 'src/components/SearchField';
import TabContent from 'src/components/TabContent';

export default class IndexPage extends Component {
    render() {
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
