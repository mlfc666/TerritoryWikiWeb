import React, { useRef, useState, useEffect } from 'react';
import { TreeNode } from "./components/TreeNode";
import {useTechTreeData} from "../../../hooks/useTechTreeData.ts";
import {useTranslation} from "react-i18next";

export default function TechTreePage() {
    const { roots, loading } = useTechTreeData();
    const {t} = useTranslation()
    // --- 拖拽核心逻辑 ---
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // 记录拖拽开始时的鼠标位置和滚动条位置
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, left: 0, top: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        // 标记开始拖拽
        setIsDragging(true);

        // 记录初始数据
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            left: containerRef.current.scrollLeft,
            top: containerRef.current.scrollTop
        });

        // 优化体验：防止拖拽时选中文本
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        // 计算鼠标位移量
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        // 反向应用到滚动条 (鼠标往左拖 = 视野往右移 = 滚动条变大)
        containerRef.current.scrollLeft = dragStart.left - deltaX;
        containerRef.current.scrollTop = dragStart.top - deltaY;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // 确保鼠标移出浏览器或松开时也能停止拖拽
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        // 外层容器：占满父级给予的空间 (w-full h-full)
        <div className="w-full h-full p-4 box-border overflow-hidden">

            <div
                ref={containerRef}
                className={`
                    /* 布局与尺寸 */
                    relative w-full h-full
                    
                    /* 视觉样式 */
                    border border-base-300 rounded-xl bg-base-100/30 shadow-inner
                    
                    overflow-auto  /* 允许内容溢出滚动 */
                    cursor-grab    /* 默认显示抓手 */
                    select-none    /* 禁止选中文字 */
                    
                    ${isDragging ? 'cursor-grabbing' : ''} /* 拖拽时显示抓紧手势 */
                `}

                /* 隐藏滚动条的核心样式 */
                style={{
                    scrollbarWidth: 'none',  /* Firefox */
                    msOverflowStyle: 'none', /* IE/Edge */
                }}

                /* 绑定事件 */
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp} // 鼠标离开区域也停止
            >
                {/* 针对 Chrome/Safari 隐藏滚动条 */}
                <style>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>
s
                {/* 内容区域：min-w-max 确保横向撑开，防止折行 */}
                <div className="p-10 min-w-max min-h-max flex flex-col gap-12 pb-20">
                    {roots.map(root => (
                        <TreeNode key={root.tech_id} node={root} />
                    ))}
                </div>

                {/* 提示层：固定在视口右下角 */}
                <div className="fixed bottom-8 right-8 z-50 pointer-events-none opacity-60 text-xs bg-base-100/80 p-2 rounded backdrop-blur-sm border border-base-200 shadow-sm flex items-center gap-2">
                    <span>{t("pages.TechTreePage.mouse_drag")}</span>
                </div>
            </div>
        </div>
    );
}