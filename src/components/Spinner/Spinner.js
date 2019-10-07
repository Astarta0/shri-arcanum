import React from 'react';
import classNames from 'classnames';

import './Spinner.css';

const Spinner = ({ className }) => (
    <div className={classNames('spinner', className)}></div>
);

export default Spinner;
