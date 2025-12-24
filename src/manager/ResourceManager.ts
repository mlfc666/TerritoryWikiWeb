import { RESOURCE_CONFIG } from "../config/DataSourceConfig";

const STORAGE_KEY_MAPPING = 'mapping';

class ResourceManager {
    private mapping: Record<string, string> | null = null;

    async init() {
        // 内存缓存检查
        if (this.mapping) return;

        // 本地缓存检查
        // 如果版本变了，DataManager 会负责清理这个 Key
        const localData = localStorage.getItem(STORAGE_KEY_MAPPING);
        if (localData) {
            try {
                this.mapping = JSON.parse(localData);
                return;
            } catch (e) {
                console.warn("Corrupted local mapping data", e);
                localStorage.removeItem(STORAGE_KEY_MAPPING);
            }
        }

        // 网络请求
        try {
            const res = await fetch(RESOURCE_CONFIG.MAPPING_URL);
            this.mapping = await res.json();

            // 写入缓存
            try {
                if (this.mapping) {
                    localStorage.setItem(STORAGE_KEY_MAPPING, JSON.stringify(this.mapping));
                }
            } catch (e) {
                console.warn("Storage quota exceeded for mapping", e);
            }
        } catch (e) {
            console.error("Failed to load image mapping", e);
            this.mapping = {};
        }
    }

    getImageUrl(id: string | number) {
        const idStr = String(id);
        const fileName = this.mapping?.[idStr];

        const finalName = fileName ? fileName : `${idStr}.png`;
        const safeName = finalName.endsWith('.png') ? finalName : `${finalName}.png`;

        return `${RESOURCE_CONFIG.IMAGE_BASE}/${safeName}`;
    }

    // 提供一个清理缓存的方法
    clearCache() {
        this.mapping = null;
        localStorage.removeItem(STORAGE_KEY_MAPPING);
    }
}

export const resourceManager = new ResourceManager();