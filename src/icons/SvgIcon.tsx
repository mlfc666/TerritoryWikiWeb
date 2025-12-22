// src/components/SvgIcon.tsx
import React from 'react';
import svgIcons from '../icons/svgIcons';

// 定义组件Props类型
interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    /** SVG的名称（必须是svgIcons中定义的键） */
    name: keyof typeof svgIcons;
    /** 快捷设置宽高（可选，如 24 或 "24px"） */
    size?: number | string;
    /** 额外类名 */
    className?: string;
    /** 额外样式 */
    style?: React.CSSProperties;
}

const SvgIcon: React.FC<SvgIconProps> = ({
                                             name,
                                             size,
                                             className,
                                             style,
                                             // 排除自定义的props，剩下的透传给SVG组件
                                             ...restProps
                                         }) => {
    // 从资源池获取对应的SVG组件（TypeScript会自动检查name是否合法）
    const SvgComponent = svgIcons[name];

    // 处理尺寸：如果传入size，统一设置宽高
    const mergedStyle: React.CSSProperties = {
        ...style,
        ...(size !== undefined ? {width: size, height: size} : {}),
        // 确保currentColor可继承（默认继承父元素color）
        color: style?.color ?? 'inherit',
    };

    return (
        <SvgComponent
            className={className}
            style={mergedStyle}
            fill="currentColor" // 强制填充色为currentColor
            {...restProps} // 透传其他SVG属性（如onClick、stroke等）
        />
    );
};

export default SvgIcon;