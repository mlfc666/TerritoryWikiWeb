// 基础科技描述信息 (来自 /tech 文件)
import type {StuffData} from "./StuffData.ts";

export interface TechInfo {
    txt_id: number;
    tech_id: number;
    facility_id: number;
    seed_id: string;
    event_id: string;

    // 动态多语言字段处理
    [key: string]: unknown;
}

// 科技树节点配置 (来自 /tech_tree 文件)
export interface TechNodeConfig {
    tech_id: number;
    depend_tech_id: number; // 0 或 null 代表根节点
    // 消耗属性
    tech_points: number;
    silver: number;
    people_count: number;
    // 状态属性
    disable: number;
    can_research: number;
}

// 最终在页面使用的聚合类型 (节点 + 描述 + 递归子节点)
export interface TechTreeItem extends TechNodeConfig {
    // 将描述信息合并进来
    info?: TechInfo;
    // 递归子节点数组
    children: TechTreeItem[];
    stuffData?: StuffData;
}