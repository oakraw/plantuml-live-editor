import './Toolbar.css';

interface ToolbarProps {
  onExportClick: () => void;
  exportDisabled: boolean;
}

export function Toolbar({ onExportClick, exportDisabled }: ToolbarProps) {
  return (
    <header className="toolbar" role="toolbar" aria-label="Editor toolbar">
      <h1 className="toolbar-title">PlantUML Live Editor</h1>
      <button
        type="button"
        className="button-primary"
        onClick={onExportClick}
        disabled={exportDisabled}
        aria-label="Export diagram as PNG"
      >
        Export PNG
      </button>
    </header>
  );
}
