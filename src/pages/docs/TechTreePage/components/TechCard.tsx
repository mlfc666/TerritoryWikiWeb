import React from 'react';
import {useTranslation} from 'react-i18next';
import {LockClosedIcon, NoSymbolIcon} from '@heroicons/react/24/solid';
import {RESOURCE_CONFIG} from "../../../../config/DataSourceConfig";
import {getLocalizedText} from "../../../../tools/WikiTool";
import {resourceManager} from "../../../../manager/ResourceManager";
import type {TechTreeItem} from "../../../../types/TeckData";

interface TechCardProps {
    node: TechTreeItem;
}

export const TechCard: React.FC<TechCardProps> = ({node}) => {
    const {t, i18n} = useTranslation();

    let title = `Tech-${node.tech_id}`;
    if (node.stuffData) {
        title = getLocalizedText(node.stuffData, 'stuff_name', i18n.language);
    }

    const desc = node.info ? getLocalizedText(node.info, 'tech_desc', i18n.language, true) : 'No Description';
    const iconUrl = resourceManager.getImageUrl(node.tech_id);
    const silverIconUrl = resourceManager.getImageUrl(607001);

    const hasCost = node.tech_points > 0 || node.silver > 0 || node.people_count > 0;

    const isDisabled = node.disable === 1;
    const isLocked = node.can_research === 0;

    return (
        <div
            className={`tooltip tooltip-bottom hover:z-50 transition-none ${isDisabled ? 'tooltip-error' : ''}`}
            data-tip={isDisabled ? t("pages.TechTreePage.tech_disabled") : desc}
        >
            <div
                className={`
                    card w-48 shadow-sm border transition-all cursor-pointer overflow-hidden relative group rounded-md
                    ${isDisabled
                    ? 'bg-base-200 border-base-200 grayscale opacity-60 cursor-not-allowed'
                    : isLocked
                        ? 'bg-base-200/50 border-base-300'
                        : 'bg-base-100 border-base-300 hover:border-primary hover:shadow-md'
                }
                `}
            >
                <div
                    className="absolute top-0 left-0 px-1.5 py-0.5 bg-base-100/90 rounded-br rounded-tl-md text-[9px] text-base-content/40 font-mono font-bold select-none z-20 border-b border-r border-t border-l border-base-200 backdrop-blur-sm">
                    #{node.tech_id}
                </div>

                {isDisabled && (
                    <div className="absolute top-1 right-1 z-20 text-error">
                        <NoSymbolIcon className="w-4 h-4"/>
                    </div>
                )}
                {!isDisabled && isLocked && (
                    <div className="absolute top-1 right-1 z-20 text-warning/80" title="不可研究">
                        <LockClosedIcon className="w-4 h-4"/>
                    </div>
                )}

                <div className="flex flex-row p-2 items-center gap-2 mt-2">
                    <div className="avatar">
                        <div
                            className={`w-9 h-9 rounded-md border border-base-200/50 ${isLocked ? 'bg-base-300' : 'bg-base-200'}`}>
                            <img
                                src={iconUrl}
                                alt={String(node.tech_id)}
                                loading="lazy"
                                className={`object-contain w-full h-full ${isLocked ? 'opacity-50' : ''}`}
                                onError={(e) => e.currentTarget.src = RESOURCE_CONFIG.UNKNOWN_IMAGE}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 text-left justify-center">
                        <h3 className={`text-xs font-bold truncate leading-tight mb-1 ${isLocked ? 'text-base-content/60' : ''}`}>
                            {title}
                        </h3>

                        {hasCost && !isDisabled ? (
                            <div className="flex flex-wrap gap-1">
                                {node.tech_points > 0 && (
                                    <div
                                        className={`badge badge-outline badge-xs h-3.5 px-1 font-mono text-[9px] border-opacity-50 ${isLocked ? 'badge-ghost' : 'badge-primary'}`}>
                                        ⚡{node.tech_points}
                                    </div>
                                )}
                                {node.silver > 0 && (
                                    <div
                                        className={`badge badge-outline badge-xs h-3.5 px-1 gap-0.5 font-mono text-[9px] border-opacity-50 ${isLocked ? 'badge-ghost' : 'badge-secondary'}`}>
                                        <img src={silverIconUrl} className="w-2 h-2" alt="Ag"/>
                                        {node.silver}
                                    </div>
                                )}
                                {node.people_count > 0 && (
                                    <div
                                        className={`badge badge-outline badge-xs h-3.5 px-1 gap-0.5 font-mono text-[9px] border-opacity-50 ${isLocked ? 'badge-ghost' : 'badge-neutral'}`}>
                                        👥 {node.people_count}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-[9px] text-base-content/30 italic scale-90 origin-left">
                                {isDisabled ? "Disabled" : "No Cost"}
                            </div>
                        )}
                    </div>
                </div>

                {isLocked && !isDisabled && (
                    <div className="absolute inset-0 bg-base-content/5 pointer-events-none"
                         style={{
                             backgroundImage: 'radial-gradient(circle, #00000011 1px, transparent 1px)',
                             backgroundSize: '4px 4px'
                         }}>
                    </div>
                )}
            </div>
        </div>
    );
};