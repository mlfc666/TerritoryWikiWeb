import React from 'react';
import {useTranslation} from 'react-i18next';
import {useLocation} from "react-router-dom";

interface PageContainerProps {
    transKey: string;
    children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({transKey, children}) => {
    const {t} = useTranslation();
    const location = useLocation();

    // 判断当前是否为科技树页面 , "锁死" 父级滚动条
    const isMapMode = location.pathname.includes('/tech');

    return (
        <div
            className={`
                flex flex-col w-full h-full p-4 md:p-8
                /* 3. 动态切换滚动策略 */
                ${isMapMode ? 'overflow-hidden' : 'overflow-y-auto'}
            `}
        >
            <h1 className="text-3xl font-bold mb-6 flex-shrink-0">
                {t(transKey)}
            </h1>

            <div
                className={`
                    flex-1 w-full min-w-0
                    /* 4. 如果是地图模式，强制子容器不溢出，并将高度限制在剩余空间内 */
                    ${isMapMode ? 'overflow-hidden relative' : ''}
                `}
            >
                {children}
            </div>
        </div>
    );
};