// src/i18n.js
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import Backend from 'i18next-http-backend'; // 加载翻译文件
import LanguageDetector from 'i18next-browser-languagedetector'; // 检测浏览器语言


// 主题列表接口
export interface LanguageInfo {
    label: string;
    language: string;
}

export const languageOptions: LanguageInfo[] = [
    {label: "English", language: "en"},
    {label: "简体中文", language: "zh"},
    {label: "繁體中文", language: "zh-TW"},
];
// 初始化i18n
i18n
    // 加载翻译文件（必须在init前注册）
    .use(Backend)
    // 检测浏览器语言（可选，会优先使用检测到的语言）
    .use(LanguageDetector)
    // 绑定react-i18next
    .use(initReactI18next)
    // 配置核心参数
    .init({
        fallbackLng: 'zh', // 当检测不到语言时的默认语言
        interpolation: {
            escapeValue: false, // React已经处理了XSS，不需要额外转义
        },
        // 支持的语言列表
        supportedLngs: languageOptions.map(option => option.language),
        // 翻译文件的命名空间（默认用translation）
        ns: ['translation'],
        defaultNS: 'translation',
        // 后端加载配置（指定翻译文件路径）
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // 路径格式：语言/命名空间.json
        },
    });