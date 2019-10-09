import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import IndexPage from 'src/pages/Index/IndexPage';
import NotFoundPage from 'src/pages/NotFound/';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import ErrorBoundary from 'src/components/ErrorBoundary/ErrorBoundary';

class App extends Component {
    render() {
        return (
            <>
                <ErrorBoundary>
                    <Header />
                    <main>
                        <Switch>
                            <Route path="/notFound" component={NotFoundPage} />
                            <Route path="/*" component={IndexPage} />
                        </Switch>
                    </main>
                    <Footer />
                </ErrorBoundary>
            </>
        );
    }
}

export default App;
