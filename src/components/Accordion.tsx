'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
  id?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export default function Accordion({ 
  items, 
  allowMultiple = false,
  defaultOpen = [],
  className = ''
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId];
      } else {
        return prev.includes(itemId) ? [] : [itemId];
      }
    });
  };

  return (
    <div className={`accordion ${className}`}>
      {items.map((item, index) => {
        const itemId = item.id || `item-${index}`;
        const isOpen = openItems.includes(itemId);

        return (
          <div key={itemId} className="accordion-item">
            <button
              className="accordion-header"
              onClick={() => toggleItem(itemId)}
              aria-expanded={isOpen}
              aria-controls={`content-${itemId}`}
            >
              <span className="accordion-title">{item.title}</span>
              {isOpen ? (
                <FaChevronDown className="accordion-icon" />
              ) : (
                <FaChevronRight className="accordion-icon" />
              )}
            </button>
            
            {isOpen && (
              <div
                id={`content-${itemId}`}
                className="accordion-content"
                role="region"
                aria-labelledby={`header-${itemId}`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 预设的故障排除项目
export const createTroubleshootingItems = (project: any): AccordionItem[] => [
  {
    title: "Installation Issues",
    content: (
      <div className="space-y-3">
        <p>If you&apos;re having trouble installing the package:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Make sure you have the correct Node.js version</li>
          <li>Try clearing your package manager cache</li>
          <li>Check if you have sufficient permissions</li>
        </ul>
      </div>
    )
  },
  {
    title: "Configuration Problems",
    content: (
      <div className="space-y-3">
        <p>Common configuration issues:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Verify the configuration file syntax</li>
          <li>Check file paths are correct</li>
          <li>Ensure all required fields are present</li>
        </ul>
      </div>
    )
  },
  {
    title: "Connection Errors",
    content: (
      <div className="space-y-3">
        <p>If the MCP server won&apos;t connect:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Check if the server is running</li>
          <li>Verify port numbers and URLs</li>
          <li>Check firewall settings</li>
        </ul>
      </div>
    )
  }
];
