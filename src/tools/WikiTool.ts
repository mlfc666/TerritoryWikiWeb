import type {StuffData} from "../types/StuffData.ts";
import React from "react";

const IMAGE_BASE_URL = "https://img.territory.mlfc.moe";

// 获取图片完整 URL
export const getItemImageUrl = (imgName: string) => {
    return `${IMAGE_BASE_URL}/${imgName}.png`;
};
export const getLocalizedText = (item: StuffData, prefix: string, currentLang: string): string => {
    let suffix: string;
    if (currentLang.startsWith('zh')) {
        suffix = 'zh-CN';
    } else if (currentLang === 'zh-TW') {
        suffix = 'zh-TW';
    } else {
        suffix = 'en';
    }

    // 获取值
    const val = item[`${prefix}${suffix}`];
    const fallback = item[`${prefix}en`];

    // 核心修改：使用 String() 包裹，或者模板字符串，确保返回的一定是字符串
    // 逻辑：优先取 val，没有取 fallback，还没有就返回空字符串
    return String(val || fallback || '');
};

// 图片加载失败时的兜底处理
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = "https://img.territory.mlfc.moe/unknown.webp";
};