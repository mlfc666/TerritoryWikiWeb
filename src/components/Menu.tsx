import React from 'react';
import {BookOpenIcon, CubeTransparentIcon} from "@heroicons/react/24/outline";

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
        icon: <BookOpenIcon className="w-5 h-5" />,
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
        icon: <CubeTransparentIcon className="w-5 h-5" />,
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