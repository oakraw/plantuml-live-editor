import type * as Monaco from 'monaco-editor';
import { PLANTUML_LANGUAGE_ID } from './language';

type Item = Omit<Monaco.languages.CompletionItem, 'range'>;

const COMPLETION_ITEMS: Item[] = [
  {
    label: '@startuml',
    kind: 14,
    insertText: '@startuml\n@enduml',
    detail: 'Sequence/Class diagram',
  },
  {
    label: '@startmindmap',
    kind: 14,
    insertText: '@startmindmap\n* Root\n@endmindmap',
    detail: 'Mind map',
  },
  { label: '@startsalt', kind: 14, insertText: '@startsalt\n{\n}\n@endsalt', detail: 'UI mockup' },
  { label: '@startgantt', kind: 14, insertText: '@startgantt\n@endgantt', detail: 'Gantt chart' },
  { label: 'actor', kind: 14, insertText: 'actor ${1:Name}', insertTextRules: 4, detail: 'Actor' },
  {
    label: 'participant',
    kind: 14,
    insertText: 'participant ${1:Name}',
    insertTextRules: 4,
    detail: 'Participant',
  },
  {
    label: 'class',
    kind: 14,
    insertText: 'class ${1:Name} {\n}',
    insertTextRules: 4,
    detail: 'Class',
  },
  {
    label: 'interface',
    kind: 14,
    insertText: 'interface ${1:Name} {\n}',
    insertTextRules: 4,
    detail: 'Interface',
  },
  {
    label: 'note',
    kind: 14,
    insertText: 'note right: ${1:text}',
    insertTextRules: 4,
    detail: 'Note',
  },
  {
    label: 'if',
    kind: 14,
    insertText: 'if (${1:condition}) then (yes)\nendif',
    insertTextRules: 4,
    detail: 'Conditional',
  },
  { label: 'else', kind: 14, insertText: 'else (no)', detail: 'Else branch' },
  { label: 'endif', kind: 14, insertText: 'endif', detail: 'End if' },
  {
    label: 'loop',
    kind: 14,
    insertText: 'loop ${1:label}\nend',
    insertTextRules: 4,
    detail: 'Loop',
  },
  {
    label: 'alt',
    kind: 14,
    insertText: 'alt ${1:label}\nend',
    insertTextRules: 4,
    detail: 'Alternative',
  },
  {
    label: 'opt',
    kind: 14,
    insertText: 'opt ${1:label}\nend',
    insertTextRules: 4,
    detail: 'Optional',
  },
  {
    label: 'par',
    kind: 14,
    insertText: 'par ${1:label}\nend',
    insertTextRules: 4,
    detail: 'Parallel',
  },
  {
    label: 'package',
    kind: 14,
    insertText: 'package ${1:name} {\n}',
    insertTextRules: 4,
    detail: 'Package',
  },
  {
    label: 'namespace',
    kind: 14,
    insertText: 'namespace ${1:name} {\n}',
    insertTextRules: 4,
    detail: 'Namespace',
  },
  {
    label: 'entity',
    kind: 14,
    insertText: 'entity ${1:Name}',
    insertTextRules: 4,
    detail: 'Entity',
  },
  {
    label: 'database',
    kind: 14,
    insertText: 'database ${1:Name}',
    insertTextRules: 4,
    detail: 'Database',
  },
  {
    label: 'usecase',
    kind: 14,
    insertText: 'usecase ${1:Name}',
    insertTextRules: 4,
    detail: 'Use case',
  },
  {
    label: 'component',
    kind: 14,
    insertText: 'component ${1:Name}',
    insertTextRules: 4,
    detail: 'Component',
  },
  {
    label: 'rectangle',
    kind: 14,
    insertText: 'rectangle ${1:Name}',
    insertTextRules: 4,
    detail: 'Rectangle',
  },
  { label: '->', kind: 14, insertText: '->', detail: 'Arrow' },
  { label: '-->', kind: 14, insertText: '-->', detail: 'Dashed arrow' },
];

export function getCompletionItems(): Item[] {
  return COMPLETION_ITEMS;
}

export function provideCompletionItems(model: Monaco.editor.ITextModel, position: Monaco.Position) {
  const word = model.getWordUntilPosition(position);
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  };
  const lineContent = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
  const filtered = COMPLETION_ITEMS.filter((item) => {
    const label = typeof item.label === 'string' ? item.label : item.label.label;
    return label.startsWith('@start')
      ? lineContent.includes('@start') || label.startsWith('@start')
      : label.toLowerCase().startsWith(word.word.toLowerCase()) || word.word === '';
  });
  return { suggestions: filtered.map((item) => ({ ...item, range })) };
}

export function registerCompletionProvider(
  monaco: typeof import('monaco-editor'),
): Monaco.IDisposable {
  return monaco.languages.registerCompletionItemProvider(PLANTUML_LANGUAGE_ID, {
    triggerCharacters: ['@', '.'],
    provideCompletionItems: (model, position) => provideCompletionItems(model, position),
  });
}
