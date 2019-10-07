import React from 'react';
import PropTypes from 'prop-types';


const TableHead = ({ children }) => (
    <div className="table__header">
        { children }
    </div>
);

TableHead.propTypes = {
    children: PropTypes.any,
};

export default TableHead;
