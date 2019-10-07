import React, { Component } from 'react';

export default class CodeFrameHeader extends Component {
    render() {
        const { children } = this.props;

        return (
            <div className="code-frame__header code-frame__header_commit">
                {children}
            </div>
        );
    }
}
