import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Tabs.css';

const Tab = ({ children, className = '', onClick }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
        className={classNames('tabs__item', className)}
        onClick={onClick}
    >
        {children}
    </div>
);

Tab.propTypes = {
    children: PropTypes.any
};

export default Tab;
