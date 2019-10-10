import React from 'react';
import classNames from 'classnames';

import './Input.css';

const Input = ({ className, value, placeholder, autofocus = false, onChange, disabled = false }) => (
    <input
        className={classNames('input', className)}
        value={value}
        autoFocus={autofocus}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
    />
);

export default Input;
