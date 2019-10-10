import React from 'react';
import classNames from 'classnames';

import './TableCell.css';

type TableCellComponentProps = {
    className?: string,
    onClick?: () => void,
    children: React.ReactNode
};

const TableCell: React.FC<TableCellComponentProps> = ({ children, className = '', onClick = () => {} }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <div className={classNames('table__cell', 'cell', className)} onClick={onClick} role="navigation">
        { children }
    </div>
);

export default TableCell;
