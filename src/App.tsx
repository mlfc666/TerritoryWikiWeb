import {useEffect} from 'react'
import './App.css'
import {Navbar} from "./components/Navbar.tsx";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            {/* Navbar 放在布局中，所有页面都会显示 */}
            <Navbar/>
            {/* Outlet 是子页面的占位符，会根据当前路由渲染对应页面 */}
            <Outlet/>
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
                        {/*<Route index element={<HomePage />} /> /!* 首页（/ 路径） *!/*/}
                        {/*<Route path="news" element={<NewsPage />} />*/}
                        {/*<Route path="people" element={<PeoplePage />} />*/}
                        {/*<Route path="projects" element={<ProjectsPage />} />*/}
                        {/*<Route path="publications" element={<PublicationsPage />} />*/}
                        {/*<Route path="resources" element={<ResourcesPage />} />*/}
                        {/*<Route path="contact" element={<ContactPage />} />*/}
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
