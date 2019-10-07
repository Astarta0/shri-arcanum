const { get } = require('lodash');

const fs = jest.genMockFromModule('fs');

const FOLDER_PATH = '/';

let filesystem = {};

const toObjPath = path => path.split('/').filter(Boolean).join('.');

module.exports = Object.assign(fs, {
    _setup: tree => {
        filesystem = tree;
    },
    promises: {
        // /myrepo/folder1 => ['', 'myrepo', 'folder1']
        readdir: async path => {
            if (path === '/') {
                return Object.keys(filesystem);
            }
            path = toObjPath(path);
            const subtree = get(filesystem, path);
            console.log({ path });
            if (!subtree) {
                throw new Error('no file');
            }
            return Object.keys(subtree);
        },
        stat: async path => {
            if (path === '/') {
                return { isDirectory() { return true; } };
            }
            path = toObjPath(path);
            const subtree = get(filesystem, path);
            return ({
                isDirectory() {
                    return typeof subtree === 'object';
                }
            });
        },
        readFile: async path => {
            path = toObjPath(path);
            return get(filesystem, path);
        }
    }
});
