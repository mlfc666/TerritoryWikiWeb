import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ComponentPropsWithoutRef } from 'react';
import { CodeBlock } from './CodeBlock';
import { FileCard } from './FileCard';
import { ContributorAvatar } from './ContributorAvatar';

interface MarkdownRenderProps {
    content: string;
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
    inline?: boolean;
};

export default function MarkdownRender({ content }: MarkdownRenderProps) {
    return (
        <article className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert
            prose-headings:scroll-mt-20
            prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0
            prose-img:my-0">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={(url) => url}
                components={{
                    // --- 1. 标题处理 (H1-H6) ---
                    h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
                        <h1 className="text-3xl font-extrabold mt-12 first:mt-0 mb-6 pb-2 border-b border-base-200/60" {...props}>
                            {children}
                        </h1>
                    ),
                    h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
                        <h2 className="text-2xl font-bold mt-10 first:mt-0 mb-4 pb-1 border-b border-base-200/40" {...props}>
                            {children}
                        </h2>
                    ),
                    h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
                        <h3 className="text-xl font-bold mt-8 mb-3 text-base-content/90" {...props}>
                            {children}
                        </h3>
                    ),
                    h4: ({ children, ...props }: ComponentPropsWithoutRef<'h4'>) => (
                        <h4 className="text-lg font-bold mt-6 mb-2 text-base-content/80" {...props}>
                            {children}
                        </h4>
                    ),

                    // --- 2. 引用块处理 ---
                    blockquote: ({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
                        <div className="my-6 pl-4 border-l-4 border-primary/60 bg-base-200/30 rounded-r-lg py-2 pr-2">
                            <blockquote className="not-italic text-base-content/80 opacity-90" {...props}>
                                {children}
                            </blockquote>
                        </div>
                    ),

                    // --- 3. 列表处理 ---
                    ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
                        <ul className="list-disc list-outside ml-6 my-4 space-y-1 marker:text-primary/60" {...props}>
                            {children}
                        </ul>
                    ),
                    ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
                        <ol className="list-decimal list-outside ml-6 my-4 space-y-1 marker:font-bold marker:text-primary/80" {...props}>
                            {children}
                        </ol>
                    ),
                    li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => (
                        <li className="pl-1" {...props}>{children}</li>
                    ),

                    // --- 4. 表格处理 ---
                    table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>) => (
                        <div className="overflow-x-auto my-8 rounded-lg border border-base-200 shadow-sm">
                            <table className="table table-zebra w-full" {...props}>
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children, ...props }: ComponentPropsWithoutRef<'th'>) => (
                        <th className="bg-base-200/50 text-base-content font-bold whitespace-nowrap" {...props}>
                            {children}
                        </th>
                    ),
                    td: ({ children, ...props }: ComponentPropsWithoutRef<'td'>) => (
                        <td className="min-w-[100px]" {...props}>{children}</td>
                    ),

                    // --- 5. 分割线 ---
                    hr: ({ ...props }: ComponentPropsWithoutRef<'hr'>) => (
                        <hr className="my-10 border-base-200 border-t-2" {...props} />
                    ),

                    // --- 6. 代码块拦截 ---
                    code({ inline, className, children, ...props }: CodeProps) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeContent = String(children).replace(/\n$/, '');

                        if (!inline && match) {
                            return (
                                <CodeBlock language={match[1]}>
                                    {codeContent}
                                </CodeBlock>
                            );
                        }
                        return (
                            <code className="bg-base-200/80 px-1.5 py-0.5 rounded text-[0.85em] text-primary font-mono align-baseline font-medium" {...props}>
                                {children}
                            </code>
                        );
                    },

                    // --- 7. 链接拦截 ---
                    a({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
                        const fileUrl = href || '';
                        const linkText = String(children);

                        if (fileUrl.includes('file.territory.mlfc.moe') || fileUrl.endsWith('.zip') || fileUrl.endsWith('.rar')) {
                            return <FileCard href={fileUrl} fileName={linkText} />;
                        }

                        return (
                            <a href={href} className="link link-primary no-underline hover:underline font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props}>
                                {children}
                            </a>
                        );
                    },

                    // --- 8. 图片样式 (含 QQ 头像拦截) ---
                    img({ src, alt, ...props }: ComponentPropsWithoutRef<'img'>) {
                        const safeSrc = src || '';

                        // 1. 拦截 QQ 头像协议 (格式: qq:123456)
                        if (safeSrc.startsWith('qq:')) {
                            const qqNumber = safeSrc.replace('qq:', '');
                            return <ContributorAvatar qq={qqNumber} name={alt} />;
                        }

                        // 2. 普通图片渲染
                        return (
                            <figure className="my-8 flex flex-col items-center group">
                                <img
                                    src={src}
                                    alt={alt}
                                    className="rounded-xl shadow-lg border border-base-200/50 w-full max-w-3xl object-cover bg-base-200 transition-transform duration-500 group-hover:scale-[1.01]"
                                    loading="lazy"
                                    {...props}
                                />
                                {alt && <figcaption className="text-center text-sm text-base-content/60 mt-3">{alt}</figcaption>}
                            </figure>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}