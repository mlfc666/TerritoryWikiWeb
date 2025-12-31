import React from 'react';
import { useTranslation } from 'react-i18next';

interface PageContainerProps {
    transKey: string;
    children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ transKey, children }) => {
    const { t } = useTranslation();

    return (
        // p-4 (移动端 16px) md:p-8 (桌面端 32px)
        <div className="flex flex-col w-full h-full p-4 md:p-8 overflow-y-auto">
            {/* 标题与内容之间增加 gap-6 (24px) */}
            <h1 className="text-3xl font-bold mb-6">{t(transKey)}</h1>

            <div className="flex-1 w-full min-w-0">
                {children}
            </div>
        </div>
    );
};