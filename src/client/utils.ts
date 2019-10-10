import { DateTime } from 'luxon';
import { BreadcrumbType } from 'src/components/Breadcrumbs/types';

export const convertTimestampToDate = (timestamp: number) => {
    const date = DateTime.fromMillis(timestamp * 1000);
    return date.setLocale('en-US').toLocaleString({ weekday: 'short', day: '2-digit', month: 'short' });
};

export const cutPathFromFileName = (name: string) => (name.includes('/') ? name.split('/').pop() : name);

export const cutBreadCrumbsPath = ({ path, name, type }: { path: string, name: string, type: BreadcrumbType }) => {
    const arrPaths = path.split('/').filter(p => p);

    // если имя составное
    if (/\//.test(name)) {
        name = name.split('/').pop() || '';
    }

    const lastCrumbposition = arrPaths.indexOf(name);
    const updated = arrPaths.slice(0, lastCrumbposition + 1);

    if (updated.length > 2) {
        updated[1] = type;
    }
    return updated.join('/');
};
