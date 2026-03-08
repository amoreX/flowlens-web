"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(code: string): string {
  const tokens: string[] = [];
  const placeholder = (html: string): string => {
    const idx = tokens.length;
    tokens.push(html);
    return `\x00${idx}\x00`;
  };

  let result = code;

  // 1. Comments first
  result = result.replace(/(\/\/.*)/g, (m) => placeholder(`<span class="comment">${escapeHtml(m)}</span>`));

  // 2. Strings second (before keywords, so keywords inside strings aren't matched)
  result = result.replace(/(["'`])(?:(?!\1).)*?\1/g, (m) => placeholder(`<span class="string">${escapeHtml(m)}</span>`));

  // 3. Keywords (only in non-token text)
  result = result.replace(/\b(import|from|export|const|let|var|if|else|return|function|async|await|new|true|false|default|interface)\b/g, '<span class="keyword">$1</span>');

  // 4. Function calls
  result = result.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="fn">$1</span>(');

  // Restore tokens
  result = result.replace(/\x00(\d+)\x00/g, (_, idx) => tokens[Number(idx)]);

  return result;
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
      <pre className="code-block" style={language ? { paddingTop: "2.5rem" } : undefined}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}
