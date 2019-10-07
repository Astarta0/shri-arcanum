import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';

import * as globalActions from 'src/client/actions/global';
import * as globalSelectors from 'src/client/selectors/global';
import CodeFrame from 'src/components/CodeFrame';
import Spinner from 'src/components/Spinner';

import './FileDetails.css';

@withRouter
@connect(
    state => ({
        activeBreadcrumb: globalSelectors.getLastActiveBreadcrumbItem(state),
        fileContent: globalSelectors.getFileContent(state),
        fileName: globalSelectors.getOpenedFileName(state),
        waiting: globalSelectors.getWaitingFlag(state),
        error: globalSelectors.getError(state)
    }),
    (dispatch, ownProps) => ({
        fetchFileContent: ({ url, name }) => dispatch(globalActions.fetchFileContent({ url, name })),
    })
)

export default class FileDetails extends Component {
    componentDidMount() {
        const { history, fetchFileContent, activeBreadcrumb, fileName, fileContent } = this.props;
        const url = history.location.pathname;

        if (fileName !== activeBreadcrumb.name || !fileContent) {
            fetchFileContent({ url, name: activeBreadcrumb.name });
        }
    }

    render() {
        const { fileName, fileContent, waiting, error } = this.props;

        if (waiting) {
            return (
                <div className={classNames('fileDetails__info', error && 'fileDetails__info_error')}>
                Load data...
                </div>
            );
        }

        if (!fileContent || !fileName) {
            return (
                <div className={classNames('fileDetails__info', error && 'fileDetails__info_error')}>
                    {(error && error) || <Spinner />}
                </div>
            );
        }

        return (
            <CodeFrame fileName={fileName} fileContent={fileContent}>
                <Highlight>
                    <code>{fileContent}</code>
                </Highlight>
            </CodeFrame>
        );
    }
}
