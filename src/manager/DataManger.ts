import { RESOURCE_CONFIG, type DataSource } from "../config/DataSourceConfig";
import {resourceManager} from "./ResourceManager.ts";

const STORAGE_KEY_VERSION = 'version';

class DataManager {
    // 这是一个数组，但里面存的具体结构未知
    private cache: Map<string, unknown[]> = new Map();

    // 版本号
    private currentVersion: string = '';

    // 加载版本号，判断是否需要更新
    async initialize() {
        try {
            const res = await fetch(RESOURCE_CONFIG.VERSION_URL);
            const remoteVersion = (await res.text()).trim();
            const localVersion = localStorage.getItem(STORAGE_KEY_VERSION);

            this.currentVersion = remoteVersion;

            if (remoteVersion !== localVersion) {
                console.log(`[DataManager] Version update: ${localVersion} -> ${remoteVersion}`);
                localStorage.setItem(STORAGE_KEY_VERSION, remoteVersion);
                // 版本变了，清空内存缓存
                this.cache.clear();
                resourceManager.clearCache();
            } else {
                console.log(`[DataManager] Version match: ${localVersion}`);
            }
        } catch (e) {
            console.error("Failed to init DataManager", e);
        }
    }

    // 通用加载方法
    async loadData<T, TRaw = T>(source: DataSource<T, TRaw>): Promise<T[]> {
        // 查内存
        if (this.cache.has(source.key)) {
            return this.cache.get(source.key) as T[];
        }

        // 查本地缓存
        const localData = localStorage.getItem(source.key);
        const storedVersion = localStorage.getItem(STORAGE_KEY_VERSION);

        if (localData && storedVersion === this.currentVersion) {
            try {
                const parsed = JSON.parse(localData);
                this.cache.set(source.key, parsed);
                return parsed as T[];
            } catch (e) {
                console.warn("Corrupted local data", e);
            }
        }

        // 网络请求
        console.log(`[DataManager] Fetching network data for: ${source.key}`);
        try {
            const responses = await Promise.all(source.urls.map(url => fetch(url).then(r => r.json())));

            // 这里 combinedData 暂时是 any[]，因为 r.json() 返回 any
            const combinedData = responses.flat() as TRaw[];

            let finalData: T[];

            // 执行预处理
            if (source.process) {
                finalData = source.process(combinedData);
            } else {
                // 如果没有 process，说明 TRaw 就是 T
                finalData = combinedData as unknown as T[];
            }

            // 写入缓存
            this.cache.set(source.key, finalData); // finalData 是 T[]，可以赋值给 unknown[]

            try {
                localStorage.setItem(source.key, JSON.stringify(finalData));
                localStorage.setItem(STORAGE_KEY_VERSION, this.currentVersion);
            } catch (e) {
                console.warn("Storage quota exceeded", e);
            }

            return finalData;
        } catch (error) {
            console.error(`Failed to load ${source.key}`, error);
            if (localData) return JSON.parse(localData) as T[];
            return [];
        }
    }
}

export const dataManager = new DataManager();