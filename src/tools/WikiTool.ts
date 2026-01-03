import React from "react";
import { RESOURCE_CONFIG } from "../config/DataSourceConfig";

// 使用配置拼接 URL
export const getItemImageUrl = (imgName: string) => {
    if (!imgName) return "";
    return `${RESOURCE_CONFIG.IMAGE_BASE}/${imgName}.png`;
};

/**
 * 获取本地化文本
 * @param item 数据对象 (unknown 类型，内部断言)
 * @param prefix 字段前缀 (如 "stuff_name" 或 "name")
 * @param currentLang 当前语言代码 (如 "zh-CN", "en-US")
 * @param split 是否需要下划线分隔符 (true: "name_zh-CN", false: "stuff_namezh-CN")
 */
export const getLocalizedText = (
    item: unknown,
    prefix: string,
    currentLang: string,
    split: boolean = false // 默认为 false，兼容旧逻辑
): string => {
    if (!item || typeof item !== 'object') {
        return '';
    }
    const data = item as Record<string, unknown>;
    let suffix: string;
    if (currentLang === 'zh-TW') {
        suffix = 'zh-TW';
    } else if (currentLang.startsWith('zh')) {
        suffix = 'zh-CN';
    } else {
        suffix = 'en';
    }
    const separator = split ? '_' : '';
    const targetKey = `${prefix}${separator}${suffix}`;
    const fallbackKey = `${prefix}${separator}en`;
    const val = data[targetKey];
    const fallback = data[fallbackKey];
    return String(val || fallback || '');
};
// 图片错误处理 (使用配置中的兜底图)
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null; // 防止死循环
    target.src = RESOURCE_CONFIG.UNKNOWN_IMAGE;
};