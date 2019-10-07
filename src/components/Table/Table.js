import React from 'react';
import PropTypes from 'prop-types';


const Table = ({ children }) => (
    <div className="table">
        { children }
    </div>
);

export default Table;

Table.propTypes = {
    children: PropTypes.any
};
