import React from 'react';

interface CommandOutputProps {
  content: string;
  type: 'command' | 'output' | 'error';
  theme: 'dark' | 'light';
}

export function CommandOutput({ content, type, theme }: CommandOutputProps) {
  const getTextColor = () => {
    if (type === 'error') {
      return theme === 'light' ? 'text-red-600' : 'text-red-400';
    }
    return theme === 'light' ? 'text-gray-800' : 'text-green-400';
  };

  const formatContent = (text: string) => {
    // Handle links in the content with enhanced styling
    return text.replace(
      /<a href="([^"]*)" target="_blank" rel="noopener noreferrer">([^<]*)<\/a>/g,
      `<a href="$1" target="_blank" rel="noopener noreferrer" class="${
        theme === 'light' 
          ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-1 py-0.5 rounded transition-all' 
          : 'text-green-300 hover:text-green-100 hover:bg-green-400/20 px-1 py-0.5 rounded transition-all'
      } underline font-medium">$2 🔗</a>`
    );
  };

  return (
    <div className={`whitespace-pre-wrap break-words ${getTextColor()} animate-fade-in p-3 rounded-lg ${
      theme === 'light' 
        ? 'bg-gray-50/50 border-l-4 border-blue-300' 
        : 'bg-black/20 border-l-4 border-green-400'
    }`}>
      <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
    </div>
  );
}