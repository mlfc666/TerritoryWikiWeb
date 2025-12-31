import React from 'react';
import {getQQImage} from "../config/DataSourceConfig.ts";

interface ContributorAvatarProps {
    qq: string;
    name?: string;
}

export const ContributorAvatar: React.FC<ContributorAvatarProps> = ({ qq, name }) => {

    return (
        // tooltip: 鼠标悬停显示名字
        // inline-block: 让多个头像可以并排显示
        <div className="tooltip tooltip-primary inline-block mr-[-0.5rem] hover:mr-2 hover:z-10 transition-all duration-300" data-tip={name || qq}>
            <div className="avatar placeholder transition-transform hover:scale-110">
                {/* ring: 给头像加一个圆环边框 */}
                <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-200">
                    <img
                        src={getQQImage(qq)}
                        alt={name}
                        loading="lazy"
                        onError={(e) => {
                            // 加载失败时的兜底（显示文字首字）
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                            target.parentElement!.innerText = name?.[0] || '?';
                        }}
                    />
                </div>
            </div>
        </div>
    );
};