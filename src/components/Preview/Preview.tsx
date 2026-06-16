import './Preview.css';

interface PreviewProps {
  imageUrl: string | null;
  lastGoodUrl: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function Preview({ imageUrl, lastGoodUrl, isLoading, errorMessage }: PreviewProps) {
  const displayUrl = errorMessage ? lastGoodUrl : imageUrl;

  return (
    <section className="preview-panel" aria-label="Diagram preview" role="region">
      {errorMessage && (
        <div className="error-banner" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="preview-panel__body">
        {isLoading && (
          <div className="loading-indicator" aria-live="polite">
            Rendering diagram… (first load may take a few seconds)
          </div>
        )}
        {displayUrl ? (
          <img src={displayUrl} alt="Rendered PlantUML diagram" className="preview-image" />
        ) : (
          <p className="preview-empty">Start typing PlantUML to see a preview.</p>
        )}
      </div>
    </section>
  );
}
