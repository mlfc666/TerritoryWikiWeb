import React from 'react';
import type {TFunction} from "i18next";

interface FilterProps {
    t: TFunction<"translation", undefined>;
    searchTerm: string;
    onSearchChange: (val: string) => void;
    filterType: number | 'all';
    onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    filterSubType: number | 'all';
    onSubTypeChange: (val: number | 'all') => void;
    categoryTree: Map<number, { name: string }>;
    availableSubTypes: { id: number; name: string }[];
}

export const StuffFilterBar: React.FC<FilterProps> = ({
                                                          t,
                                                          searchTerm,
                                                          onSearchChange,
                                                          filterType,
                                                          onTypeChange,
                                                          filterSubType,
                                                          onSubTypeChange,
                                                          categoryTree,
                                                          availableSubTypes
                                                      }) => (
    <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">{t("pages.StuffPage.stuff_title")}</h1>
        <div className="flex flex-col md:flex-row gap-2">
            <input
                type="text"
                placeholder={t("pages.StuffPage.search_placeholder")}
                className="input input-bordered w-full md:w-64"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <select
                className="select select-bordered w-full md:w-48"
                value={filterType}
                onChange={onTypeChange}
            >
                <option value="all">{t("pages.StuffPage.filter_all_types")}</option>
                {Array.from(categoryTree.entries()).map(([id, data]) => (
                    <option key={id} value={id}>{data.name}</option>
                ))}
            </select>
            <select
                className="select select-bordered w-full md:w-48"
                value={filterSubType}
                onChange={(e) => onSubTypeChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                disabled={filterType === 'all'}
            >
                <option value="all">{t("pages.StuffPage.filter_all_subtypes")}</option>
                {availableSubTypes.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
            </select>
        </div>
    </div>
);