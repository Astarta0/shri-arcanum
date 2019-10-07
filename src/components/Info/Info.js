import React from 'react';
import { connect } from 'react-redux';

import * as globalSelectors from 'src/client/selectors/global';

import './Info.css';

@connect(
    state => ({
        currentRepository: globalSelectors.getCurrentRepo(state),
        currentBranch: globalSelectors.getCurrentBranch(state)
    })
)

class Info extends React.Component {
    render() {
        const { children, currentRepository, currentBranch } = this.props;
        return (
            <div className="info">
                <div className="info__title font font_medium">
                    <span>{currentRepository}</span>
                    <span className="info__BSlabel">{currentBranch}</span>
                </div>
                {children}
            </div>
        );
    }
}

export default Info;
