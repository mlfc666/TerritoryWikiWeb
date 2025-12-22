import {Suspense, useEffect} from 'react'
import './App.css'
import {Navbar} from "./components/Navbar.tsx";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import {type MenuItem, sidebarMenu} from "./components/Menu.tsx";

// --- 递归路由生成器 ---
const renderRoutes = (items: MenuItem[]) => {
    return items.map((item) => {
        // 如果有子项，递归渲染子 Route
        if (item.children && item.children.length > 0) {
            return (
                <Route key={item.key} path={item.key} element={item.element}>
                    {renderRoutes(item.children)}
                </Route>
            );
        }

        // 如果没有子项，直接渲染叶子 Route
        // 只有当 item.element 存在时才渲染路由，防止报错
        if (item.element) {
            return <Route key={item.key} path={item.key} element={item.element}/>;
        }

        return null;
    })
}
const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-base-100">

            {/* 顶部导航栏：它是 Flex 的第一个子元素，高度由内容决定 */}
            <Navbar/>

            {/* 下方主体区域：flex-1 让它自动占据剩余的所有高度 */}
            <div className="flex flex-1 overflow-hidden">

                {/* 左侧 Sidebar：高度自动撑满父容器(也就是剩余高度) */}
                <aside className="w-80 overflow-y-auto border-r border-base-200 hidden lg:block">
                    <Sidebar/>
                </aside>

                {/* 右侧内容区域：同样占据剩余宽度，且独立滚动 */}
                <main className="flex-1 overflow-y-auto p-10 relative">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

function App() {
    // 获取i18n实例，确保不会乱弹翻译弹窗
    const {t, i18n} = useTranslation();
    useEffect(() => {
        // 当语言变化时，自动修改 html 标签的 lang 属性
        document.documentElement.lang = i18n.language;
        document.title = t('navbar.name');
    }, [i18n.language, t]);
    useEffect(() => {
        // 页面加载时，从 localStorage 读取保存的主题
        const savedTheme = localStorage.getItem('daisyui-theme');
        console.log(savedTheme)
        // 如果有保存的主题，就应用；否则用 DaisyUI 默认主题
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []); // 空依赖数组：只在组件挂载时执行一次
    return (
        <>
            <BrowserRouter>
                {/* 使用 Suspense 包裹，因为我们在 Menu.tsx 用了 lazy 加载 */}
                <Suspense fallback={<div className="p-10">Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<MainLayout/>}>

                            {/* 首页 (可选) */}
                            <Route index element={<div>欢迎来到首页</div>}/>

                            {/* --- 核心：这里一行代码代替了原本所有的路由配置 --- */}
                            {renderRoutes(sidebarMenu)}

                            {/* 404 页面 */}
                            <Route path="*" element={<div>404 Not Found</div>}/>

                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default App
