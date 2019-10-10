import React, { Component } from 'react';

import './NotFound.css';

export default class NotFoundPage extends Component {
    render() {
        return (
            <div className="notFound">
                <h1 className="notFound__title">404</h1>
                <p>Sorry, there is nothing here</p>
            </div>
        );
    }
}
