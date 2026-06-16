import { describe, expect, it } from 'vitest';
import { diagnosticsToMarkers, getDiagnosticsFromSource } from './diagnostics';

describe('diagnostics', () => {
  it('converts WASM-like error payload into Monaco markers', () => {
    const markers = diagnosticsToMarkers([
      { message: 'Missing @enduml directive', line: 2, column: 1, severity: 'error' },
    ]);
    expect(markers[0]?.startLineNumber).toBe(2);
    expect(markers[0]?.severity).toBe(8);
  });

  it('returns diagnostics for invalid source', () => {
    const diagnostics = getDiagnosticsFromSource('@startuml\nAlice -> Bob');
    expect(diagnostics[0]?.message).toContain('@enduml');
  });
});
