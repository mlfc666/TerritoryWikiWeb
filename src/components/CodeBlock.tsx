import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon, CheckIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTranslation } from "react-i18next";

interface CodeBlockProps {
    language: string;
    children: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
    const { t } = useTranslation();

    const [isDark, setIsDark] = useState(true);
    const [copied, setCopied] = useState(false);
    const [animating, setAnimating] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    const toggleTheme = () => {
        setAnimating(true);
        setIsDark(!isDark);
        setTimeout(() => setAnimating(false), 300);
    };

    const lineNumberStyle = {
        minWidth: '2.5em',
        paddingRight: '1em',
        marginRight: '1em',
        borderRight: `1px solid ${isDark ? '#404040' : '#e5e7eb'}`,
        textAlign: 'right' as const,
        color: isDark ? '#6b7280' : '#9ca3af',
        userSelect: 'none' as const
    };

    return (
        <div className="mockup-code-container my-6 rounded-lg overflow-hidden border border-base-300 shadow-sm bg-base-100">
            {/* 顶部工具栏 */}
            <div className={`flex items-center justify-between px-4 py-2 border-b transition-colors duration-300
                ${isDark
                ? 'bg-[#2b2b2b] border-[#404040] text-gray-200'
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>

                {/* 语言标识 */}
                <div className="flex items-center">
                    <span className="text-xs font-mono uppercase font-bold opacity-80 select-none tracking-wider">
                        {language || 'text'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* 主题切换按钮 */}
                    <button
                        onClick={toggleTheme}
                        className={`p-1.5 rounded-md transition-all duration-300 ${animating ? 'rotate-180' : ''}
                            ${isDark
                            ? 'text-gray-400 hover:text-white hover:bg-white/10'
                            : 'text-gray-500 hover:text-black hover:bg-black/5'}
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
                        title={t('components.CodeBlock.toggle_theme')}
                    >
                        {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                    </button>

                    {/* 复制按钮 */}
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all
                            ${copied ? 'text-success' : ''} 
                            ${!copied && isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : ''}
                            ${!copied && !isDark ? 'text-gray-500 hover:text-black hover:bg-black/5' : ''}
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
                        title={t('components.CodeBlock.copy')}
                    >
                        {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <ClipboardIcon className="w-3.5 h-3.5" />}
                        <span>
                            {copied
                                ? t('components.CodeBlock.copied')
                                : t('components.CodeBlock.copy')
                            }
                        </span>
                    </button>
                </div>
            </div>

            {/* 代码区域 */}
            <div className="relative text-sm font-mono overflow-x-auto">
                <SyntaxHighlighter
                    language={language}
                    style={isDark ? vscDarkPlus : vs}
                    customStyle={{
                        margin: 0,
                        padding: '1.25rem 1rem',
                        background: isDark ? '#1e1e1e' : '#ffffff',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                    }}
                    wrapLines={true}
                    showLineNumbers={true}
                    lineNumberStyle={lineNumberStyle}
                >
                    {children}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};