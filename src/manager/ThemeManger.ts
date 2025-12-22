// 主题列表接口
export interface ThemeInfo {
    label: string;
    value: string;
}

// 主题列表数据
export const themeOptions: ThemeInfo[] = [
    {label: "Light", value: "light"},
    {label: "Dark", value: "dark"},
    {label: "Corporate", value: "corporate"},
    {label: "Lofi", value: "lofi"},
    {label: "Pastel", value: "pastel"},
    {label: "Fantasy", value: "fantasy"},
    {label: "Wireframe", value: "wireframe"},
    {label: "Dracula", value: "dracula"},
    {label: "Cmyk", value: "cmyk"},
    {label: "Autumn", value: "autumn"},
    {label: "Night", value: "night"},
    {label: "Winter", value: "winter"},
    {label: "Dim", value: "dim"},
    {label: "Caramellatte", value: "caramellatte"},
    {label: "Silk", value: "silk"},
];

// 切换并持久化主题
export const setTheme = (theme: string) => {
    // 1. 应用主题到 HTML 元素（DaisyUI 会监听 data-theme 变化）
    document.documentElement.setAttribute('data-theme', theme);
    // 2. 保存到 localStorage，键名可自定义（如 'daisyui-theme'）
    localStorage.setItem('daisyui-theme', theme);
};