import React from 'react';
import {TrophyIcon} from "@heroicons/react/24/outline";

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
        key: 'introduction', // 对应翻译文件中的 key
        icon: <TrophyIcon className="w-5 h-5" />,
        children: [
            { key: 'intro', path: '/intro/md' },
            { key: 'shop', path: '/intro/shop' },
            { key: 'mod', path: '/intro/mod' },
            {
                key: 'other',
                path: '/intro/other',
                badge: { text: 'incoming', color: 'badge-info' }
            },
        ],
    },
];