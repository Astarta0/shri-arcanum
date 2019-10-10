import React from 'react';
import classNames from 'classnames';

import './Button.css';

interface ButtonComponentProps {
    children: React.ReactNode,
    className?: string,
    onClick?: () => void,
    type: 'submit' | 'reset' | 'button'
}

const Button: React.FC<ButtonComponentProps> = ({ children, className = '', onClick = () => {}, type = 'button' }) => (
    // https://github.com/yannickcr/eslint-plugin-react/issues/1555
    // eslint-disable-next-line react/button-has-type
    <button className={classNames('button', className)} type={type} onClick={onClick}>
        {children}
    </button>
);

export default Button;
