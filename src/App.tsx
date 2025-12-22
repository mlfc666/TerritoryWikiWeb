import {useEffect} from 'react'
import './App.css'
import {Navbar} from "./components/Navbar.tsx";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import {IntroPage} from "./pages/intro/intro.tsx";
import {ShopPage} from "./pages/intro/shop.tsx";
import {ModPage} from "./pages/intro/mod.tsx";
import {OtherPage} from "./pages/intro/other.tsx";

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-base-100">

            {/* 2. 顶部导航栏：它是 Flex 的第一个子元素，高度由内容决定 */}
            <Navbar />

            {/* 3. 下方主体区域：flex-1 让它自动占据剩余的所有高度 */}
            <div className="flex flex-1 overflow-hidden">

                {/* 左侧 Sidebar：高度自动撑满父容器(也就是剩余高度) */}
                {/* 关键点：去掉 sticky 和 h-screen，加上 overflow-y-auto 实现内部滚动 */}
                <aside className="w-80 overflow-y-auto border-r border-base-200 hidden lg:block">
                    <Sidebar />
                </aside>

                {/* 右侧内容区域：同样占据剩余宽度，且独立滚动 */}
                <main className="flex-1 overflow-y-auto p-10 relative">
                    <Outlet />
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
                <Routes>
                    {/* 根路由使用布局组件，所有页面作为它的子路由 */}
                    <Route path="/" element={<MainLayout/>}>
                        {/* 子路由：会显示在 MainLayout 的 Outlet 位置 */}
                        {/*<Route index element={<IntroductionPage />} />*/}
                        <Route path="intro/md" element={<IntroPage />} />
                        <Route path="intro/shop" element={<ShopPage />} />
                        <Route path="intro/mod" element={<ModPage />} />
                        <Route path="intro/other" element={<OtherPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
