import { useCallback, useEffect, useRef, useState } from 'react';
import { trackRenderError, trackRenderSuccess } from '../firebase/analytics';
import { renderPlantUmlPreview } from '../plantuml/render';
import { validatePlantUmlSource } from '../plantuml/validate';
import type { DiagnosticIssue, RenderError } from '../types/plantuml';

export function usePlantUmlRender(source: string) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastGoodUrl, setLastGoodUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<RenderError | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticIssue[]>([]);
  const objectUrlRef = useRef<string | null>(null);

  const revokeUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const renderNow = useCallback(
    async (nextSource: string) => {
      if (!nextSource.trim()) {
        setIsLoading(false);
        setError(null);
        setDiagnostics([]);
        setPreviewUrl(null);
        return;
      }

      const validationError = validatePlantUmlSource(nextSource);
      if (validationError) {
        setIsLoading(false);
        setError(validationError);
        setDiagnostics([{ ...validationError, severity: 'error' }]);
        trackRenderError();
        return;
      }

      setIsLoading(true);
      setError(null);
      setDiagnostics([]);

      try {
        const result = await renderPlantUmlPreview(nextSource);
        revokeUrl();
        const url = URL.createObjectURL(result.blob);
        objectUrlRef.current = url;
        setPreviewUrl(url);
        setLastGoodUrl(url);
        trackRenderSuccess();
      } catch (renderError) {
        const err = renderError as RenderError;
        setError(err);
        setDiagnostics([{ ...err, severity: 'error' }]);
        trackRenderError();
      } finally {
        setIsLoading(false);
      }
    },
    [revokeUrl],
  );

  useEffect(() => {
    void renderNow(source);
  }, [source, renderNow]);
  useEffect(() => () => revokeUrl(), [revokeUrl]);

  return { previewUrl, isLoading, error, diagnostics, lastGoodUrl };
}
