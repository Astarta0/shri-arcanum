import { createBrowserHistory, createMemoryHistory } from 'history';

// eslint-disable-next-line import/no-mutable-exports
let history;

if (typeof window !== 'undefined') {
    history = createBrowserHistory();
} else {
    history = createMemoryHistory();
}

export default history;
