// 告诉 TypeScript 如何处理.svg文件的导入（否则会报 “找不到模块” 错误）
declare module '*.svg' {
    import React from 'react';
    // 声明SVG导入后是一个React组件，接收SVG相关的props
    const content: React.FC<React.SVGProps<SVGSVGElement>>;
    export default content;
}