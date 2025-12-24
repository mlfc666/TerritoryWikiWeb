import {getItemImageUrl, getLocalizedText, handleImageError} from "../../../../tools/WikiTool.ts";
import type {StuffData} from "../../../../types/StuffData.ts";
import {memo} from "react";


export const StuffCard = memo(({ item, language, onClick }: { item: StuffData,language: string, onClick: () => void }) => {
    const name = getLocalizedText(item, 'stuff_name', language);

    return (
        <div
            onClick={onClick}
            className="card bg-base-100 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-base-200 hover:-translate-y-1"
        >
            <figure className="px-4 pt-4 bg-base-200/50 h-32 flex items-center justify-center">
                <img
                    src={getItemImageUrl(item.stuff_img)}
                    alt={name}
                    className="max-h-24 w-auto object-contain drop-shadow-md"
                    loading="lazy"
                    onError={handleImageError}
                />
            </figure>
            <div className="card-body p-4 gap-1">
                <h2 className="card-title text-sm md:text-base line-clamp-1" title={name}>
                    {name}
                </h2>
                <div className="flex justify-between items-end text-xs text-base-content/70">
                    <span className="badge badge-sm badge-ghost">ID: {item.stuff_id}</span>
                    {item.price > 0 && <span className="text-warning font-bold">¥ {item.price}</span>}
                </div>
            </div>
        </div>
    );
});