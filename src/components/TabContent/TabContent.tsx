import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import FilesTable from 'src/components/FilesTable';
import BranchesTable from 'src/components/BranchesTable';
import FileDetails from 'src/components/FileDetails';
import FileHistory from 'src/components/FileHistory';

import * as globalSelectors from 'src/client/selectors/global';
import { TabNameType } from 'src/components/Tabs/types';
import { TABS_TYPES } from 'src/client/constants';
import { AppStateType } from 'src/types/store';

const CONTENT = {
    [TABS_TYPES.files]: <FilesTable />,
    [TABS_TYPES.branches]: <BranchesTable />,
    [TABS_TYPES.details]: <FileDetails />,
    [TABS_TYPES.history]: <FileHistory />
};

const mapStateToprops = (state: AppStateType) => ({
    activeTabName: globalSelectors.getActiveTabName(state)
});

interface ITabContentProps {
    activeTabName: TabNameType
}

class TabContent extends PureComponent<ITabContentProps> {
    render() {
        const { activeTabName } = this.props;
        return CONTENT[activeTabName];
    }
}

export default connect(mapStateToprops)(TabContent);
