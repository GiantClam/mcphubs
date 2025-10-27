'use client';

import React from 'react';

interface HighlightProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

export default function Highlight({ 
  text, 
  query, 
  className = '',
  highlightClassName = 'highlight'
}: HighlightProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  if (searchTerms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // 创建正则表达式来匹配所有搜索词
  const regex = new RegExp(
    `(${searchTerms.map(term => 
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
    ).join('|')})`,
    'gi'
  );

  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = searchTerms.some(term => 
          part.toLowerCase() === term.toLowerCase()
        );
        
        return isMatch ? (
          <mark key={index} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}

// 用于高亮多个字段的组件
interface MultiHighlightProps {
  text: string;
  queries: string[];
  className?: string;
  highlightClassName?: string;
}

export function MultiHighlight({ 
  text, 
  queries, 
  className = '',
  highlightClassName = 'highlight'
}: MultiHighlightProps) {
  if (!queries.length) {
    return <span className={className}>{text}</span>;
  }

  // 合并所有查询词
  const allTerms = queries
    .flatMap(query => query.toLowerCase().split(/\s+/))
    .filter(term => term.length > 0);

  if (allTerms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(
    `(${allTerms.map(term => 
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    ).join('|')})`,
    'gi'
  );

  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = allTerms.some(term => 
          part.toLowerCase() === term.toLowerCase()
        );
        
        return isMatch ? (
          <mark key={index} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}
