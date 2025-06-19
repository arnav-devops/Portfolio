export interface Command {
  name: string;
  description: string;
  handler: (args: string[]) => void;
}

export interface Project {
  name: string;
  description: string;
  metrics: string;
  tech: string;
  logs: string[];
  success: string;
  details: string;
}

export interface Skill {
  name: string;
  description: string;
}

export interface TerminalState {
  currentCommand: string;
  commandHistory: string[];
  historyIndex: number;
  isRoot: boolean;
  buildRunning: boolean;
  topRunning: boolean;
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  outputs: OutputEntry[];
}

export interface OutputEntry {
  id: string;
  content: string;
  type: 'command' | 'output' | 'error';
  timestamp: Date;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}