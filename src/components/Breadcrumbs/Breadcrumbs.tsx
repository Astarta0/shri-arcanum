import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as globalSelectors from 'src/client/selectors/global';
import * as globalActions from 'src/client/actions/global';
import * as clientUtils from 'src/client/utils';
import { AppStateType } from 'src/types/store';
import { ThunkDispatch } from 'src/types/actions';
import { TabNameType } from 'src/components/Tabs/types';
import { BreadcrumbsComponentType, BreadcrumbItemType } from './types';
import { FILES_TYPES, TABS_BY_BREADCRUMB_TYPE } from '../../client/constants';
import './Breadcrumbs.css';

const mapStateToProps = (state: AppStateType) => ({
    breadCrumbsPath: globalSelectors.getBreadCrumbsPath(state),
    currentBranch: globalSelectors.getCurrentBranch(state),
    lastActiveBreadcrumbItem: globalSelectors.getLastActiveBreadcrumbItem(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
    setActiveCrumb: (props: { index?: number, item?: string }) => dispatch(globalActions.setActiveCrumb(props)),
    fetchFilesList: (props: { url: string }) => dispatch(globalActions.fetchFilesList(props)),
    setActiveTab: (tabName: TabNameType) => dispatch(globalActions.setActiveTab(tabName))
});

class Breadcrumbs extends Component<BreadcrumbsComponentType> {
    handleCrumbClick = ({ index, crumb }: { index: number, crumb: BreadcrumbItemType }) => {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs));
