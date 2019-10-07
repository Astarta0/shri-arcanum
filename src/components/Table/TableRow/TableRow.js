import React from 'react';
import PropTypes from 'prop-types';

import './TableRow.css';

const TableRow = ({ children }) => (
    <div className="table__row row">
        { children }
    </div>
);

TableRow.propTypes = {
    children: PropTypes.any
};

export default TableRow;
