import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sidebarMenu, type MenuItem } from './Menu.tsx';

export default function Sidebar() {
    const { t } = useTranslation();
    const location = useLocation();

    // --- 递归渲染器 ---
    const renderMenuItem = (item: MenuItem, basePath: string = '', baseKey: string = 'sidebar') => {

        // 计算路径和 Key
        const fullPath = item.path || `${basePath}/${item.key}`.replace(/\/+/g, '/');
        const currentTransKey = `${baseKey}.${item.key}`;

        // 判断是否是顶级菜单（basePath 为空说明是第一层）
        const isTopLevel = basePath === '';

        // 如果是文件夹 (有子项)
        if (item.children && item.children.length > 0) {
            // ... 保持原有代码不变 ...
            return (
                <li key={item.key}>
                    <details open={location.pathname.startsWith(fullPath)}>
                        {/* summary 默认就有 font-bold */}
                        <summary className="font-bold">
                            {item.icon && item.icon}
                            {t(`${currentTransKey}.main`)}
                        </summary>
                        <ul className="gap-1 mt-1">
                            {item.children.map(child => renderMenuItem(child, fullPath, currentTransKey))}
                        </ul>
                    </details>
                </li>
            );
        }

        // 如果是普通菜单项 (无子项)
        return (
            <li key={item.key}>
                <NavLink
                    to={fullPath}
                    className={({ isActive }) => {
                        // 基础样式
                        let classes = isActive ? "menu-active" : "";

                        // 【关键修改】如果是顶级菜单，强制加粗，保持和 summary 一致
                        if (isTopLevel) {
                            classes += " font-bold";
                        }

                        return classes;
                    }}
                >
                    {item.icon && item.icon}
                    {t(currentTransKey)}

                    {item.badge && (
                        <span className={`badge badge-xs ${item.badge.color}`}>
                        {item.badge.text}
                    </span>
                    )}
                </NavLink>
            </li>
        );
    };

    // --- 主渲染 ---
    return (
        <ul className="menu w-full p-0 px-4 mt-4 gap-2">
            {/* 初始调用：basePath 为空字符串，baseKey 为 'sidebar' */}
            {sidebarMenu.map(item => renderMenuItem(item, '', 'sidebar'))}
        </ul>
    );
}