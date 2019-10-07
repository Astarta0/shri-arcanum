import React from 'react';
import classNames from 'classnames';

import './Input.css';

const Input = ({ className, value, placeholder, autofocus = false, onChange }) => (
    <input
        className={classNames('input', className)}
        value={value}
        autoFocus={autofocus}
        placeholder={placeholder}
        onChange={onChange}
    />
);

export default Input;
