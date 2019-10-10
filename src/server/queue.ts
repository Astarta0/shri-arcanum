class Queue {
    queue: Promise<unknown>;

    constructor() {
        this.queue = Promise.resolve();
    }

    push(fn: () => Promise<any>) {
        const job = this.queue.then(fn);
        this.queue = job.catch(() => {});
        return job;
    }
}

export default new Queue();
