import React from 'react';
import classNames from 'classnames';

import './Icon.css';

type IconProps = {
    className?: string
};

const Icon: React.FC<IconProps> = ({ className = '' }) => (<span className={classNames('icon', className)} />);

export default Icon;
