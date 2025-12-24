import React, {useState, useMemo, useDeferredValue, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import type {StuffData} from "../../../types/StuffData.ts";
import {useStuffData} from "../../../hooks/useStuffData.ts";
import {StuffFilterBar} from "./components/StuffFilterBar.tsx";
import {StuffDetailModal} from "./components/StuffDetailModal.tsx";
import {StuffCard} from "./components/StuffCard.tsx";
import {getLocalizedText} from "../../../tools/WikiTool.ts";

// 分类树结构类型
type CategoryStructure = {
    name: string;
    subTypes: Map<number, string>;
};

export default function StuffPage() {
    const {t, i18n} = useTranslation();

    // 使用自定义钩子获取数据
    const {data: items, loading} = useStuffData();

    // 页面内部状态管理
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<number | 'all'>('all');
    const [filterSubType, setFilterSubType] = useState<number | 'all'>('all');
    const [selectedItem, setSelectedItem] = useState<StuffData | null>(null);

    // 控制当前显示的物品数量
    const [visibleCount, setVisibleCount] = useState(24);

    // 引用底部的哨兵元素用于无限滚动
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // 这是一个锁，防止在延迟等待期间重复触发加载
    const loadingLock = useRef(false);

    // 创建一个延迟的搜索词
    const deferredSearchTerm = useDeferredValue(searchTerm);

    // 动态生成分类树结构
    const categoryTree = useMemo(() => {
        const tree = new Map<number, CategoryStructure>();
        items.forEach(item => {
            if (!tree.has(item.stuff_type)) {
                tree.set(item.stuff_type, {
                    name: item.stuff_type_name,
                    subTypes: new Map()
                });
            }
            const typeEntry = tree.get(item.stuff_type)!;
            if (!typeEntry.subTypes.has(item.stuff_sub_type)) {
                const subName = getLocalizedText(item, 'stuff_sub_type_name', i18n.language);
                typeEntry.subTypes.set(item.stuff_sub_type, subName);
            }
        });
        return tree;
    }, [items, i18n.language]);

    // 获取当前选中大类下的子类列表
    const availableSubTypes = useMemo(() => {
        if (filterType === 'all') return [];
        const entry = categoryTree.get(filterType);
        return entry ? Array.from(entry.subTypes.entries()).map(([id, name]) => ({id, name})) : [];
    }, [filterType, categoryTree]);

    // 核心筛选逻辑
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            let matchSearch = true;
            if (deferredSearchTerm) {
                const lowerTerm = deferredSearchTerm.toLowerCase();
                const name = getLocalizedText(item, 'stuff_name', i18n.language);
                matchSearch = item.stuff_id.toString().includes(lowerTerm) || name.toLowerCase().includes(lowerTerm);
            }
            const matchType = filterType === 'all' || item.stuff_type === filterType;
            const matchSubType = filterSubType === 'all' || item.stuff_sub_type === filterSubType;
            return matchSearch && matchType && matchSubType;
        });
    }, [items, deferredSearchTerm, filterType, filterSubType, i18n.language]);

    // 真正用于渲染的数据是经过截取的
    const displayItems = useMemo(() => {
        return filteredItems.slice(0, visibleCount);
    }, [filteredItems, visibleCount]);

    // 处理搜索输入变化
    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        setVisibleCount(24);
    };

    // 处理大类切换
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setFilterType(val === 'all' ? 'all' : Number(val));
        setFilterSubType('all');
        setVisibleCount(24);
    };

    // 处理子类切换
    const handleSubTypeChange = (val: number | 'all') => {
        setFilterSubType(val);
        setVisibleCount(24);
    };

    // 监听底部元素实现无限滚动 (带1秒延迟)
    useEffect(() => {
        let timer: number; // 用于清理定时器

        const observer = new IntersectionObserver(
            (entries) => {
                // 如果底部元素进入视野 且 还没加载完 且 当前没有正在进行的加载任务
                if (entries[0].isIntersecting && visibleCount < filteredItems.length && !loadingLock.current) {

                    // 上锁，防止重复触发
                    loadingLock.current = true;

                    // 人为延迟 1000 毫秒 (1秒)
                    timer = window.setTimeout(() => {
                        setVisibleCount((prev) => prev + 24);
                        // 加载完成后开锁，允许下一次触发
                        loadingLock.current = false;
                    }, 1000);
                }
            },
            {
                threshold: 0.1,
            }
        );
        // 将当前的 DOM 节点复制给一个局部变量
        const currentSentinel = loadMoreRef.current;
        // 使用局部变量进行观察
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }
        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }

            clearTimeout(timer);
            loadingLock.current = false;
        };
    }, [filteredItems, visibleCount]);

    if (loading) return <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span>
    </div>;

    return (
        <div className="p-4 md:p-8">
            <StuffFilterBar
                t={t}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterType={filterType}
                onTypeChange={handleTypeChange}
                filterSubType={filterSubType}
                onSubTypeChange={handleSubTypeChange}
                categoryTree={categoryTree}
                availableSubTypes={availableSubTypes}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayItems.map((item) => (
                    <StuffCard
                        key={item.stuff_id}
                        item={item}
                        language={i18n.language}
                        onClick={() => setSelectedItem(item)}
                    />
                ))}
            </div>

            {/* 这是一个看不见的哨兵元素，当滚动到这里时自动触发加载 */}
            {visibleCount < filteredItems.length && (
                <div ref={loadMoreRef} className="h-20 flex justify-center items-center w-full my-4">
                    {/* 显示加载动画，让用户能感觉到正在加载 */}
                    <span className="loading loading-spinner loading-md text-base-content/50"></span>
                    <span className="ml-2 text-sm text-base-content/50">{t('loading')}</span>
                </div>
            )}

            <StuffDetailModal
                item={selectedItem}
                t={t}
                i18n={i18n}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
}