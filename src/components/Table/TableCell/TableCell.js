import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './TableCell.css';

const TableCell = ({ children, className, onClick }) => (
    <div className={classNames('table__cell', 'cell', className)} onClick={onClick}>
        { children }
    </div>
);

TableCell.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
};

export default TableCell;
