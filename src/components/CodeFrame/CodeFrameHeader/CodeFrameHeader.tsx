import React, { Component } from 'react';

type CodeFrameHeaderPropsTypes = {
    children: React.ReactNode
}

export default class CodeFrameHeader extends Component<CodeFrameHeaderPropsTypes> {
    render() {
        const { children } = this.props;

        return (
            <div className="code-frame__header code-frame__header_commit">
                {children}
            </div>
        );
    }
}
