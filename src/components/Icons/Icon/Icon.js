import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Icon.css';

const Icon = ({ className }) => (<span className={classNames('icon', className)} />);

Icon.propTypes = {
    className: PropTypes.string
};

export default Icon;
