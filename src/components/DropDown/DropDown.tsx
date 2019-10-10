import React, { Component } from 'react';
import classNames from 'classnames';

import './DropDown.css';
import 'src/client/css/popup.css';

interface IDropDownComponentProps {
    className?: string,
    items: Array<string>,
    onDropDownClick: (e: React.MouseEvent<HTMLDivElement>) => void,
    value: string,
    isOpen: boolean,
    onItemClick: (item: string) => void,
    setRef: React.RefObject<HTMLDivElement>
}

export default class DropDown extends Component<IDropDownComponentProps> {
    render() {
        const { className = '', items, onDropDownClick, value, isOpen, onItemClick, setRef } = this.props;

        if (!value) return null;

        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            <div
                className={classNames('dropDown', className, isOpen && 'dropDown_expanded')}
                onClick={e => onDropDownClick(e)}
                ref={setRef}
            >
                <span>
                    <span className="dropDown__label">Repository</span>
                    <span>{value}</span>
                </span>
                <div className="dropDown__select select popup popup_pad_l_m popup_pad_r_m">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                        type="button"
                        className="button popup__pullButton popup__pullButton_indent_b_l"
                    />
                    <ul role="listbox">
                        {
                            items.map((item, idx) => (
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                                <li
                                    className="select__item"
                                    key={idx}
                                    onClick={() => onItemClick(item)}
                                >
                                    {item}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}
