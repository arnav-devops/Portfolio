import React, { useState, useRef, useEffect } from 'react';

interface CommandInputProps {
  currentCommand: string;
  isRoot: boolean;
  theme: 'dark' | 'light';
  onCommandChange: (command: string) => void;
  onCommandSubmit: (command: string) => void;
  onHistoryNavigate: (direction: 'up' | 'down') => void;
  getAutocomplete: (input: string) => string[];
}

export function CommandInput({
  currentCommand,
  isRoot,
  theme,
  onCommandChange,
  onCommandSubmit,
  onHistoryNavigate,
  getAutocomplete,
}: CommandInputProps) {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        onCommandSubmit(currentCommand);
        setShowAutocomplete(false);
        break;
      case 'ArrowUp':
        e.preventDefault();
        onHistoryNavigate('up');
        setShowAutocomplete(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        onHistoryNavigate('down');
        setShowAutocomplete(false);
        break;
      case 'Tab':
        e.preventDefault();
        const suggestions = getAutocomplete(currentCommand);
        if (suggestions.length === 1) {
          onCommandChange(suggestions[0]);
          setShowAutocomplete(false);
        } else if (suggestions.length > 1) {
          setShowAutocomplete(true);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onCommandChange(value);
    
    if (value.trim()) {
      const suggestions = getAutocomplete(value);
      setShowAutocomplete(suggestions.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  };

  const promptColor = theme === 'light' 
    ? (isRoot ? 'text-red-600' : 'text-blue-600')
    : (isRoot ? 'text-red-400' : 'text-green-400');

  const inputColor = theme === 'light' ? 'text-gray-900' : 'text-green-400';

  return (
    <div className="relative">
      <div className="flex items-center">
        <span className={`${promptColor} font-medium text-sm md:text-base`}>
          {isRoot ? 'root@devops:~# ' : 'arnav@devops:~$ '}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`bg-transparent border-none outline-none flex-1 ${inputColor} ml-1 text-sm md:text-base`}
          spellCheck={false}
          autoComplete="off"
          placeholder={theme === 'light' ? "Type 'help' for commands..." : ""}
        />
        <span className={`inline-block w-2 h-5 ${
          isRoot 
            ? (theme === 'light' ? 'bg-red-600' : 'bg-red-400')
            : (theme === 'light' ? 'bg-blue-600' : 'bg-green-400')
        } animate-pulse ml-1`} />
      </div>

      {/* Enhanced Autocomplete Suggestions */}
      {showAutocomplete && (
        <div className={`absolute top-full left-0 mt-2 p-3 rounded-lg border max-w-md z-20 backdrop-blur-sm ${
          theme === 'light' 
            ? 'bg-white/90 border-gray-300 text-gray-700 shadow-xl' 
            : 'bg-gray-900/90 border-green-400 text-green-300 shadow-xl shadow-green-400/20'
        }`}>
          <div className="text-xs opacity-75 mb-2 font-semibold">💡 Suggestions:</div>
          <div className="text-sm space-y-1">
            {getAutocomplete(currentCommand).slice(0, 5).map((suggestion, index) => (
              <div 
                key={index}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  theme === 'light' 
                    ? 'hover:bg-blue-100 hover:text-blue-800' 
                    : 'hover:bg-green-400/20 hover:text-green-200'
                }`}
                onClick={() => {
                  onCommandChange(suggestion);
                  setShowAutocomplete(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
          <div className="text-xs opacity-50 mt-2 border-t pt-2">
            Press Tab to autocomplete • Esc to close
          </div>
        </div>
      )}
    </div>
  );
}