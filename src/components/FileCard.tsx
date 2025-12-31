import React from 'react';
import { CubeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface FileCardProps {
    href: string;
    fileName: string;
}

export const FileCard: React.FC<FileCardProps> = ({ href, fileName }) => {
    const isZip = href.endsWith('.zip');

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline group my-6"
        >
            <div className="flex items-center gap-4 p-4 border border-base-300 bg-base-100 rounded-xl hover:border-primary hover:shadow-md transition-all duration-300 shadow-sm">
                {/* 图标区域 */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <CubeIcon className="w-6 h-6" />
                </div>

                {/* 信息区域 */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base-content group-hover:text-primary transition-colors truncate">
                        {fileName}
                    </h3>
                    <p className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
                        <span className="badge badge-xs badge-ghost font-mono border-base-300">{isZip ? 'ZIP' : 'FILE'}</span>
                        <span>• 点击下载</span>
                    </p>
                </div>

                {/* 下载按钮 */}
                <div className="btn btn-circle btn-sm btn-ghost text-base-content/50 group-hover:text-primary group-hover:bg-primary/10">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                </div>
            </div>
        </a>
    );
};