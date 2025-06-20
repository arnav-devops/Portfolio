import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Sun, Moon } from 'lucide-react';
import { useTerminal } from '../hooks/useTerminal';
import { CommandInput } from './CommandInput';
import { CommandOutput } from './CommandOutput';
import { ContactForm } from './ContactForm';
import { NeuralNetworkBackground } from './NeuralNetworkBackground';

export function Terminal() {
  const { state, executeCommand, updateCommand, navigateHistory, getAutocomplete, handleContactSubmit } = useTerminal();
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [state.outputs]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      executeCommand('stop');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    executeCommand(state.theme === 'dark' ? 'day' : 'night');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${
      state.theme === 'light' 
        ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900' 
        : 'bg-gradient-to-br from-black via-gray-900 to-black text-green-400'
    }`}>
      {/* Neural Network Animation Background */}
      <NeuralNetworkBackground />
      {/* Enhanced CRT Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20">
        <div className={`w-full h-full ${
          state.theme === 'light' 
            ? 'bg-gradient-to-b from-transparent via-blue-100/10 to-transparent' 
            : 'bg-gradient-to-b from-transparent via-green-400/10 to-transparent'
        } bg-repeat-y animate-pulse`} style={{ backgroundSize: '100% 3px' }} />
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-20 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
          state.theme === 'light'
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg'
            : 'bg-green-600 text-black hover:bg-green-500 shadow-lg shadow-green-400/20'
        }`}
        title={`Switch to ${state.theme === 'light' ? 'night' : 'day'} mode`}
      >
        {state.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div 
        ref={terminalRef}
        className="relative z-0 w-full min-h-screen p-4 md:p-8 font-mono text-sm md:text-base overflow-y-auto"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
      >
        {/* Enhanced Terminal Header */}
        <div className={`flex items-center gap-3 mb-6 p-4 rounded-lg backdrop-blur-sm ${
          state.theme === 'light' 
            ? 'bg-white/70 border border-gray-200 shadow-lg' 
            : 'bg-black/50 border border-green-400/30 shadow-lg shadow-green-400/10'
        }`}>
          <TerminalIcon size={24} className={state.theme === 'light' ? 'text-gray-700' : 'text-green-400'} />
          <div className="flex-1">
            <span className={`font-bold text-lg ${state.theme === 'light' ? 'text-gray-800' : 'text-green-300'}`}>
              Arnav Banerjee - DevOps Terminal
            </span>
            <div className={`text-xs mt-1 ${state.theme === 'light' ? 'text-gray-600' : 'text-green-500'}`}>
              {state.theme === 'light' ? '☀️ Day Mode' : '🌙 Night Mode'} • Type 'help' for commands
            </div>
          </div>
          {/* Logo Container */}
          <div className="logo-container flex items-center gap-2 ml-4">
            {/* AWS */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS Logo" className="h-7 w-auto" />
            {/* Kubernetes */}
            <img src="https://logo.svgcdn.com/l/kubernetes.png" alt="Kubernetes Logo" className="h-7 w-auto" />
            {/* Terraform */}
            <img src="https://logo.svgcdn.com/l/terraform-icon-8x.png" alt="Terraform Logo" className="h-7 w-auto rounded-full bg-white" />
            {/* Docker */}
            <img src="https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png" alt="Docker Logo" className="h-7 w-auto" />
            {/* Azure */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/225px-Microsoft_Azure.svg.png" alt="Azure Logo" className="h-7 w-auto" />
            {/* Jenkins */}
            <img src="https://www.jenkins.io/images/logos/jenkins/jenkins.png" alt="Jenkins Logo" className="h-7 w-auto" />
          </div>
        </div>

        {/* Command Outputs */}
        {state.outputs.map((output) => (
          <div key={output.id} className="mb-4">
            {output.content === 'contact-form' ? (
              <ContactForm onSubmit={handleContactSubmit} theme={state.theme} />
            ) : (
              <CommandOutput content={output.content} type={output.type} theme={state.theme} />
            )}
          </div>
        ))}

        {/* Enhanced Command Input */}
        <div className={`p-3 rounded-lg backdrop-blur-sm ${
          state.theme === 'light'
            ? 'bg-white/50 border border-gray-300'
            : 'bg-black/30 border border-green-400/50'
        }`}>
          <CommandInput
            currentCommand={state.currentCommand}
            isRoot={state.isRoot}
            theme={state.theme}
            onCommandChange={updateCommand}
            onCommandSubmit={executeCommand}
            onHistoryNavigate={navigateHistory}
            getAutocomplete={getAutocomplete}
          />
        </div>

        {/* Status Bar */}
        <div className={`fixed bottom-0 left-0 right-0 p-2 text-xs backdrop-blur-sm ${
          state.theme === 'light'
            ? 'bg-white/80 text-gray-600 border-t border-gray-200'
            : 'bg-black/80 text-green-500 border-t border-green-400/30'
        }`}>
          <div className="flex justify-between items-center max-w-screen-xl mx-auto">
            <span>
              {state.theme === 'light' ? 'Day Mode' : 'Night Mode'} • 
              Sound: {state.soundEnabled ? 'On' : 'Off'} • 
              Commands: {state.commandHistory.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}