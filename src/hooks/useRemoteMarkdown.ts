import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RESOURCE_CONFIG } from '../config/DataSourceConfig';

// 全局内存缓存 (URL -> Content)，防止切页面重复请求
const markdownCache = new Map<string, string>();

export const useRemoteMarkdown = (fileName: string) => {
    const { i18n } = useTranslation();
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchMarkdown = async () => {
            setLoading(true);
            setError(null);

            // 1. 处理语言映射逻辑
            // 假设你的服务器只有 'zh' 和 'en' 两个目录
            // 如果 i18n 是 zh-CN, zh-TW 等，统一映射为 zh
            const langPath = i18n.language.startsWith('zh') ? 'zh' : 'en';

            // 2. 拼接完整 URL
            const url = `${RESOURCE_CONFIG.MD_BASE}/${langPath}/${fileName}`;

            // 3. 检查缓存
            if (markdownCache.has(url)) {
                if (isMounted) {
                    setContent(markdownCache.get(url)!);
                    setLoading(false);
                }
                return;
            }

            try {
                // 4. 发起请求
                const response = await fetch(url);

                if (!response.ok) {
                    console.error(`Markdown fetch failed: ${response.status}`);
                    return;
                }

                const text = await response.text();

                // 5. 写入缓存并更新状态
                markdownCache.set(url, text);

                if (isMounted) {
                    setContent(text);
                }
            } catch (err) {
                console.error("Failed to load markdown:", err);
                if (isMounted) {
                    setError("Failed to load document.");
                    // 加载失败时，给一个友好的提示或者空内容
                    setContent(`# Error Loading Document\n\nCould not fetch: ${fileName}`);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchMarkdown();

        return () => {
            isMounted = false;
        };
    }, [fileName, i18n.language]); // 当文件名或语言改变时重新获取

    return { content, loading, error };
};