import type { AppState } from '../types';

/**
 * Exports application state as a JSON file using Blob and URL.createObjectURL.
 * Safely revokes the temporary object URL after download trigger.
 */
export function exportStateAsJSON(state: AppState, filename = 'ai-integrity-design.json'): void {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', url);
  downloadAnchorNode.setAttribute('download', filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();

  // Safely revoke object URL after the browser has initiated the download
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 150);
}
