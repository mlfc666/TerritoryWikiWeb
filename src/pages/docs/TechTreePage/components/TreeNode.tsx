import React from 'react';
import type { TechTreeItem } from "../../../../types/TeckData";
import { TechCard } from "./TechCard";

interface TreeNodeProps {
    node: TechTreeItem;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-row items-center">
            {/* 节点本体区域 */}
            <div className="flex flex-col justify-center py-1.5 pr-8 relative">
                <TechCard node={node} />

                {/* 向右伸出的连接线 */}
                {hasChildren && (
                    <div className="absolute right-0 top-1/2 w-8 h-px bg-base-content/30 translate-x-0"></div>
                )}
            </div>

            {/* 子节点列表区域 */}
            {hasChildren && (
                <div className="flex flex-col justify-center">
                    {node.children.map((child, index) => {
                        const isFirst = index === 0;
                        const isLast = index === node.children.length - 1;
                        const isSingle = node.children.length === 1;

                        return (
                            <div key={child.tech_id} className="flex flex-row relative">
                                {/* 连接线占位符: w-8 (32px) */}
                                <div className="w-8 relative flex-shrink-0">
                                    {/* 水平连线 */}
                                    <div className="absolute top-1/2 left-0 w-full h-px bg-base-content/30"></div>

                                    {/* 垂直脊柱线 */}
                                    {!isSingle && (
                                        <div className={`absolute w-px bg-base-content/30 left-0
                                            ${isFirst ? 'top-1/2 h-1/2' : ''} 
                                            ${isLast ? 'top-0 h-1/2' : ''}
                                            ${!isFirst && !isLast ? 'top-0 h-full' : ''}
                                        `}></div>
                                    )}
                                </div>

                                <TreeNode node={child} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};