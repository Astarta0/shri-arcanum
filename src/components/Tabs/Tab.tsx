import React from 'react';
import classNames from 'classnames';

import { TabComponentProps } from './types';
import './Tabs.css';

const Tab = ({ children, className = '', onClick = () => {} }: TabComponentProps) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
        className={classNames('tabs__item', className)}
        onClick={onClick}
    >
        {children}
    </div>
);

export default Tab;
