import React from 'react';
import classNames from 'classnames';

import './Link.css';

const Link = ({ className, href = '/', target = '_blank', children }) => (
    <a className={classNames('link', className)} href={href} target={target}>{children}</a>
);

export default Link;
