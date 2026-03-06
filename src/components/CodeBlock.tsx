"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

function highlight(code: string): string {
  return code
    .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
    .replace(/\b(import|from|export|const|let|var|if|else|return|function|async|await|new|true|false|default|interface)\b/g, '<span class="keyword">$1</span>')
    .replace(/(["'`])(?:(?!\1).)*?\1/g, '<span class="string">$&</span>')
    .replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="fn">$1</span>(');
}

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group">
      {language && (
        <div className="absolute top-0 left-0 px-3 py-1 text-xs text-text-muted border-b border-r border-border bg-bg-card rounded-br rounded-tl-[5px]">
          {language}
        </div>
      )}
      <button onClick={copy}
        className="absolute top-2 right-2 p-1.5 text-text-muted hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Copy code">
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre className="code-block">
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}
