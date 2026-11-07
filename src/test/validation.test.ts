import { describe, it, expect } from 'vitest';
import {
  isRecord,
  normalizeMeta,
  normalizeIntegrityProfile,
  normalizeInstitutionalNotes,
  normalizeState,
  validateImportJSON
} from '../utils/validation';
import { DEMO_STATE } from '../types';

describe('Validation and Normalization Utilities', () => {
  describe('isRecord', () => {
    it('identifies non-null records correctly', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord({ a: 1 })).toBe(true);
      expect(isRecord(null)).toBe(false);
      expect(isRecord([])).toBe(false);
      expect(isRecord('string')).toBe(false);
      expect(isRecord(123)).toBe(false);
      expect(isRecord(undefined)).toBe(false);
    });
  });

  describe('normalizeMeta', () => {
    it('provides defaults when raw input is invalid or empty', () => {
      const meta = normalizeMeta(null);
      expect(meta.moduleName).toBe('');
      expect(meta.programmeName).toBe('');
      expect(meta.assessmentTitle).toBe('');
      expect(meta.assessmentType).toBe('');
      expect(meta.level).toBe('');
    });

    it('maps historical and Studio fields such as unitTitle, unitCode and assessmentName', () => {
      const historical = {
        unitCode: 'COMP1001',
        unitTitle: 'Introduction to Programming',
        assessmentName: 'Practical Lab 1',
        assessor: 'Dr. Jane Smith',
        academicYear: '2026/27'
      };
      const normalized = normalizeMeta(historical);
      expect(normalized.moduleName).toBe('Introduction to Programming');
      expect(normalized.assessmentTitle).toBe('Practical Lab 1');
      expect(normalized.unitCode).toBe('COMP1001');
      expect(normalized.assessor).toBe('Dr. Jane Smith');
      expect(normalized.academicYear).toBe('2026/27');
    });

    it('preserves extra compatible fields without data loss', () => {
      const custom = {
        moduleName: 'Advanced AI',
        customAuditTag: 'AUDIT-2026',
        facultyId: 'ENG-04'
      };
      const normalized = normalizeMeta(custom);
      expect(normalized.moduleName).toBe('Advanced AI');
      expect((normalized as Record<string, unknown>).customAuditTag).toBe('AUDIT-2026');
      expect((normalized as Record<string, unknown>).facultyId).toBe('ENG-04');
    });
  });

  describe('normalizeIntegrityProfile', () => {
    it('provides clean defaults for non-record input', () => {
      const profile = normalizeIntegrityProfile(undefined);
      expect(profile.id).toBe('default-profile');
      expect(profile.aiUsagePosition).toBe('');
      expect(profile.acceptableUses).toEqual([]);
      expect(profile.unacceptableUses).toEqual([]);
      expect(profile.conditions).toEqual([]);
    });

    it('normalizes stance / aiUsagePosition across aliases and case variations', () => {
      expect(normalizeIntegrityProfile({ stance: 'conditional' }).aiUsagePosition).toBe('conditional');
      expect(normalizeIntegrityProfile({ stance: 'Conditional' }).aiUsagePosition).toBe('conditional');
      expect(normalizeIntegrityProfile({ stance: 'not-allowed' }).aiUsagePosition).toBe('not_allowed');
      expect(normalizeIntegrityProfile({ stance: 'Allowed' }).aiUsagePosition).toBe('allowed');
      expect(normalizeIntegrityProfile({ stance: 'not_allowed' }).stance).toBe('not_allowed');
    });

    it('cleans and normalizes list arrays, discarding non-strings', () => {
      const raw = {
        acceptableUses: [' Brainstorming ', null, 42, 'Outline drafting '],
        unacceptableUses: ['Direct copy-paste', ''],
        conditions: ['Must cite tool']
      };
      const profile = normalizeIntegrityProfile(raw);
      expect(profile.acceptableUses).toEqual(['Brainstorming', 'Outline drafting']);
      expect(profile.unacceptableUses).toEqual(['Direct copy-paste']);
      expect(profile.conditions).toEqual(['Must cite tool']);
    });

    it('preserves governance and historical acknowledgement fields', () => {
      const raw = {
        acknowledgementRequired: true,
        acknowledgementFormat: 'APA 7th AI citation standard',
        capabilityNotes: 'Reflective learning emphasized',
        governanceNotes: 'Reviewed by department board'
      };
      const profile = normalizeIntegrityProfile(raw);
      expect(profile.acknowledgementRequired).toBe(true);
      expect(profile.acknowledgementFormat).toBe('APA 7th AI citation standard');
      expect(profile.capabilityNotes).toBe('Reflective learning emphasized');
      expect(profile.governanceNotes).toBe('Reviewed by department board');
    });
  });

  describe('normalizeInstitutionalNotes', () => {
    it('falls back gracefully to rationale if generalNotes is absent', () => {
      const notes = normalizeInstitutionalNotes({ rationale: 'Institutional integrity policy v2' });
      expect(notes.generalNotes).toBe('Institutional integrity policy v2');
      expect(notes.rationale).toBe('Institutional integrity policy v2');
    });

    it('preserves staffMonitoringStrategy and reviewDate', () => {
      const notes = normalizeInstitutionalNotes({
        generalNotes: 'Annual check',
        staffMonitoringStrategy: 'Sampling 10% submissions',
        reviewDate: '2026-12-01'
      });
      expect(notes.generalNotes).toBe('Annual check');
      expect(notes.staffMonitoringStrategy).toBe('Sampling 10% submissions');
      expect(notes.reviewDate).toBe('2026-12-01');
    });
  });

  describe('normalizeState', () => {
    it('returns empty state with valid ISO timestamp for non-record', () => {
      const state = normalizeState('corrupted');
      expect(state.integrityProfile.id).toBe('default-profile');
      expect(!isNaN(Date.parse(state.lastUpdated))).toBe(true);
    });

    it('supports unwrapped flat historical profiles', () => {
      const flat = {
        stance: 'conditional',
        acceptableUses: ['Proofreading'],
        unacceptableUses: ['Full generation'],
        conditions: ['Declare prompt history']
      };
      const state = normalizeState(flat);
      expect(state.integrityProfile.aiUsagePosition).toBe('conditional');
      expect(state.integrityProfile.acceptableUses).toEqual(['Proofreading']);
    });
  });

  describe('validateImportJSON', () => {
    it('accepts valid full AppState exports', () => {
      const result = validateImportJSON(DEMO_STATE);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.moduleName).toBe('Health Policy Analysis');
        expect(result.data.integrityProfile.aiUsagePosition).toBe('conditional');
      }
    });

    it('rejects non-object files with descriptive error', () => {
      const result = validateImportJSON('string instead of json object');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Expected a valid JSON object');
      }
    });

    it('rejects foreign JSON without domain keys', () => {
      const result = validateImportJSON({ unrelated: true, foo: 'bar' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('does not contain AI Integrity Design data');
      }
    });

    it('rejects invalid nested array types in acceptableUses', () => {
      const invalid = {
        integrityProfile: {
          acceptableUses: 'not an array'
        }
      };
      const result = validateImportJSON(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("'acceptableUses' field must be an array");
      }
    });

    it('rejects non-string array entries', () => {
      const invalid = {
        integrityProfile: {
          acceptableUses: ['Valid string', { nested: 'object' }]
        }
      };
      const result = validateImportJSON(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("'acceptableUses' entry at index 1 must be a string");
      }
    });

    it('rejects invalid meta type when not an object', () => {
      const invalid = {
        integrityProfile: { title: 'Test' },
        meta: 'invalid-string'
      };
      const result = validateImportJSON(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("'meta' field must be an object");
      }
    });

    it('rejects invalid meta fields when types are incorrect', () => {
      const invalid = {
        integrityProfile: { title: 'Test' },
        meta: { moduleName: 12345 }
      };
      const result = validateImportJSON(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("meta 'moduleName' must be a string");
      }
    });

    it('accepts partial historical records and normalizes them safely', () => {
      const partial = {
        meta: { unitTitle: 'Software Engineering' },
        integrityProfile: {
          stance: 'allowed',
          acceptableUses: ['Pair coding'],
          unacceptableUses: [],
          conditions: []
        }
      };
      const result = validateImportJSON(partial);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meta.moduleName).toBe('Software Engineering');
        expect(result.data.integrityProfile.aiUsagePosition).toBe('allowed');
      }
    });
  });
});
