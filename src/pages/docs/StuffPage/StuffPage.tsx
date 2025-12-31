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
    const {data: items, loading} = useStuffData();

    // 状态管理
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<number | 'all'>('all');
    const [filterSubType, setFilterSubType] = useState<number | 'all'>('all');
    const [selectedItem, setSelectedItem] = useState<StuffData | null>(null);
    const [visibleCount, setVisibleCount] = useState(24);

    // Refs
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const loadingLock = useRef(false);

    // 延迟搜索词
    const deferredSearchTerm = useDeferredValue(searchTerm);

    // --- 数据计算 ---

    // 生成分类树
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
            // 只有当子类型未添加时才计算本地化名称
            if (!typeEntry.subTypes.has(item.stuff_sub_type)) {
                typeEntry.subTypes.set(
                    item.stuff_sub_type,
                    getLocalizedText(item, 'stuff_sub_type_name', i18n.language)
                );
            }
        });
        return tree;
    }, [items, i18n.language]);

    // 可用子类型
    const availableSubTypes = useMemo(() => {
        if (filterType === 'all') return [];
        return Array.from(categoryTree.get(filterType)?.subTypes.entries() || [])
            .map(([id, name]) => ({id, name}));
    }, [filterType, categoryTree]);

    // 过滤物品
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // 类型筛选最快，先判断
            if (filterType !== 'all' && item.stuff_type !== filterType) return false;
            if (filterSubType !== 'all' && item.stuff_sub_type !== filterSubType) return false;

            // 搜索筛选 (最耗时，放在最后)
            if (deferredSearchTerm) {
                const lowerTerm = deferredSearchTerm.toLowerCase();
                // ID 匹配
                if (item.stuff_id.toString().includes(lowerTerm)) return true;
                // 名称匹配
                const name = getLocalizedText(item, 'stuff_name', i18n.language);
                return name.toLowerCase().includes(lowerTerm);
            }
            return true;
        });
    }, [items, deferredSearchTerm, filterType, filterSubType, i18n.language]);

    // --- 事件处理 ---

    const handleSearchChange = (val: string) => { setSearchTerm(val); setVisibleCount(24); };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setFilterType(val === 'all' ? 'all' : Number(val));
        setFilterSubType('all'); // 重置子类型
        setVisibleCount(24);
    };

    const handleSubTypeChange = (val: number | 'all') => {
        setFilterSubType(val);
        setVisibleCount(24);
    };

    // 无限滚动监听
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting && visibleCount < filteredItems.length && !loadingLock.current) {
                loadingLock.current = true;
                // 使用 requestAnimationFrame 或较短的 timeout 来优化体验
                setTimeout(() => {
                    setVisibleCount(prev => prev + 24);
                    loadingLock.current = false;
                }, 300); // 300ms 延迟足以展示加载动画且不显拖沓
            }
        }, { threshold: 0.1 });

        const currentRef = loadMoreRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
            loadingLock.current = false; // 清理时重置锁
        };
    }, [filteredItems.length, visibleCount]); // 依赖项简化

    if (loading) return <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

    // 显示列表切片
    const displayItems = filteredItems.slice(0, visibleCount);

    return (
        <>
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

            {/* 加载更多指示器 */}
            {visibleCount < filteredItems.length && (
                <div ref={loadMoreRef} className="h-20 flex justify-center items-center w-full my-4">
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
        </>
    );
}