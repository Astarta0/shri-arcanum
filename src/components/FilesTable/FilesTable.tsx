import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { Table, TableHead, TableHeadCell, TableContent, TableRow, TableCell } from 'src/components/Table';
import Icon from 'src/components/Icons/Icon/Icon';
import { CellArrowIcon } from 'src/components/Icons/index';
import Link from 'src/components/Link';
import Committer from 'src/components/Committer';
import Spinner from 'src/components/Spinner';

import { FILE_TABLE_HEADER_CELLS, FILES_TYPES, TABS_TYPES } from 'src/client/constants';
import * as globalSelectors from 'src/client/selectors/global';
import * as globalActions from 'src/client/actions/global';
import * as clientUtils from 'src/client/utils';

import './FilesTable.css';
import { AppStateType } from 'src/types/store';
import { FileObject } from 'src/types/index';
import { TabNameType } from 'src/components/Tabs/types';
import { BreadcrumbItemType } from 'src/components/Breadcrumbs/types';

const mapStateToProps = (state: AppStateType) => ({
    files: globalSelectors.filterFilesBySearchName(state),
    currentBranch: globalSelectors.getCurrentBranch(state),
    waiting: globalSelectors.getWaitingFlag(state),
    error: globalSelectors.getError(state),
    searchName: globalSelectors.getSearchName(state),
    currentRepo: globalSelectors.getCurrentRepo(state)
});

const mapDispatchToProps = {
    setActiveCrumb: globalActions.setActiveCrumb,
    fetchFilesList: globalActions.fetchFilesList,
    setActiveTab: globalActions.setActiveTab
};

interface IFilesTableProps extends RouteComponentProps<any> {
    files: Array<FileObject>,
    currentBranch: string,
    waiting: boolean,
    error: string | null,
    searchName: string,
    currentRepo: string,
    setActiveCrumb: ({ index, item }: { index?: number, item?: BreadcrumbItemType }) => void,
    fetchFilesList: ({ url }: { url: string }) => void,
    setActiveTab: (tabName: TabNameType) => void
}

class FilesTable extends PureComponent<IFilesTableProps> {
    handleCellClick = ({ type, name }: { type: 'tree'|'blob', name: string }) => {
        const { currentBranch, history, setActiveCrumb, fetchFilesList, currentRepo, setActiveTab } = this.props;

        const prefix = `${currentRepo}/${type}/${currentBranch}`;
        const url = `/${prefix}/${name}`;
        history.push(url);

        const breadCrumbItem = {
            type,
            name
        };

        setActiveCrumb({ item: breadCrumbItem });
        if (type === FILES_TYPES.tree) {
            fetchFilesList({ url });
        } else {
            // mount details and fetch data in FileDetails component
            setActiveTab(TABS_TYPES.details);
        }
    };

    render() {
        const { files, error, waiting, searchName } = this.props;

        if (error) {
            return (<div className={classNames('filesTable__infoBlock', 'filesTable__infoBlock_error')}>{error}</div>);
        }

        if (waiting) {
            return (<Spinner className="filesTable__spinner" />);
        }

        if (!files.length && searchName) {
            return (
                <div className={classNames('filesTable__infoBlock')}>
                    Sorry, no files found :c
                </div>
            );
        }

        if (!files.length) return <div className={classNames('filesTable__infoBlock')}>No files</div>;

        return (
            <Table>
                <TableHead>
                    {
                        FILE_TABLE_HEADER_CELLS.map(({ id, title }) => (
                            <TableHeadCell className={`table__cell_${id}`} key={id}>{title}</TableHeadCell>
                        ))
                    }
                </TableHead>
                <TableContent id="files">
                    { files.map(({
                        type,
                        name,
                        commitHash,
                        commitMessage,
                        committerName,
                        committerEmail,
                        date,
                    }, idx) => (
                        <TableRow key={name + idx}>
                            <TableCell className="table__cell_name" onClick={() => this.handleCellClick({ type, name })}>
                                <Icon className={classNames('cell__icon', type === 'blob'
                                    ? 'icon_file_code'
                                    : 'icon_folder')}
                                />
                                <span className="cell__folderName cell__folderName_font_medium">
                                    {clientUtils.cutPathFromFileName(name)}
                                </span>
                            </TableCell>

                            <TableCell className="table__cell_commit">
                                <Link href="/" target="_blank">{commitHash}</Link>
                            </TableCell>

                            <TableCell className="table__cell_message">
                                <span>
                                    {/* <a class="link">ARCADIA-771</a> */}
                                    {commitMessage}
                                </span>
                                <div className="cell__arrowButton">
                                    <CellArrowIcon />
                                </div>
                            </TableCell>

                            <TableCell className="table__cell_committer">
                                <Committer className="cell__committerEmail committer_email" email={committerEmail}>
                                    {committerEmail.split('@')[0]}
                                </Committer>
                                <Committer className="cell__committerName" email={committerEmail}>
                                    {'by ' + committerName + ','}
                                </Committer>
                            </TableCell>

                            <TableCell className="table__cell_updated">
                                <span className="cell__apdateData">{clientUtils.convertTimestampToDate(date)}</span>
                            </TableCell>
                        </TableRow>
                    )) }
                </TableContent>
            </Table>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesTable));
