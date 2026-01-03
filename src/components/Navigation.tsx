import React, {lazy} from 'react';
import {AcademicCapIcon, AtSymbolIcon, BookOpenIcon, FireIcon, TrophyIcon} from "@heroicons/react/24/outline";
import StuffPage from "../pages/docs/StuffPage/StuffPage.tsx";
import FramePage from "../pages/mods/install/FramePage.tsx";
import MarkdownTuitionPage from "../pages/MarkdownTuitionPage.tsx";
import TechTreePage from "../pages/docs/TechTreePage/TechTreePage.tsx";

const IntroPage = lazy(() => import('../pages/intro/intro'));
const ShopPage = lazy(() => import('../pages/intro/shop'));
const OtherPage = lazy(() => import('../pages/intro/other'));
export type NavItem = {
    key: string;            // 这里的 key 将作为路径的一部分，也是翻译 key 的一部分
    path?: string;          // 可选：如果填了，就强制使用这个路径；不填则自动生成
    element?: React.ReactNode; // 该路由对应的页面组件
    icon?: React.ReactNode;
    children?: NavItem[];
    badge?: {
        text: string;
        color: string;
    };
};

export const navigation: NavItem[] = [
    {
        key: 'intro',
        icon: <TrophyIcon className="w-5 h-5"/>,
        children: [
            {key: 'md', element: <IntroPage/>},
            {key: 'shop', element: <ShopPage/>},
            {
                key: 'other',
                badge: {text: 'incoming', color: 'badge-info'},
                element: <OtherPage/>
            },
        ],
    },
    {
        key: 'mods',
        icon: <FireIcon className="w-5 h-5"/>,
        children: [
            {
                key: 'install',
                children: [
                    {key: 'frame', element: <FramePage/>},
                    {key: 'download'},
                    {key: 'path'}
                ]
            },
            {
                key: 'develop',
                children: [
                    {key: 'frame'},
                    {key: 'vs'},
                    {key: 'project'},
                    {key: 'refer'},
                    {key: 'value'},
                    {key: 'patch'},
                    {key: 'inject'},
                ]
            }
        ],
    },
    {
        key: 'docs',
        icon: <BookOpenIcon className="w-5 h-5"/>,
        children: [
            {
                key: 'stuff',
                element: <StuffPage/>
            },
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
            {
                key: 'tech',
                element: <TechTreePage/>
            },
        ],
    },
    {
        key: 'website',
        icon: <AtSymbolIcon className="w-5 h-5"/>,
        path: '/website',
    },
    {
        key: 'md',
        icon: <AcademicCapIcon className="w-5 h-5"/>,
        path: '/md',
        element: <MarkdownTuitionPage/>
    },
];