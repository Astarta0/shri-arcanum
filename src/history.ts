import { createBrowserHistory, createMemoryHistory, History } from 'history';

// eslint-disable-next-line import/no-mutable-exports
let history: History;

if (typeof window !== 'undefined') {
    history = createBrowserHistory();
} else {
    history = createMemoryHistory();
}

export default history;
