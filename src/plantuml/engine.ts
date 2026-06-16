import type { RenderError } from '../types/plantuml';

const CHEERPJ_LOADER = 'https://cjrtnc.leaningtech.com/2.3/loader.js';
const PLANTUML_JAR = '/app/plantuml-core/plantuml-core.jar';
const PLANTUML_BASE = '/app/plantuml-core/';

let initPromise: Promise<void> | null = null;
let cheerpjLoaded = false;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export function initPlantUmlEngine(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      if (!cheerpjLoaded) {
        await loadScript(CHEERPJ_LOADER);
        cheerpjLoaded = true;
      }
      await cheerpjInit({ disableLoadTimeReporting: true, disableErrorReporting: true });
      await cheerpjRunMain('com.plantuml.api.cheerpj.v1.RunInit', PLANTUML_JAR, PLANTUML_BASE);
    })().catch((error: unknown) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

export function resetPlantUmlEngineForTesting(): void {
  initPromise = null;
  cheerpjLoaded = false;
}

function parseRenderError(result: string, source: string): RenderError {
  try {
    const parsed = JSON.parse(result) as PlantUmlRenderResult;
    if (parsed.message) {
      return { message: parsed.message, line: parsed.line ?? 1, column: 1 };
    }
  } catch {
    // fall through
  }
  if (!source.match(/@end[a-z]*/i)) {
    return { message: 'PlantUML render failed — check diagram syntax', line: 1, column: 1 };
  }
  return { message: result || 'PlantUML render failed', line: 1, column: 1 };
}

export async function renderPlantUmlSvg(source: string): Promise<string> {
  await initPlantUmlEngine();

  const result = await cjCall('com.plantuml.api.cheerpj.v1.Svg', 'convert', 'light', source).catch(
    (error: unknown) => {
      throw {
        message: error instanceof Error ? error.message : 'PlantUML render failed',
        line: 1,
        column: 1,
      } satisfies RenderError;
    },
  );

  if (result.startsWith('<')) return result;
  throw parseRenderError(result, source);
}
