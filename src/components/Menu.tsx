// src/config/menu.tsx
import React from 'react';

// 定义菜单项的类型
export type MenuItem = {
    key: string;       // 唯一标识，也可以用作翻译的 key (例如 'sidebar.docs')
    path?: string;     // 路由路径 (如果有子菜单，这个通常可以不填)
    icon?: React.ReactNode; // 图标 (可选)
    children?: MenuItem[];  // 子菜单 (支持无限嵌套)
    badge?: {          // 右侧的小徽章 (可选)
        text: string;
        color: string; // 比如 'badge-info', 'badge-ghost'
    };
};

// 具体的菜单数据配置
export const sidebarMenu: MenuItem[] = [
    {
        key: 'docs', // 对应翻译文件中的 key
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        children: [
            { key: 'introduction', path: '/docs/introduction' },
            { key: 'install', path: '/docs/install' },
            { key: 'cdn', path: '/docs/cdn' },
            {
                key: 'editor_setup',
                path: '/docs/setup',
                badge: { text: 'updated', color: 'badge-info' }
            },
        ],
    },
    {
        key: 'components',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
        ),
        children: [
            {
                key: 'actions',
                children: [ // 三级嵌套
                    { key: 'button', path: '/components/actions/button' },
                    { key: 'dropdown', path: '/components/actions/dropdown' },
                    { key: 'modal', path: '/components/actions/modal' },
                ],
            },
            {
                key: 'data_display',
                children: [
                    { key: 'accordion', path: '/components/data-display/accordion' },
                    { key: 'avatar', path: '/components/data-display/avatar' },
                ],
            },
        ],
    },
];