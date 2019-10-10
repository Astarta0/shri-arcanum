import React from 'react';
import classNames from 'classnames';

import './Input.css';

type InputProps = {
    className?: string,
    value: any,
    placeholder: string,
    autoFocus?: boolean,
    onChange: React.ReactEventHandler<HTMLInputElement>,
    disabled?: boolean
}

const Input: React.FC<InputProps> = ({ className = '', value, placeholder, autoFocus = false, onChange = () => {}, disabled = false }) => (
    <input
        className={classNames('input', className)}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
    />
);

export default Input;
