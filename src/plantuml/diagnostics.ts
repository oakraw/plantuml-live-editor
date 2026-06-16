import type { editor } from 'monaco-editor';
import type { DiagnosticIssue, RenderError } from '../types/plantuml';
import { validatePlantUmlSource } from './validate';

export { validatePlantUmlSource };

export function diagnosticsToMarkers(issues: DiagnosticIssue[]): editor.IMarkerData[] {
  return issues.map((issue) => ({
    message: issue.message,
    severity: issue.severity === 'error' ? 8 : 4,
    startLineNumber: issue.line,
    startColumn: issue.column,
    endLineNumber: issue.line,
    endColumn: issue.column + 1,
  }));
}

export function toMonacoMarkers(error: RenderError | null): editor.IMarkerData[] {
  if (!error) return [];
  return diagnosticsToMarkers([{ ...error, severity: 'error' }]);
}

export function getDiagnosticsFromSource(source: string): DiagnosticIssue[] {
  const error = validatePlantUmlSource(source);
  return error ? [{ ...error, severity: 'error' }] : [];
}
