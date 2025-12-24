import type {StuffData} from "../types/StuffData";

// 资源映射表配置
export const RESOURCE_CONFIG = {
    // 基础资源路径
    ASSET_BASE: "https://asset.territory.mlfc.moe",
    // 图片基础路径
    IMAGE_BASE: "https://img.territory.mlfc.moe",
    // 未知图片路径
    UNKNOWN_IMAGE: "https://img.territory.mlfc.moe/unknown.webp",
    // 数据文件地址
    MAPPING_URL: "https://asset.territory.mlfc.moe/mapping",
    VERSION_URL: "https://asset.territory.mlfc.moe/version",
};

// T = 最终要在 UI 使用的数据类型
// TRaw = 从 JSON 下载下来的原始数据类型 (默认和 T 一样)
export interface DataSource<T, TRaw = T> {
    key: string;
    urls: string[];
    // process 函数接收 TRaw 类型的数组，返回 T 类型的数组
    process?: (data: TRaw[]) => T[];
}

// === 在这里定义所有的数据源 ===
export const DATA_SOURCES = {
    // 物品数据配置
    STUFF: {
        key: 'stuff',
        urls: [`${RESOURCE_CONFIG.ASSET_BASE}/stuff`, `${RESOURCE_CONFIG.ASSET_BASE}/stuff2`],
        // 统一的数据清洗逻辑
        process: (rawList): StuffData[] => {
            return rawList.filter((item: StuffData) => item.disable === 0);
        }
    } as DataSource<StuffData>,

    // 建筑数据配置
    /*
    BUILD: {
        key: 'wiki_build_data',
        urls: [`${ASSET_BASE}/build`],
        process: (rawList: any[]): BuildData[] => rawList
    } as DataSource<BuildData>
    */
};