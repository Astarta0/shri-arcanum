import React from 'react';
import { connect } from 'react-redux';

import * as globalSelectors from 'src/client/selectors/global';
import { AppStateType } from 'src/types/store';

import './Info.css';

const mapStateToProps = (state: AppStateType) => ({
    currentRepository: globalSelectors.getCurrentRepo(state),
    currentBranch: globalSelectors.getCurrentBranch(state)
});

interface IinfoProps {
    currentRepository: string,
    currentBranch: string
}

class Info extends React.Component<IinfoProps> {
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

export default connect(mapStateToProps)(Info);
