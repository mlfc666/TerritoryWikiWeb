// 解析 Unity 风格富文本
const UnityRichText = ({ text }: { text: string }) => {
    if (!text) return null;

    // 正则表达式：分割字符串，捕获 <color=...>...</color> 结构
    // 逻辑：找到 <color=颜色代码>内容</color>
    const parts = text.split(/(<color=#[0-9A-Fa-f]{6}>.*?<\/color>)/g);

    return (
        <span>
            {parts.map((part, index) => {
                    // 检查这一段是否匹配 color 标签格式
                    const match = part.match(/<color=(#[0-9A-Fa-f]{6})>(.*?)<\/color>/);

                    if (match) {
                        const colorCode = match[1]; // 提取颜色，如 #EE4242
                        const content = match[2];   // 提取文字，如 批量运输
                        return (
                            <span key={index} style={{ color: colorCode, fontWeight: 'bold' }}>
                        {content}
                        </span>
                    );
                    }

                    // 如果不是标签，直接返回普通文本
                    return part;
                })}
        </span>
    );
};
export default UnityRichText;