// src/icons/svgIcons.ts
import React from 'react';

// 导入所有SVG（根据你的实际文件路径调整）
import languageSvg from '../assets/svg/language.svg';
import ThemeSvg from '../assets/svg/theme.svg';

// 定义SVG资源池的类型：键为字符串（SVG名称），值为SVG组件
type SvgIconsMap = Record<string, React.FC<React.SVGProps<SVGSVGElement>>>;

// 导出带类型的资源池（键名即后续调用时的name）
const svgIcons: SvgIconsMap = {
    language: languageSvg,
    theme: ThemeSvg,
};

export default svgIcons;