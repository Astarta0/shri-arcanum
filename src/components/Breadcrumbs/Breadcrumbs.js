import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import * as globalSelectors from 'src/client/selectors/global';
import * as globalActions from 'src/client/actions/global';
import * as clientUtils from 'src/client/utils';

import './Breadcrumbs.css';
import { FILES_TYPES, TABS_BY_BREADCRUMB_TYPE } from '../../client/constants';

@withRouter
@connect(
    state => ({
        breadCrumbsPath: globalSelectors.getBreadCrumbsPath(state),
        currentBranch: globalSelectors.getCurrentBranch(state),
        lastActiveBreadcrumbItem: globalSelectors.getLastActiveBreadcrumbItem(state),
    }),
    dispatch => ({
        setActiveCrumb: props => dispatch(globalActions.setActiveCrumb(props)),
        fetchFilesList: ({ url }) => dispatch(globalActions.fetchFilesList({ url })),
        setActiveTab: tabName => dispatch(globalActions.setActiveTab(tabName))
    })
)

export default class Breadcrumbs extends Component {
    handleCrumbClick = ({ index, crumb }) => {
        const { setActiveCrumb, history, fetchFilesList, lastActiveBreadcrumbItem, setActiveTab } = this.props;
        const { type, name } = crumb;
        const { type: lastCrumbType, name: lastCrumbName } = lastActiveBreadcrumbItem;

        if (name === lastCrumbName && lastCrumbType === type) return;

        const oldPath = history.location.pathname;

        let updatedPath = clientUtils.cutBreadCrumbsPath({ path: oldPath, name, type });

        if (!updatedPath.startsWith('/')) {
            updatedPath = `/${updatedPath}`;
        }

        history.push(updatedPath);

        if (type === FILES_TYPES.tree) {
            fetchFilesList({ url: updatedPath });
        }

        setActiveCrumb({ index });

        setActiveTab(TABS_BY_BREADCRUMB_TYPE[type][0]);
    };

    render() {
        const { breadCrumbsPath } = this.props;

        return (
            <div className="breadcrumbs">
                {breadCrumbsPath.map((pathItem, index, paths) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                    <div
                        role="complementary"
                        key={index}
                        onClick={() => this.handleCrumbClick({ index, crumb: pathItem })}
                        className={classNames('breadcrumbs__item', { breadcrumbs__item_active: index === paths.length - 1 })}
                    >
                        {clientUtils.cutPathFromFileName(pathItem.name)}
                    </div>
                ))}
            </div>
        );
    }
}

Breadcrumbs.propTypes = {
    breadCrumbsPath: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            type: PropTypes.oneOf([ 'tree', 'blob' ])
        })
    ),
    setActiveCrumb: PropTypes.func
};
