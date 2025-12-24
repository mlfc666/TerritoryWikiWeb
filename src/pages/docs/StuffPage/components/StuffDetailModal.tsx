import {useEffect, useRef} from "react";
import {getItemImageUrl, getLocalizedText, handleImageError} from "../../../../tools/WikiTool.ts";
import UnityRichText from "../../../../components/UnityRichText.tsx";
import type {StuffData} from "../../../../types/StuffData.ts";
import type {TFunction,i18n} from "i18next";

import React from 'react';

// 定义 Props 类型
type InfoRowProps = {
    label1: React.ReactNode; // 支持字符串、数字或组件
    val1: React.ReactNode;
    label2: React.ReactNode;
    val2: React.ReactNode;
    className1?: string;     // ? 表示可选，因为你有默认值 = ""
    className2?: string;
};

const InfoRow = ({ label1, val1, label2, val2, className1 = "", className2 = "" }: InfoRowProps) => (
    <tr>
        <th className="w-[15%] whitespace-nowrap align-middle">{label1}</th>
        <td className={`w-[35%] align-middle ${className1}`}>{val1}</td>
        <th className="w-[15%] whitespace-nowrap align-middle">{label2}</th>
        <td className={`w-[35%] align-middle ${className2}`}>{val2}</td>
    </tr>
);

export const StuffDetailModal = ({ item, t, i18n, onClose }: { item: StuffData | null, t: TFunction<"translation", undefined>, i18n: i18n, onClose: () => void }) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    // 监听传入物品变化以打开模态框
    useEffect(() => {
        if (item && modalRef.current) {
            modalRef.current.showModal();
        }
    }, [item]);

    return (
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
            {item && (
                <div className="modal-box w-11/12 max-w-4xl">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* 左侧图片与描述区域 */}
                        <div className="flex flex-col items-center w-full md:w-1/3 gap-4">
                            <div className="w-40 h-40 bg-base-200 rounded-box flex items-center justify-center p-4">
                                <img
                                    src={getItemImageUrl(item.stuff_img)}
                                    className="max-w-full max-h-full drop-shadow-lg"
                                    onError={handleImageError}
                                    alt={getLocalizedText(item, 'stuff_name', i18n.language)}
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-2xl">
                                    {getLocalizedText(item, 'stuff_name', i18n.language)}
                                </h3>
                                <p className="text-sm opacity-70 mt-2 whitespace-pre-wrap">
                                    <UnityRichText text={getLocalizedText(item, 'desc', i18n.language)} />
                                </p>
                            </div>
                        </div>

                        {/* 右侧详细属性表格 */}
                        <div className="w-full md:w-2/3 overflow-x-auto">
                            <h4 className="text-lg font-bold mb-2 divider divider-start">{t("pages.StuffPage.detail")}</h4>
                            <table className="table table-zebra table-xs sm:table-sm w-full table-fixed">
                                <tbody>
                                <InfoRow
                                    label1="ID" val1={item.stuff_id} className1="font-mono truncate"
                                    label2={t("pages.StuffPage.category")}
                                    val2={`${item.stuff_type_name} / ${getLocalizedText(item, 'stuff_sub_type_name', i18n.language)}`}
                                    className2="truncate"
                                />
                                <InfoRow
                                    label1={t("pages.StuffPage.price")} val1={item.price}
                                    label2={t("pages.StuffPage.weight")} val2={item.weight}
                                />
                                <InfoRow
                                    label1={t("pages.StuffPage.prefab")} val1={item.prefab} className1="font-mono truncate"
                                    label2={t("pages.StuffPage.map_icon")} val2={item.stuff_img_on_map} className2="font-mono truncate"
                                />
                                <InfoRow
                                    label1={t("pages.StuffPage.ignore_summary")}
                                    val1={item.ignore_in_summary === 1 ? t("pages.StuffPage.yes") : t("pages.StuffPage.no")}
                                    label2={t("pages.StuffPage.ant_carry")}
                                    val2={item.can_pick_up_by_ant === 1 ? t("pages.StuffPage.yes") : t("pages.StuffPage.no")}
                                />
                                <InfoRow
                                    label1={t("pages.StuffPage.incineration")}
                                    val1={item.incineration_result === 0 ? t("pages.StuffPage.none") : item.incineration_result}
                                    label2={t("pages.StuffPage.spoilage")}
                                    val2={item.spoilage_year_limit === 0 ? t("pages.StuffPage.permanent") : `${item.spoilage_year_limit} 年`}
                                />
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">{t("pages.StuffPage.close")}</button>
                        </form>
                    </div>
                </div>
            )}
        </dialog>
    );
};