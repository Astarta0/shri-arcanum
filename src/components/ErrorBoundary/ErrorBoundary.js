import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        const { children } = this.props;
        const { hasError } = this.state;

        if (hasError) {
            return <h3>Would appear things are a little unstable.</h3>;
        }

        return children;
    }
}

export default ErrorBoundary;
