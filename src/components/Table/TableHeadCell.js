import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Table.css';

const TableHeadCell = ({ children, className }) => (
    <div className={classNames('table__cell', 'table__cell_header', 'font', 'font_medium', className)}>
        { children }
    </div>
);

TableHeadCell.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
};

export default TableHeadCell;
