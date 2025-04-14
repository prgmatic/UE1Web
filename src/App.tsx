import './App.css'
import { useEffect, useRef, useState } from 'react';
import { Register } from './emulator/Register';
import RegisterTable from './components/RegisterTable'
import CodeEditor from './components/CodeEditor';
import { editor, Range } from 'monaco-editor';
import StepperControls from './components/StepperControls';
import { Emulator } from './emulator/Emulator';
import { throttle } from 'lodash';
import MemoryViewer from './components/MemoryViewer';
import AssembleErrorOutput from './components/AssembleErrorOutput';
import EditorToolbar from './components/EditorToolbar';
import testExample from './examples/MemoryTest.txt?raw';
import fibonacciExample from './examples/Fibonacci.txt?raw';
import GitHubLogo from './assets/github-mark-white.svg';

const emulator = new Emulator();
const examplePrograms: { label: string; code: string }[] = [
  { label: "Example: Memory Test", code: testExample },
  { label: "Example: Fibonacci", code: fibonacciExample },
];

function App() {
  const [registers, setRegisters] = useState<{ [name: string]: Register }>({});
  const [highlightRange, setHighlightRange] = useState<Range>();
  const [assembleErrorOutput, setAssembleErrorOutput] = useState<string>("test\ntest\ntest1");

  const [code, setCode] = useState<string>(() => {
    // Load initial value from localStorage or use default
    return localStorage.getItem('ue1-editor-code') || testExample;
  });

  const breakpointGlyphs = useRef<editor.IEditorDecorationsCollection>(null);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('ue1-editor-code', code);
    emulator.code = code;
    setHighlightRange(undefined);
  }, [code]);

  useEffect(() => {

    const updateView = () => {

      // throttle output
      const current = emulator.computer.registers;
      const updated = Object.fromEntries(
        Object.entries(current).map(([key, reg]: [string, Register]) => [key, reg])
      );
      setRegisters(updated);

      setHighlightRange(emulator.getLineHighlightRange());
      setAssembleErrorOutput(emulator.error);
    };

    const throttledUpdate = throttle(updateView, 16, {
      leading: true,
      trailing: true,
    });

    emulator.onStateUpdated(throttledUpdate);
    throttledUpdate();

    return () => {
      throttledUpdate.cancel();
    }
  }, []);


  const onToggleBreakpoint = (line: number) => {
    emulator.toggleBreakpoint(line);

    if (breakpointGlyphs.current != null) {
      const decorations = Array.from(emulator.breakpoints).map((line) => ({
        range: new Range(line, 1, line, 1),
        options: {
          isWholeLine: false,
          glyphMarginClassName: 'breakpoint-glyph',
          glyphMarginHoverMessage: { value: 'Breakpoint' },
        },
      }));
      breakpointGlyphs.current.set(decorations);
    }
  };

  const handleOnLoad = (code: string) => {
    setCode(code);
  }

  return (

    <div className="flex h-screen min-h-0 overflow-hidden">
      {/* Left sidebar */}
      <div className="w-86 flex flex-col h-full min-h-0 overflow-hidden">
        {/* Controls + Registers: fixed height content */}
        <div className="p-4 flex-shrink-0 w-full">
          <a href="https://github.com/prgmatic/UE1Web" className='absolute top-3.5 left-6' target="_blank" rel="noopener noreferrer">
            <img src={GitHubLogo} alt="GitHub" className="w-10 h-10" />
          </a>
          <StepperControls emulator={emulator} />
          <RegisterTable registers={registers} />
        </div>

        {/* Memory viewer: fills remaining space and scrolls */}
        <div className="flex-1 min-h-0 overflow-auto">
          <MemoryViewer
            className="w-full"
            resultRegister={emulator.computer.registers.result}
            setToggle={(index, value) => emulator.computer.memory.randomAccess.setToggle(index, value)}
            readMemory={(addr) => emulator.computer.memory.randomAccess.readOutput(addr)}
          />
        </div>
      </div>

      {/* Main column */}
      <div className="h-full flex-1 flex flex-col min-h-0 overflow-hidden">
        <EditorToolbar examples={examplePrograms} onLoad={handleOnLoad} getCode={() => code} />
        <CodeEditor
          className="flex-1 min-h-0 overflow-auto"
          code={code}
          onChange={setCode}
          highlightRange={highlightRange}
          breakpointGlyphs={breakpointGlyphs}
          onToggleBreakpoint={onToggleBreakpoint}
        />

        <AssembleErrorOutput
          className="flex-1 min-h-0 overflow-auto"
          output={assembleErrorOutput}
        />
      </div>
    </div>
  )
}

export default App
