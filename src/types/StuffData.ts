export interface StuffData {
    stuff_id: number;
    price: number;
    weight: number;
    // 基础信息
    stuff_type: number;
    stuff_type_name: string; // JSON里这个字段写死中文的
    stuff_sub_type: number;

    // 资源索引
    prefab: string;
    stuff_img: string;
    stuff_img_on_map: string;

    // 逻辑属性
    disable: number;
    ignore_in_summary: number;
    can_carry_one_by_one_anytime: number;
    incineration_result: number;
    spoilage_year_limit: number;
    can_pick_up_by_ant: number;

    // 动态多语言字段
    [key: string]: unknown;
}