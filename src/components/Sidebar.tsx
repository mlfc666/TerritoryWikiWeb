import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sidebarMenu, type MenuItem } from './Menu.tsx';

export default function Sidebar() {
    const { t } = useTranslation();
    const location = useLocation();

    // 辅助函数：判断父菜单是否应该展开
    const shouldOpen = (item: MenuItem): boolean => {
        if (!item.children) return false;
        return item.children.some(child => {
            if (child.path && location.pathname.startsWith(child.path)) return true;
            if (child.children) return shouldOpen(child);
            return false;
        });
    };

    // --- 递归渲染器 ---
    const renderMenuItem = (item: MenuItem) => {
        // 父级菜单
        if (item.children && item.children.length > 0) {
            return (
                <li key={item.key}>
                    <details open={shouldOpen(item)}>
                        <summary className="font-bold">
                            {item.icon && item.icon}
                            {t(`sidebar.${item.key}`)}
                        </summary>
                        <ul className="gap-1 mt-1">
                            {item.children.map(renderMenuItem)}
                        </ul>
                    </details>
                </li>
            );
        }

        // 子菜单链接
        return (
            <li key={item.key}>
                <NavLink
                    to={item.path || '#'}
                    // 如果你想让子菜单文字也稍微大一点，这里不需要加额外的类，默认继承即可
                    className={({ isActive }) => isActive ? "menu-active" : ""}
                >
                    {item.icon && item.icon}
                    {t(`sidebar.${item.key}`)}

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
            {sidebarMenu.map(renderMenuItem)}
        </ul>
    );
}