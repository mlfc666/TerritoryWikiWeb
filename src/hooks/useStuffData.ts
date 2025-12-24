import {useState, useEffect} from 'react';
import {type DataSource, DATA_SOURCES} from "../config/DataSourceConfig";
import type {StuffData} from "../types/StuffData";
import {dataManager} from "../manager/DataManger.ts";

// 通用 Hook
export function useDataSource<T>(source: DataSource<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dataManager.loadData(source).then(result => {
            setData(result);
            setLoading(false);
        });
    }, [source]); // source配置对象通常是静态的

    return {data, loading};
}

// 专门给 Stuff 用的快捷 Hook
export const useStuffData = () => useDataSource<StuffData>(DATA_SOURCES.STUFF);

// 未来给 Build 用的快捷 Hook
// export const useBuildData = () => useDataSource<BuildData>(DATA_SOURCES.BUILD);