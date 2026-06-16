import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useRef } from 'react';
import { diagnosticsToMarkers } from '../../plantuml/diagnostics';
import { registerPlantUmlLanguage } from '../../plantuml/language';
import { registerCompletionProvider } from '../../plantuml/suggestions';
import type { DiagnosticIssue } from '../../types/plantuml';
import './Editor.css';

interface PlantUmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  diagnostics: DiagnosticIssue[];
}

export function PlantUmlEditor({ value, onChange, diagnostics }: PlantUmlEditorProps) {
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);
  const modelRef = useRef<import('monaco-editor').editor.ITextModel | null>(null);

  useEffect(() => {
    const monaco = monacoRef.current;
    const model = modelRef.current;
    if (!monaco || !model) return;
    monaco.editor.setModelMarkers(model, 'plantuml', diagnosticsToMarkers(diagnostics));
  }, [diagnostics]);

  const handleMount = useCallback(
    (
      editorInstance: import('monaco-editor').editor.IStandaloneCodeEditor,
      monaco: typeof import('monaco-editor'),
    ) => {
      monacoRef.current = monaco;
      modelRef.current = editorInstance.getModel();
      registerPlantUmlLanguage(monaco);
      registerCompletionProvider(monaco);
      editorInstance.updateOptions({
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      });
    },
    [],
  );

  return (
    <section className="editor-panel" aria-label="PlantUML editor" role="region">
      <Editor
        height="100%"
        language="plantuml"
        value={value}
        onChange={(next) => onChange(next ?? '')}
        onMount={handleMount}
        options={{ automaticLayout: true }}
      />
    </section>
  );
}
