import React from 'react';
import { useRemoteMarkdown } from '../hooks/useRemoteMarkdown';
import MarkdownRender from './MarkdownRender';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface RemoteMarkdownProps {
    fileName: string;
    className?: string;
}

export const RemoteMarkdownRender: React.FC<RemoteMarkdownProps> = ({ fileName, className = "" }) => {
    const { t } = useTranslation();
    const { content, loading, error } = useRemoteMarkdown(fileName);

    // 加载状态
    if (loading) {
        return (
            <div className={`w-full h-96 flex flex-col items-center justify-center text-base-content/50 ${className}`}>
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <span className="text-sm">{t('components.RemoteMarkdown.loading')}</span>
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <div className="alert alert-error my-4">
                <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
                <span>{t('components.RemoteMarkdown.error')}: {fileName}</span>
            </div>
        );
    }

    // 成功状态
    return (
        <div className={`w-full animation-fade-in ${className}`}>
            <MarkdownRender content={content} />
        </div>
    );
};