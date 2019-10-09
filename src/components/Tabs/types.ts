import React from 'react';

export interface TabComponentProps {
    className?: string,
    children: React.ReactNode,
    onClick: () => void
}

export interface TabsComponentProps {
    activeBreadcrumbItemType: 'tree' | 'blob',
    activeTabName: TabNameType,
    setActiveTab: (tabName: TabNameType) => void
}

export type TabNameType = 'files' | 'branches' | 'details' | 'history';
