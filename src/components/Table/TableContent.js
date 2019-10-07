import React from 'react';
import PropTypes from 'prop-types';

import './Table.css';

const TableContent = ({ children, id = '' }) => (
    <div className="table__content" id={id}>
        {children}
    </div>
);


TableContent.propTypes = {
    children: PropTypes.any,
    id: PropTypes.string
};

export default TableContent;
