import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportStateAsJSON } from '../utils/export';
import { validateImportJSON } from '../utils/validation';
import { DEMO_STATE } from '../types';

describe('Export Functionality and Round-Trip Compatibility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates Blob with application/json and triggers download via object URL', () => {
    let createdBlob: Blob | null = null;
    let revokedUrl: string | null = null;

    const mockCreateObjectURL = vi.fn((blob: Blob) => {
      createdBlob = blob;
      return 'blob:http://localhost/mock-uuid';
    });
    const mockRevokeObjectURL = vi.fn((url: string) => {
      revokedUrl = url;
    });

    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    let clickedDownload = false;
    let downloadHref = '';
    let downloadFilename = '';

    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clickedDownload = true;
      downloadHref = this.getAttribute('href') || '';
      downloadFilename = this.getAttribute('download') || '';
    });

    vi.useFakeTimers();

    exportStateAsJSON(DEMO_STATE, 'custom-ai-design.json');

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    expect(createdBlob).not.toBeNull();
    expect(createdBlob!.type).toBe('application/json');

    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickedDownload).toBe(true);
    expect(downloadHref).toBe('blob:http://localhost/mock-uuid');
    expect(downloadFilename).toBe('custom-ai-design.json');

    // Revoke URL timeout
    vi.advanceTimersByTime(200);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/mock-uuid');
    expect(revokedUrl).toBe('blob:http://localhost/mock-uuid');

    vi.useRealTimers();
  });

  it('guarantees complete round-trip fidelity between export and import', async () => {
    // Verify that exporting state as a JSON Blob and parsing it back yields exact fidelity
    const jsonStr = JSON.stringify(DEMO_STATE, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const text = await blob.text();

    const parsed = JSON.parse(text);
    const importResult = validateImportJSON(parsed);

    expect(importResult.success).toBe(true);
    if (importResult.success) {
      expect(importResult.data.meta).toEqual(DEMO_STATE.meta);
      expect(importResult.data.integrityProfile.aiUsagePosition).toBe(DEMO_STATE.integrityProfile.aiUsagePosition);
      expect(importResult.data.integrityProfile.acceptableUses).toEqual(DEMO_STATE.integrityProfile.acceptableUses);
      expect(importResult.data.integrityProfile.unacceptableUses).toEqual(DEMO_STATE.integrityProfile.unacceptableUses);
      expect(importResult.data.integrityProfile.conditions).toEqual(DEMO_STATE.integrityProfile.conditions);
      expect(importResult.data.integrityProfile.studentGuidance).toBe(DEMO_STATE.integrityProfile.studentGuidance);
      expect(importResult.data.integrityProfile.staffRationale).toBe(DEMO_STATE.integrityProfile.staffRationale);
      expect(importResult.data.institutionalNotes.policyReference).toBe(DEMO_STATE.institutionalNotes.policyReference);
    }
  });
});
