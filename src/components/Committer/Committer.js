import React from 'react';
import classNames from 'classnames';

import './Committer.css';

const Committer = ({ className, children, email }) => (
    <a className={classNames('committer', className)} href={`mailto:${email}`}>
        {children}
    </a>
);

export default Committer;
