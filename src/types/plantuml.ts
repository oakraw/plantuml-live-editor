export type RenderStatus = 'idle' | 'loading' | 'success' | 'error';

export interface RenderError {
  message: string;
  line: number;
  column: number;
}

export type PlantUmlError = RenderError;

export interface RenderResult {
  blob: Blob;
  width: number;
  height: number;
}

export interface DiagnosticIssue {
  message: string;
  line: number;
  column: number;
  severity: 'error' | 'warning';
}

export type WorkerRequest =
  | { type: 'ping' }
  | { type: 'render'; id: number; source: string; width?: number; height?: number };

export type WorkerResponse =
  | { type: 'pong' }
  | { type: 'render-success'; id: number; blob: Blob; width: number; height: number }
  | { type: 'render-error'; id: number; error: RenderError };

export const STARTER_SOURCE = `@startuml
Alice -> Bob: Hello
Bob --> Alice: Hi there
@enduml`;

export const DEFAULT_EXPORT_WIDTH = 800;
export const DEFAULT_EXPORT_HEIGHT = 600;
