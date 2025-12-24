import React from "react";
import { RESOURCE_CONFIG } from "../config/DataSourceConfig";
import type { StuffData } from "../types/StuffData";

// 使用配置拼接 URL
export const getItemImageUrl = (imgName: string) => {
    if (!imgName) return "";
    return `${RESOURCE_CONFIG.IMAGE_BASE}/${imgName}.png`;
};

// 多语言获取逻辑
export const getLocalizedText = (item: StuffData, prefix: string, currentLang: string): string => {
    let suffix: string;
    if (currentLang.startsWith('zh')) {
        suffix = 'zh-CN';
    } else if (currentLang === 'zh-TW') {
        suffix = 'zh-TW';
    } else {
        suffix = 'en';
    }

    const val = item[`${prefix}${suffix}`];
    const fallback = item[`${prefix}en`];

    return String(val || fallback || '');
};

// 图片错误处理 (使用配置中的兜底图)
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null; // 防止死循环
    target.src = RESOURCE_CONFIG.UNKNOWN_IMAGE;
};