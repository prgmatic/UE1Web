import React, { useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { editor, Range } from 'monaco-editor';


interface CodeEditorProps {
    code: string;
    highlightRange: Range | undefined;
    breakpointGlyphs: React.RefObject<editor.IEditorDecorationsCollection | null>;
    onChange: (value: string) => void;
    onToggleBreakpoint: (line: number) => void;
    className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
    code, 
    highlightRange, 
    breakpointGlyphs, 
    onChange, 
    onToggleBreakpoint,
    className
 }) => {
    const lineHighlight = useRef<editor.IEditorDecorationsCollection>(null);

    useEffect(() => {
        if(lineHighlight.current != null) {
            if(highlightRange != undefined){
                lineHighlight.current.set([{
                      range: highlightRange,
                      options: {
                        isWholeLine: true,
                        className: 'current-line-highlight'
                }}])
            }
            else{
                lineHighlight.current.set([]);
            }
        }
    }, [highlightRange, lineHighlight])


    const handleEditorMount: OnMount = (editor, monaco) => {
        lineHighlight.current = editor.createDecorationsCollection();
        breakpointGlyphs.current = editor.createDecorationsCollection();

        const languageId = 'ue1asm';
        if (!monaco.languages.getLanguages().some(lang => lang.id === languageId)) {
            monaco.languages.register({ id: languageId });

            monaco.languages.setMonarchTokensProvider(languageId, {
                tokenizer: {
                    root: [
                        [/;.*$/, 'comment'],
                        [/\b(NOPO|NOP0|LD|ADD|SUB|ONE|NAND|OR|XOR|STO|STOC|IEN|OEN|IOC|RTN|SKZ|NOPF)\b/i, 'keyword'],
                        [/\b(SR[0-7]|OR[0-7]|IR[1-7]|RR)\b/i, 'register'],
                        [/[A-Za-z0-9_]*:/, 'label'],
                        [/\bR[0-9]+\b/, 'variable'],
                        [/\b0x[0-9a-fA-F]+\b/, 'number.hex'],
                        [/\b\d+\b/, 'number'],
                    ],
                },
            });

            monaco.editor.defineTheme('ue1-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '6A9955' },
                    { token: 'keyword', foreground: '569CD6', },
                    { token: 'register', foreground: '4FC1FF' },
                    { token: 'label', foreground: '4EC9B0' },
                    { token: 'number', foreground: 'B5CEA8' },
                    { token: 'number.hex', foreground: 'B5CEA8' },
                ],
                colors: {},
            });

            monaco.editor.setTheme('ue1-dark');
        }

        editor.onMouseDown((e) =>{
            if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
                const line = e.target.position?.lineNumber;
                if (line != null) {
                  onToggleBreakpoint(line);
                }
              }
        });

    };

    return (
        <div className={className}>
            <Editor
                language="ue1asm"
                value={code}
                onChange={(value) => onChange(value || '')}
                onMount={handleEditorMount}
                theme="vs-dark"
                options={{
                    glyphMargin: true,
                    fontSize: 14,
                    minimap: { enabled: false },
                }}
            />
        </div>
    );
};

export default CodeEditor;