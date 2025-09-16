import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 text-gray-800 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mb-2 text-gray-800 mt-4">
              {children}
            </h3>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-3 text-gray-700 leading-relaxed">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 ml-4 space-y-1 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700">{children}</li>
          ),
          
          // Emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),
          
          // Code - Fixed TypeScript issue
          code: ({ children, ...props }) => {
            // Check if it's inline code by looking at the className or node properties
            const isInline = !props.className || !props.className.includes('language-');
            
            if (isInline) {
              return (
                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-100 border border-gray-200 rounded-lg p-4 overflow-x-auto mb-4">
                <code className="text-sm font-mono text-gray-800">
                  {children}
                </code>
              </pre>
            );
          },
          
          // Pre blocks (for code blocks)
          pre: ({ children }) => (
            <pre className="bg-gray-100 border border-gray-200 rounded-lg p-4 overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {children}
            </a>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-4 bg-gray-50 italic text-gray-700">
              {children}
            </blockquote>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-200 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
              {children}
            </td>
          ),
          
          // Horizontal Rule
          hr: () => (
            <hr className="my-6 border-gray-300" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
