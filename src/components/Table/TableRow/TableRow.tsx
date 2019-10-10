import React from 'react';

import './TableRow.css';

const TableRow: React.FC<any> = ({ children }) => (
    <div className="table__row row">
        { children }
    </div>
);

export default TableRow;
