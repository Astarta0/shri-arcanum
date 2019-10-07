import React, { Component } from 'react';

import Icon from 'src/components/Icons/Icon/Icon';
import Button from 'src/components/Button';
import { DownloadFileIcon } from 'src/components/Icons';
import * as clientUtils from 'src/client/utils';
import CodeFrameHeader from './CodeFrameHeader';

import './CodeFrame.css';

export default class CodeFrame extends Component {
    render() {
        const { children, fileName, fileSize } = this.props;

        return (
            <div className="code-wrapper">
                <div className="code-frame code-wrapper__code-frame">

                    <CodeFrameHeader>
                        <div>
                            <Icon className="icon_file_code icon_indent_r_s" />
                            <span className="code-frame__title font font_bold">{clientUtils.cutPathFromFileName(fileName)}</span>
                            {/* <span className="code-frame__size">(457 bytes)</span> */}
                        </div>
                        <Button className="code-frame__button">
                            <DownloadFileIcon className="code-frame__downloadIcon" />
                        </Button>

                    </CodeFrameHeader>

                    <div className="code-frame__content code-frame__content_pad_b_xs code-frame__content_pad_t_xs">
                        <pre className="code-frame__code">{children}</pre>
                    </div>

                </div>
            </div>
        );
    }
}
