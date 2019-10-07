import React from 'react';
import classNames from 'classnames';

import './Button.css';

const Button = ({ children, className, onClick = () => {}, type }) => (
    <button className={classNames('button', className)} type={type || 'button'} onClick={onClick}>
        {children}
    </button>
);

export default Button;
