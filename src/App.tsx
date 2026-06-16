import { useCallback, useEffect, useState } from 'react';
import { PlantUmlEditor } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ExportDialog } from './components/ExportDialog/ExportDialog';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { usePlantUmlRender } from './hooks/usePlantUmlRender';
import { initRenderer, exportPng } from './plantuml/render';
import { createTimestampFilename, downloadBlob } from './utils/png';
import { trackAppOpen, trackExportPng } from './firebase/analytics';
import { STARTER_SOURCE } from './types/plantuml';
import './App.css';

export function App() {
  const [source, setSource] = useState(STARTER_SOURCE);
  const [exportOpen, setExportOpen] = useState(false);
  const debouncedSource = useDebouncedValue(source, 400);
  const { previewUrl, isLoading, error, diagnostics, lastGoodUrl } =
    usePlantUmlRender(debouncedSource);

  useEffect(() => {
    trackAppOpen();
    void initRenderer();
  }, []);

  const handleExport = useCallback(
    async (width: number, height: number) => {
      const blob = await exportPng({ source, width, height });
      downloadBlob(blob, createTimestampFilename());
      trackExportPng(width, height);
      setExportOpen(false);
    },
    [source],
  );

  return (
    <div className="app">
      <Toolbar
        onExportClick={() => setExportOpen(true)}
        exportDisabled={!source.trim() || Boolean(error)}
      />
      <main className="app-main">
        <PlantUmlEditor value={source} onChange={setSource} diagnostics={diagnostics} />
        <Preview
          imageUrl={previewUrl}
          lastGoodUrl={lastGoodUrl}
          isLoading={isLoading}
          errorMessage={error?.message ?? null}
        />
      </main>
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={handleExport}
        disabled={!source.trim() || Boolean(error)}
      />
    </div>
  );
}
