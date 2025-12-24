import React, {useEffect, useState} from "react";
import {resourceManager} from "../manager/ResourceManager.ts";
import {dataManager} from "../manager/DataManger.ts";
import {useTranslation} from "react-i18next";

export const GameDataLoader = ({children}: { children: React.ReactNode }) => {
    const [ready, setReady] = useState(false);
    const {t} = useTranslation()
    useEffect(() => {
        const initSystem = async () => {
            // 并行初始化：版本检查 和 图片映射表
            await dataManager.initialize();
            await resourceManager.init();
            setReady(true);
        };
        void initSystem();
    }, []);

    if (!ready) {
        return (
            // 最外层容器：保持全屏居中 (保持原样)
            <div className="h-screen w-full flex items-center justify-center bg-base-100">
                <div className="text-center flex flex-col items-center">
                    <div className="relative flex items-center justify-center w-32 h-32 mb-6">

                        {/*Logo图片*/}
                        <img
                            src="/logo.webp"
                            alt="Loading Logo"
                            className="w-20 h-20 object-contain p-2 z-10 rounded-2xl"
                        />

                        {/*外部旋转的圆环*/}
                        <div className="absolute inset-0 w-full h-full rounded-full border-[6px] border-primary/20 border-t-primary animate-spin z-0"></div>
                    </div>
                    <p className="text-lg font-medium text-base-content/70 animate-pulse">
                        {t("loading")}...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};