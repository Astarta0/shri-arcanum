import React from 'react';

import './Table.css';

type TableContentProps = {
    id?: string
};

const TableContent: React.FC<TableContentProps> = ({ children, id = '' }) => (
    <div className="table__content" id={id}>
        {children}
    </div>
);

export default TableContent;
