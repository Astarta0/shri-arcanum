import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FilesTable from 'src/components/FilesTable';
import BranchesTable from 'src/components/BranchesTable';
import FileDetails from 'src/components/FileDetails';
import FileHistory from 'src/components/FileHistory';

import * as globalSelectors from 'src/client/selectors/global';
import { TABS_TYPES } from 'src/client/constants';

const CONTENT = {
    [TABS_TYPES.files]: <FilesTable />,
    [TABS_TYPES.branches]: <BranchesTable />,
    [TABS_TYPES.details]: <FileDetails />,
    [TABS_TYPES.history]: <FileHistory />
};

@connect(
    state => ({
        activeTabName: globalSelectors.getActiveTabName(state),
    })
)

export default class TabContent extends PureComponent {
    render() {
        const { activeTabName } = this.props;
        return CONTENT[activeTabName];
    }
}

TabContent.propTypes = {
    activeTabName: PropTypes.string
};
