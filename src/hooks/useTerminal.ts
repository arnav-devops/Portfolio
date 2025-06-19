import { useState, useCallback, useRef, useEffect } from 'react';
import { TerminalState, OutputEntry, ContactForm } from '../types/terminal';
import { projects } from '../data/projects';
import { skills, manPages } from '../data/skills';
import * as constants from '../constants';

const initialState: TerminalState = {
  currentCommand: '',
  commandHistory: [],
  historyIndex: -1,
  isRoot: false,
  buildRunning: false,
  topRunning: false,
  soundEnabled: true,
  theme: 'dark',
  outputs: [
    {
      id: 'welcome',
      content: constants.WELCOME_MESSAGE,
      type: 'output',
      timestamp: new Date(),
    },
  ],
};

export function useTerminal() {
  const [state, setState] = useState<TerminalState>(initialState);
  const buildTimeoutRef = useRef<any>();
  const topTimeoutRef = useRef<any>();
  const buildRunningRef = useRef(state.buildRunning);

  useEffect(() => { buildRunningRef.current = state.buildRunning; }, [state.buildRunning]);

  const addOutput = useCallback((content: string, type: 'command' | 'output' | 'error' = 'output') => {
    const newOutput: OutputEntry = {
      id: `${Date.now()}-${Math.random()}`,
      content,
      type,
      timestamp: new Date(),
    };
    setState(prev => ({
      ...prev,
      outputs: [...prev.outputs, newOutput],
    }));
  }, []);

  const executeCommand = useCallback((command: string) => {
    if (!command.trim()) return;

    setState(prev => ({
      ...prev,
      commandHistory: [command, ...prev.commandHistory].slice(0, 50),
      historyIndex: -1,
      currentCommand: '',
    }));

    const [cmd, ...args] = command.trim().toLowerCase().split(' ');

    // Command execution logic
    switch (cmd) {
      case 'help':
        addOutput(constants.COMMANDS_HELP);
        break;

      case 'whoami':
        if (state.isRoot) {
          addOutput('root');
        } else {
          addOutput(`Arnav Banerjee
Cloud DevOps Engineer with 3+ years of experience
Automating CI/CD pipelines, scaling cloud infra, and ensuring 94.99% uptime`);
        }
        break;

      case 'about':
        addOutput(`cat about.txt${constants.ABOUT_TEXT}`);
        break;

      case 'experience':
        addOutput(`jobs${constants.EXPERIENCE_TEXT}`);
        break;

      case 'projects':
        addOutput(`ls -l projects${constants.PROJECTS_TEXT}`);
        break;

      case 'skills':
        if (args[0] && skills[args[0]]) {
          addOutput(`echo $SKILLS_${args[0].toUpperCase()}\n${skills[args[0]]}`);
        } else {
          addOutput(`env | grep SKILLS${constants.SKILLS_ENV}`);
        }
        break;

      case 'certifications':
        addOutput(`cat certifications.txt${constants.CERTIFICATIONS_TEXT}`);
        break;

      case 'contact':
        addOutput('contact-form');
        break;

      case 'deploy':
        handleDeploy(args[0]);
        break;

      case 'apt-update':
      case 'sudo':
        if (args[0] === 'apt' && args[1] === 'update') {
          handleAptUpdate();
        } else if (args[0] === 'su') {
          handleSudoSu();
        } else {
          addOutput(`bash: ${command}: command not found`, 'error');
        }
        break;

      case 'su':
        handleSudoSu();
        break;

      case 'exit':
        handleExit();
        break;

      case 'top':
        handleTop();
        break;

      case 'git':
        if (args[0] === 'log') {
          handleGitLog(args.slice(1));
        } else {
          addOutput(`bash: git ${args[0]}: command not found`, 'error');
        }
        break;

      case 'man':
        handleMan(args[0]);
        break;

      case 'curl':
        handleCurl(args[0]);
        break;

      case 'theme':
        handleTheme(args[0]);
        break;

      case 'day':
      case 'night':
        handleTheme(cmd === 'day' ? 'light' : 'dark');
        break;

      case 'clear':
        setState(prev => ({ ...prev, outputs: [prev.outputs[0]] }));
        break;

      case 'stop':
        handleStop();
        break;

      case 'sound':
        handleSound(args[0]);
        break;

      default:
        addOutput(`bash: ${command}: command not found`, 'error');
    }
  }, [state.isRoot, state.buildRunning, addOutput]);

  const handleDeploy = useCallback((projectName?: string) => {
    if (buildRunningRef.current) {
      addOutput('[ERROR] Build already in progress. Run `stop` to cancel.', 'error');
      return;
    }

    if (!projectName || !projects[projectName]) {
      addOutput(`bash: deploy: ${projectName || ''}: invalid project. Try: ${Object.keys(projects).join(', ')}`, 'error');
      return;
    }

    setState(prev => ({ ...prev, buildRunning: true }));

    const project = projects[projectName];
    const pipeline = [
      '    [ Commit ] --> [ Build ] --> [ Test ] --> [ Deploy ] --> [ Monitor ]',
      '    [===========>          ] Cloning repository...',
      '    [===========>          ] Building Docker image...',
      '    [===========>==========>] Running unit tests...',
      '    [===========>==========>] Pushing to registry...',
      '    [===========>==========>] Deploying to production...',
      '    [===========>==========>] Monitoring started...'
    ];

    let step = 0;
    const animatePipeline = () => {
      if (!buildRunningRef.current) return;

      if (step < pipeline.length) {
        addOutput(pipeline.slice(0, step + 1).join('\n'));
      } else if (step === pipeline.length) {
        // Show build complete and project info
        addOutput(pipeline.join('\n') + '\n' + project.logs.join('\n') + '\n' + project.success + '\n' + project.details);
        setState(prev => ({ ...prev, buildRunning: false }));
        return;
      }
      step++;
      buildTimeoutRef.current = setTimeout(animatePipeline, 1000);
    };

    animatePipeline();
  }, [addOutput, projects]);

  const handleAptUpdate = useCallback(() => {
    const updateLogs = [
      '[sudo] password for arnav:',
      'Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease',
      'Get:2 http://security.ubuntu.com/ubuntu focal-security InRelease [114 kB]',
      'Get:3 http://archive.Ubuntu.com/ubuntu focal-updates InRelease [114 kB]',
      'Fetched 228 kB in 0s (1,200 kB/s)',
      'Reading package lists... Done',
      'Building dependency tree... Done',
      'All packages are up to date.',
    ];

    let step = 0;
    const animateUpdate = () => {
      if (step >= updateLogs.length) return;
      addOutput(updateLogs.slice(0, step + 1).join('\n'));
      step++;
      setTimeout(animateUpdate, 500);
    };

    animateUpdate();
  }, [addOutput]);

  const handleSudoSu = useCallback(() => {
    addOutput('[sudo] password for arnav:');
    setState(prev => ({ ...prev, isRoot: true }));
  }, [addOutput]);

  const handleExit = useCallback(() => {
    if (state.isRoot) {
      setState(prev => ({ ...prev, isRoot: false }));
      addOutput('exit');
    } else {
      addOutput('bash: exit: not in a subshell', 'error');
    }
  }, [state.isRoot, addOutput]);

  const handleTop = useCallback(() => {
    if (state.topRunning) {
      addOutput('[ERROR] top already running. Press q to quit.', 'error');
      return;
    }

    setState(prev => ({ ...prev, topRunning: true }));

    const updateStats = () => {
      if (!state.topRunning) return;

      const stats = [
        `top - ${new Date().toLocaleTimeString()} up 3+ yrs,  load average: ${(Math.random() * 0.99).toFixed(2)}, ${(Math.random() * 0.95).toFixed(2)}, ${(Math.random() * 0.85).toFixed(2)}`,
        'Tasks: 4 projects, 20+ pipelines, 100+ deployments',
        '%Cpu(s): 63.0 cost savings, 40.0 automation',
        'Mem: 50K+ users impacted, 10K+ transactions/day',
        'Swap: 0% downtime',
        '',
        'PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND',
        '  1 arnav    20   0   1000M   400M   200M R  99.9 100%   3+ yrs DevOps',
        '  2 arnav    20   0    500M   250M   100M S  63.0  40%   2+ yrs AWS',
      ];

      addOutput(stats.join('\n'));
      topTimeoutRef.current = setTimeout(updateStats, 2000);
    };

    updateStats();
  }, [state.topRunning, addOutput]);

  const handleGitLog = useCallback((args: string[]) => {
    const isOneline = args[0] === '--oneline';
    const logs = [
      {
        hash: '7a9f3d2',
        head: '(HEAD -> main)',
        date: 'Jun 2025',
        message: 'Deployed InfinityTyres ERP system\n    - Automated infra with Terraform\n    - Reduced costs by 30%'
      },
      {
        hash: '4b2e1c9',
        date: 'Jun 2024',
        message: 'Led CI/CD for ZIX Forwarding Live\n    - 10K+ transactions/day'
      },
      {
        hash: '3d8a7b5',
        date: 'Jan 2024',
        message: 'Built Biller Gine billing system\n    - 50% faster deployments'
      },
      {
        hash: '1c6f4e3',
        date: 'Aug 2023',
        message: 'Developed Oasis healthcare app\n    - HIPAA-compliant, 94.99% uptime'
      },
    ];

    const output = isOneline
      ? logs.map(log => `${log.hash} ${log.message.split('\n')[0]}`).join('\n')
      : logs.map(log => `commit ${log.hash} ${log.head || ''}
Author: Arnav Banerjee <arnav@devops.io>
Date:   ${log.date}

    ${log.message}`).join('\n\n');

    addOutput(output);
  }, [addOutput]);

  const handleMan = useCallback((cmd?: string) => {
    if (!cmd || !manPages[cmd]) {
      addOutput(`Available manuals: ${Object.keys(manPages).join(', ')}\nUsage: man <command>`);
    } else {
      addOutput(manPages[cmd]);
    }
  }, [addOutput]);

  const handleCurl = useCallback((profile?: string) => {
    const profiles = {
      linkedin: 'https://linkedin.com/in/arnav-banerjee-4318b6199',
      github: 'https://github.com/arnav-banerjee',
    };

    if (!profile || !profiles[profile as keyof typeof profiles]) {
      addOutput(`bash: curl: ${profile || ''}: invalid profile. Try: linkedin, github`, 'error');
      return;
    }

    const url = profiles[profile as keyof typeof profiles];
    addOutput(`[INFO] Fetching ${url}...
HTTP/1.1 200 OK
Content-Type: text/html
Location: ${url}
<a href="${url}" target="_blank" rel="noopener noreferrer">Visit ${profile.charAt(0).toUpperCase() + profile.slice(1)}</a>`);
  }, [addOutput]);

  const handleTheme = useCallback((theme?: string) => {
    if (theme === 'light' || theme === 'dark') {
      setState(prev => ({ ...prev, theme }));
      const modeText = theme === 'light' ? 'day' : 'night';
      addOutput(`[INFO] Switched to ${modeText} mode (${theme} theme)`);
    } else {
      addOutput('bash: theme: invalid option. Try: dark, light, day, night', 'error');
    }
  }, [addOutput]);

  const handleStop = useCallback(() => {
    if (state.buildRunning) {
      setState(prev => ({ ...prev, buildRunning: false }));
      if (buildTimeoutRef.current) {
        clearTimeout(buildTimeoutRef.current);
      }
      addOutput('[INFO] Build stopped by user.');
    } else if (state.topRunning) {
      setState(prev => ({ ...prev, topRunning: false }));
      if (topTimeoutRef.current) {
        clearTimeout(topTimeoutRef.current);
      }
      addOutput('[INFO] Top process stopped.');
    } else {
      addOutput('[INFO] No running processes to stop.');
    }
  }, [state.buildRunning, state.topRunning, addOutput]);

  const handleSound = useCallback((option?: string) => {
    const enabled = option === 'on' ? true : option === 'off' ? false : !state.soundEnabled;
    setState(prev => ({ ...prev, soundEnabled: enabled }));
    addOutput(`[INFO] Sound ${enabled ? 'enabled' : 'disabled'}`);
  }, [state.soundEnabled, addOutput]);

  const handleContactSubmit = useCallback((formData: ContactForm) => {
    const stages = [
      '[INFO] Validating input...',
      '[INFO] Building message payload...',
      '[INFO] Sending to SMTP server...',
      '[SUCCESS] Message deployed! Build time: 3s',
    ];

    let step = 0;
    const animateContact = () => {
      if (step >= stages.length) return;
      addOutput(stages.slice(0, step + 1).join('\n'));
      step++;
      setTimeout(animateContact, 1000);
    };

    animateContact();
  }, [addOutput]);

  const updateCommand = useCallback((command: string) => {
    setState(prev => ({ ...prev, currentCommand: command }));
  }, []);

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    setState(prev => {
      if (direction === 'up' && prev.historyIndex < prev.commandHistory.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          historyIndex: newIndex,
          currentCommand: prev.commandHistory[newIndex] || '',
        };
      } else if (direction === 'down' && prev.historyIndex > -1) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          historyIndex: newIndex,
          currentCommand: newIndex === -1 ? '' : prev.commandHistory[newIndex],
        };
      }
      return prev;
    });
  }, []);

  const getAutocomplete = useCallback((input: string) => {
    const commands = ['help', 'whoami', 'about', 'experience', 'projects', 'skills', 'certifications', 'contact', 'deploy', 'apt-update', 'sudo su', 'exit', 'top', 'git log', 'man', 'curl', 'theme', 'day', 'night', 'clear', 'stop', 'sound'];
    const [command] = input.trim().toLowerCase().split(' ');
    return commands.filter(cmd => cmd.startsWith(command));
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (buildTimeoutRef.current) clearTimeout(buildTimeoutRef.current);
      if (topTimeoutRef.current) clearTimeout(topTimeoutRef.current);
    };
  }, []);

  return {
    state,
    executeCommand,
    updateCommand,
    navigateHistory,
    getAutocomplete,
    handleContactSubmit,
  };
}