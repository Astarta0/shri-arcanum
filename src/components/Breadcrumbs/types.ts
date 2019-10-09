import { RouteComponentProps } from 'react-router-dom';
import { TabNameType } from 'src/components/Tabs/types';

export type BreadcrumbType = 'tree'|'blob';

export interface BreadcrumbItemType {
    name: string,
    type: BreadcrumbType
}

export interface BreadcrumbsComponentType extends RouteComponentProps<any> {
    breadCrumbsPath: Array<BreadcrumbItemType>;
    currentBranch: string,
    lastActiveBreadcrumbItem: BreadcrumbItemType,
    setActiveCrumb: (props: { index?: number, item?: string }) => void,
    fetchFilesList: ({ url } : { url: string }) => void,
    setActiveTab: (tabName: TabNameType) => void
}
