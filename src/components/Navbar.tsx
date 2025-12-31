import {useTranslation} from "react-i18next";
import {setTheme, type ThemeInfo, themeOptions} from "../manager/ThemeManger.ts";
import {type LanguageInfo, languageOptions} from "../manager/i18n.ts";
import type {i18n} from "i18next";
import {LanguageIcon, SparklesIcon} from "@heroicons/react/24/outline";

// 合并后的参数类型（包含 i18n）
interface LanguageChoiceProps extends LanguageInfo {
    i18n: i18n;
}

function ThemeChoice({label, value}: ThemeInfo) {
    return <>
        <li>
            <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                aria-label={label}
                value={value}
                onChange={(theme) => {
                    setTheme(theme.target.value)
                }}
            />
        </li>
    </>
}

function LanguageChoice({label, language, i18n}: LanguageChoiceProps) {
    return <>
        <li>
            <input
                type="radio"
                name="language-dropdown"
                className="w-full btn btn-sm btn-block btn-ghost justify-start"
                aria-label={label}
                value={language}
                onChange={(language) => {
                    void i18n.changeLanguage(language.target.value)
                }}
            />
        </li>
    </>
}

export function Navbar() {
    const {t, i18n} = useTranslation();
    return <>
        <div className="navbar bg-base-100 shadow-sm">
            {/*导航条的开始部分*/}
            <div className="navbar-start">
                {/*Logo*/}
                <div className="avatar ml-4 mr-2">
                    <div className="w-12  rounded-lg">
                        <img src="/logo.webp" alt={"Logo"}/>
                    </div>
                </div>
                {/*团队名称*/}
                {/*下面这个样式的代码是必须的，不然会被吞样式*/}
                <a
                    className={"btn btn-ghost text-left whitespace-pre-line text-xl"}>
                    {t('components.navbar.name')}
                </a>
            </div>
            {/*最右侧的一些按钮*/}
            <div className="navbar-end">
                {/*切换语言的按钮*/}
                <div className="dropdown dropdown-end">
                    <button className="btn btn-ghost">
                        <SparklesIcon className={"w-6 h-6"}/>
                        {t("components.navbar.Theme")}
                    </button>
                    <ul className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-2xl">
                        {themeOptions.map((theme) => (
                            <ThemeChoice
                                key={theme.value}
                                label={theme.label}
                                value={theme.value}
                            />
                        ))}
                    </ul>
                </div>
                {/*切换主题的按钮*/}
                <div className="dropdown dropdown-end">
                    <button className="btn btn-ghost">
                        <LanguageIcon className={"w-6 h-6"}/>
                        {t("language")}
                    </button>
                    <ul className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-2xl">
                        {languageOptions.map((language) => {
                            return <LanguageChoice
                                key={language.language}
                                label={language.label}
                                language={language.language}
                                i18n={i18n}
                            />
                        })}
                    </ul>
                </div>
            </div>
        </div>
    </>
}