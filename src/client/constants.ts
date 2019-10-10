import { TabNameType } from 'src/components/Tabs/types';
import { BreadcrumbType } from 'src/components/Breadcrumbs/types';

export const TABS_BY_BREADCRUMB_TYPE: Record<'tree' | 'blob', Array<TabNameType>> = {
    tree: [ 'files', 'branches' ],
    blob: [ 'details', 'history' ]
};

export const TABS_TYPES: Record<TabNameType, TabNameType> = {
    files: 'files',
    branches: 'branches',
    details: 'details',
    history: 'history'
};

export const FILES_TYPES: Record<BreadcrumbType, BreadcrumbType> = {
    blob: 'blob',
    tree: 'tree'
};

export const FILE_TABLE_HEADER_CELLS = [
    {
        id: 'name',
        title: 'Name'
    },
    {
        id: 'commit',
        title: 'Last commit'
    },
    {
        id: 'message',
        title: 'Commit message'
    },
    {
        id: 'committer',
        title: 'Committer'
    },
    {
        id: 'updated',
        title: 'Updated'
    },
];
