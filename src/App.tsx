import {Suspense, useEffect} from 'react'
import './App.css'
import {Navbar} from "./components/Navbar.tsx";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import {type MenuItem, sidebarMenu} from "./components/Menu.tsx";
import { PageContainer } from "./components/PageContainer.tsx";

// --- 递归路由生成器 (核心修改) ---
// 新增 baseKey 参数，用于递归传递翻译层级 (默认为 'sidebar')
const renderRoutes = (items: MenuItem[], baseKey = 'sidebar') => {
    return items.map((item) => {
        // 计算当前的翻译 Key (例如: sidebar.mods.install.frame)
        const currentTransKey = `${baseKey}.${item.key}`;

        // 预处理 Element：如果有 element，就自动包一层 PageContainer
        let wrappedElement = null;
        if (item.element) {
            wrappedElement = (
                <PageContainer transKey={currentTransKey}>
                    {item.element}
                </PageContainer>
            );
        }

        // 渲染子路由 (文件夹)
        if (item.children && item.children.length > 0) {
            return (
                <Route key={item.key} path={item.key}>
                    {/* 如果这个文件夹本身也有页面 (item.element)，作为 index 渲染 */}
                    {wrappedElement && <Route index element={wrappedElement} />}

                    {/* 递归渲染子项，传入当前的 Key 作为下一层的 baseKey */}
                    {renderRoutes(item.children, currentTransKey)}
                </Route>
            );
        }

        // 渲染叶子路由
        if (wrappedElement) {
            return <Route key={item.key} path={item.key} element={wrappedElement}/>;
        }

        return null;
    });
}

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-base-100">
            <Navbar/>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 overflow-y-auto border-r border-base-200 hidden lg:block">
                    <Sidebar/>
                </aside>
                <main className="flex-1 overflow-y-auto relative">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

function App() {
    const {t, i18n} = useTranslation();

    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.title = t('components.navbar.name');
    }, [i18n.language, t]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('daisyui-theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    return (
        <BrowserRouter>
            <Suspense fallback={<div className="h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>}>
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        {/* 首页 (可选) - 如果首页不在菜单里，需要单独写 PageContainer */}
                        <Route index element={
                            <PageContainer transKey="home.title">
                                <div>欢迎来到首页</div>
                            </PageContainer>
                        }/>

                        {/* 自动生成的带 Layout 的路由 */}
                        {renderRoutes(sidebarMenu)}

                        <Route path="*" element={<div>404 Not Found</div>}/>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App