import React from 'react';
import classNames from 'classnames';

import './Table.css';

type TableHeadCellProps = {
    className?: string
};

const TableHeadCell: React.FC<TableHeadCellProps> = ({ children, className = '' }) => (
    <div className={classNames('table__cell', 'table__cell_header', 'font', 'font_medium', className)}>
        { children }
    </div>
);

export default TableHeadCell;
