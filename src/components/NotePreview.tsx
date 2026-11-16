import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface NotePreviewProps {
  content: string;
}

export default function NotePreview({ content }: NotePreviewProps) {
  return (
    <div className="flex-1 overflow-y-auto h-full p-6">
      <div className="markdown-body max-w-3xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ node, className, children, ...rest }) => {
              const match = /language-(\w+)/.exec(className || '');
              if (match) {
                return (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={oneDark}
                    PreTag="div"
                    className="my-3 rounded-lg text-sm"
                    {...rest}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              }
              return (
                <code className="markdown-inline-code" {...rest}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
