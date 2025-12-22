// src/config/Menu.tsx
import React, {lazy} from 'react';
import {AtSymbolIcon, BookOpenIcon, TrophyIcon} from "@heroicons/react/24/outline";

const IntroPage = lazy(() => import('../pages/intro/intro'));
const ModPage = lazy(() => import('../pages/intro/mod'));
const ShopPage = lazy(() => import('../pages/intro/shop'));
const OtherPage = lazy(() => import('../pages/intro/other'));
export type MenuItem = {
    key: string;            // 这里的 key 将作为路径的一部分，也是翻译 key 的一部分
    path?: string;          // 可选：如果填了，就强制使用这个路径；不填则自动生成
    element?: React.ReactNode; // 该路由对应的页面组件
    icon?: React.ReactNode;
    children?: MenuItem[];
    badge?: {
        text: string;
        color: string;
    };
};

export const sidebarMenu: MenuItem[] = [
    {
        key: 'intro',
        icon: <TrophyIcon className="w-5 h-5"/>,
        children: [
            {key: 'md', element: <IntroPage/>},
            {key: 'shop', element: <ShopPage/>},
            {key: 'mod', element: <ModPage/>},
            {
                key: 'other',
                badge: {text: 'incoming', color: 'badge-info'},
                element: <OtherPage/>
            },
        ],
    },
    {
        key: 'docs',
        icon: <BookOpenIcon className="w-5 h-5"/>,
        children: [
            {
                key: 'struct',
                children: [
                    {key: 'building'},
                    {key: 'box'},
                    {key: 'altar'},
                    {key: 'lair'},
                    {key: 'statue'},
                ]
            },
        ],
    },
    {
        key: 'website',
        icon: <AtSymbolIcon className="w-5 h-5"/>,
        path: '/website',
    },
];