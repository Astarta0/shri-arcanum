import React from 'react';
import classNames from 'classnames';

import './Link.css';

interface LinkComponentProps {
    className?: string,
    children: React.ReactNode,
    href?: string,
    target?: string
}

const Link = ({ className = '', href = '/', target = '_blank', children }: LinkComponentProps) => (
    <a className={classNames('link', className)} href={href} target={target}>{children}</a>
);

export default Link;
