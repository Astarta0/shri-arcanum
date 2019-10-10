import React from 'react';
import classNames from 'classnames';

import './Spinner.css';

type SpinnerPropsTypes = {
    className?: string
};

const Spinner: React.FC<SpinnerPropsTypes> = ({ className = '' }) => (
    <div className={classNames('spinner', className)}></div>
);

export default Spinner;
