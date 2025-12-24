import { useState, useEffect } from 'react';
import type { StuffData } from "../types/StuffData.ts";

// 内存缓存变量
let cachedStuffData: StuffData[] | null = null;

export const useStuffData = () => {
    const [data, setData] = useState<StuffData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            // 优先使用缓存数据
            if (cachedStuffData) {
                setData(cachedStuffData);
                setLoading(false);
                return;
            }

            try {
                // 并行请求两个数据源
                const [res1, res2] = await Promise.all([
                    fetch('https://asset.territory.mlfc.moe/stuff'),
                    fetch('https://asset.territory.mlfc.moe/stuff2')
                ]);
                const data1 = await res1.json();
                const data2 = await res2.json();

                // 合并数据并过滤掉禁用项
                const allItems = [...data1, ...data2].filter((item: StuffData) => item.disable === 0);

                // 写入缓存并更新状态
                cachedStuffData = allItems;
                setData(allItems);
            } catch (error) {
                console.error("Failed to fetch wiki data:", error);
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, []);

    return { data, loading };
};