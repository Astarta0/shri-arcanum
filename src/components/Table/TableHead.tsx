import React from 'react';

const TableHead: React.FC<any> = ({ children }) => (
    <div className="table__header">
        { children }
    </div>
);

export default TableHead;
