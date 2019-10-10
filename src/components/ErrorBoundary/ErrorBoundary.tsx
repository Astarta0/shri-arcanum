import React from 'react';

interface Props {
    children: React.ReactNode
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
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
