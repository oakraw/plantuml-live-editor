export const PLANTUML_LANGUAGE_ID = 'plantuml';

const KEYWORDS = [
  '@startuml',
  '@enduml',
  '@startmindmap',
  '@endmindmap',
  '@startsalt',
  '@endsalt',
  '@startgantt',
  '@endgantt',
  'actor',
  'participant',
  'class',
  'interface',
  'note',
  'if',
  'endif',
  'else',
  'elseif',
  'while',
  'endwhile',
  'loop',
  'end',
  'alt',
  'opt',
  'par',
  'group',
  'package',
  'namespace',
  'entity',
  'database',
  'queue',
  'boundary',
  'control',
  'collections',
  'rectangle',
  'card',
  'file',
  'folder',
  'frame',
  'cloud',
  'node',
  'usecase',
  'component',
  'artifact',
  'storage',
  'agent',
  'person',
];

export function tokenize(source: string): Array<{ type: string; value: string }> {
  const tokens: Array<{ type: string; value: string }> = [];
  const lines = source.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("'") || trimmed.startsWith('/')) {
      tokens.push({ type: 'comment', value: trimmed });
      continue;
    }

    const directiveMatch = trimmed.match(/@\w+/g);
    if (directiveMatch) {
      for (const directive of directiveMatch) {
        tokens.push({ type: 'directive', value: directive.toLowerCase() });
      }
    }

    for (const kw of KEYWORDS) {
      if (trimmed.toLowerCase().includes(kw.toLowerCase())) {
        tokens.push({ type: 'keyword', value: kw });
      }
    }

    if (trimmed.includes('->') || trimmed.includes('-->')) {
      tokens.push({ type: 'arrow', value: trimmed });
    }
  }

  return tokens;
}

export function registerPlantUmlLanguage(monaco: typeof import('monaco-editor')): void {
  if (monaco.languages.getLanguages().some((l) => l.id === PLANTUML_LANGUAGE_ID)) {
    return;
  }

  monaco.languages.register({ id: PLANTUML_LANGUAGE_ID });

  monaco.languages.setMonarchTokensProvider(PLANTUML_LANGUAGE_ID, {
    keywords: KEYWORDS,
    tokenizer: {
      root: [
        [/'.*$/, 'comment'],
        [/\/\/.*$/, 'comment'],
        [/\/\*[\s\S]*?\*\//, 'comment'],
        [/@\w+/, 'keyword'],
        [/\b(actor|participant|class|interface|note|if|endif|else|elseif)\b/, 'keyword'],
        [/->|-->/, 'operator'],
        [/[a-zA-Z_]\w*/, 'identifier'],
      ],
    },
  });
}
