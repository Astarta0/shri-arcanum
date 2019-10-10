import React from 'react';
import classNames from 'classnames';

import './Committer.css';

interface ICommitterPropsType {
    className?: string,
    children: React.ReactNode,
    email: string
}

const Committer: React.FC<ICommitterPropsType> = ({ className = '', children, email }) => (
    <a className={classNames('committer', className)} href={`mailto:${email}`}>
        {children}
    </a>
);

export default Committer;
