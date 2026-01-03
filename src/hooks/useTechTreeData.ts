import { useState, useEffect } from 'react';
import { DATA_SOURCES } from "../config/DataSourceConfig";
import { dataManager } from "../manager/DataManger";
import type { StuffData } from "../types/StuffData";
import type {TechTreeItem, TechInfo, TechNodeConfig} from "../types/TeckData.ts";

export const useTechTreeData = () => {
    const [roots, setRoots] = useState<TechTreeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {

                // 并行加载数据源
                const [infoList, treeConfigList, stuffList] = await Promise.all([
                    dataManager.loadData<TechInfo>(DATA_SOURCES.TECH_INFO),
                    dataManager.loadData<TechNodeConfig>(DATA_SOURCES.TECH_TREE),
                    dataManager.loadData<StuffData>(DATA_SOURCES.STUFF)
                ]);

                // 建立辅助 Map
                const infoMap = new Map<number, TechInfo>();
                infoList.forEach(info => infoMap.set(info.tech_id, info));

                const stuffMap = new Map<number, StuffData>();
                stuffList.forEach(stuff => stuffMap.set(stuff.stuff_id, stuff));

                // 初始化节点
                const nodeMap = new Map<number, TechTreeItem>();

                treeConfigList.forEach(conf => {
                    // 尝试匹配 Stuff 数据
                    const linkedStuff = stuffMap.get(conf.tech_id);

                    nodeMap.set(conf.tech_id, {
                        ...conf,
                        info: infoMap.get(conf.tech_id),
                        stuffData: linkedStuff,
                        children: []
                    });
                });

                // 构建树结构
                const rootNodes: TechTreeItem[] = [];
                nodeMap.forEach(node => {
                    const parentId = node.depend_tech_id;
                    if (parentId && nodeMap.has(parentId)) {
                        nodeMap.get(parentId)!.children.push(node);
                    } else {
                        rootNodes.push(node);
                    }
                });

                setRoots(rootNodes);
            } catch (err) {
                console.error("Failed to build tech tree:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return { roots, loading };
};