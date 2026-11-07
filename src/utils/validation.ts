import type { AppState, Meta, IntegrityProfile, InstitutionalNotes, AIUsagePosition } from '../types';
import { createEmptyState } from '../types';

export const STORAGE_KEY = 'cp-ai-integrity-state';
export const STORAGE_BACKUP_KEY = 'cp-ai-integrity-state-corrupted-backup';

/**
 * Checks whether an unknown value is a non-null Record object.
 */
export function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Non-destructively saves corrupted data to a dedicated backup key.
 * Never overwrites an existing backup.
 */
export function saveCorruptedBackup(rawCorrupted: string): void {
  try {
    const existingBackup = localStorage.getItem(STORAGE_BACKUP_KEY);
    if (!existingBackup && rawCorrupted) {
      localStorage.setItem(STORAGE_BACKUP_KEY, rawCorrupted);
    }
  } catch (e) {
    console.warn('Unable to write to storage backup key:', e);
  }
}

/**
 * Normalizes an unknown object into Meta, preserving valid historical values.
 */
export function normalizeMeta(raw: unknown): Meta {
  if (!isRecord(raw)) {
    return {
      moduleName: '',
      programmeName: '',
      assessmentTitle: '',
      assessmentType: '',
      level: '',
    };
  }

  // Preserve all compatible fields
  const meta: Meta = { ...raw };

  const moduleName = typeof raw.moduleName === 'string' 
    ? raw.moduleName 
    : (typeof raw.unitTitle === 'string' ? raw.unitTitle : (typeof raw.unitCode === 'string' ? raw.unitCode : ''));

  const programmeName = typeof raw.programmeName === 'string' ? raw.programmeName : '';

  const assessmentTitle = typeof raw.assessmentTitle === 'string' 
    ? raw.assessmentTitle 
    : (typeof raw.assessmentName === 'string' ? raw.assessmentName : '');

  const assessmentType = typeof raw.assessmentType === 'string' ? raw.assessmentType : '';
  const level = typeof raw.level === 'string' ? raw.level : '';

  meta.moduleName = moduleName;
  meta.programmeName = programmeName;
  meta.assessmentTitle = assessmentTitle;
  meta.assessmentType = assessmentType;
  meta.level = level;

  if (typeof raw.unitCode === 'string') meta.unitCode = raw.unitCode;
  if (typeof raw.unitTitle === 'string') meta.unitTitle = raw.unitTitle;
  if (typeof raw.assessmentName === 'string') meta.assessmentName = raw.assessmentName;
  if (typeof raw.assessor === 'string') meta.assessor = raw.assessor;
  if (typeof raw.academicYear === 'string') meta.academicYear = raw.academicYear;
  if (typeof raw.lastUpdated === 'string') meta.lastUpdated = raw.lastUpdated;

  return meta;
}

/**
 * Normalizes an unknown object into IntegrityProfile, preserving historical schema variations.
 */
export function normalizeIntegrityProfile(raw: unknown): IntegrityProfile {
  const empty = createEmptyState().integrityProfile;
  if (!isRecord(raw)) {
    return empty;
  }

  const profile: IntegrityProfile = { ...empty, ...raw };

  // ID and titles
  profile.id = typeof raw.id === 'string' && raw.id.trim() ? raw.id : 'default-profile';
  profile.title = typeof raw.title === 'string' ? raw.title : '';
  profile.contextDescription = typeof raw.contextDescription === 'string' ? raw.contextDescription : '';

  // AI Usage Position / Stance normalisation
  let pos: AIUsagePosition = '';
  const rawCandidate = typeof raw.aiUsagePosition === 'string'
    ? raw.aiUsagePosition
    : (typeof raw.stance === 'string' ? raw.stance : '');
  const cleaned = rawCandidate.trim().toLowerCase().replace(/[-\s]/g, '_');
  if (cleaned === 'allowed' || cleaned === 'not_allowed' || cleaned === 'conditional') {
    pos = cleaned as AIUsagePosition;
  }
  profile.aiUsagePosition = pos;
  if (typeof raw.stance === 'string' || pos) {
    profile.stance = (typeof raw.stance === 'string' ? raw.stance : pos) as AIUsagePosition;
  }

  // Lists: ensure string[]
  const cleanList = (val: unknown): string[] => {
    if (!Array.isArray(val)) return [];
    return val
      .filter((item): item is string => typeof item === 'string')
      .map(s => s.trim())
      .filter(Boolean);
  };

  profile.acceptableUses = cleanList(raw.acceptableUses);
  profile.unacceptableUses = cleanList(raw.unacceptableUses);
  profile.conditions = cleanList(raw.conditions);

  // String fields
  profile.studentGuidance = typeof raw.studentGuidance === 'string' ? raw.studentGuidance : '';
  profile.staffRationale = typeof raw.staffRationale === 'string' ? raw.staffRationale : '';
  profile.authenticityNotes = typeof raw.authenticityNotes === 'string' ? raw.authenticityNotes : '';
  profile.risksOrConcerns = typeof raw.risksOrConcerns === 'string' ? raw.risksOrConcerns : '';
  profile.aiInvolvement = typeof raw.aiInvolvement === 'string' ? raw.aiInvolvement : '';
  profile.assumptions = typeof raw.assumptions === 'string' ? raw.assumptions : '';
  profile.reviewNotes = typeof raw.reviewNotes === 'string' ? raw.reviewNotes : '';
  profile.capabilityNotes = typeof raw.capabilityNotes === 'string' ? raw.capabilityNotes : '';
  profile.governanceNotes = typeof raw.governanceNotes === 'string' ? raw.governanceNotes : '';

  // Historical governance fields
  if (typeof raw.acknowledgementRequired === 'boolean' || typeof raw.acknowledgementRequired === 'string') {
    profile.acknowledgementRequired = raw.acknowledgementRequired;
  }
  if (typeof raw.acknowledgementFormat === 'string') {
    profile.acknowledgementFormat = raw.acknowledgementFormat;
  }

  return profile;
}

/**
 * Normalizes an unknown object into InstitutionalNotes.
 */
export function normalizeInstitutionalNotes(raw: unknown): InstitutionalNotes {
  if (!isRecord(raw)) {
    return { generalNotes: '' };
  }

  const notes: InstitutionalNotes = { ...raw };
  const generalNotes = typeof raw.generalNotes === 'string'
    ? raw.generalNotes
    : (typeof raw.rationale === 'string' ? raw.rationale : '');

  notes.generalNotes = generalNotes;
  if (typeof raw.policyReference === 'string') notes.policyReference = raw.policyReference;
  if (typeof raw.rationale === 'string') notes.rationale = raw.rationale;
  if (typeof raw.staffMonitoringStrategy === 'string') notes.staffMonitoringStrategy = raw.staffMonitoringStrategy;
  if (typeof raw.reviewDate === 'string') notes.reviewDate = raw.reviewDate;

  return notes;
}

/**
 * Normalizes an arbitrary parsed object into AppState.
 */
export function normalizeState(raw: unknown): AppState {
  if (!isRecord(raw)) {
    return { ...createEmptyState(), lastUpdated: new Date().toISOString() };
  }

  // Preserve extra top-level fields
  const base: AppState = {
    ...raw,
    meta: normalizeMeta(raw.meta),
    integrityProfile: isRecord(raw.integrityProfile)
      ? normalizeIntegrityProfile(raw.integrityProfile)
      : (raw.acceptableUses || raw.aiUsagePosition || raw.stance ? normalizeIntegrityProfile(raw) : createEmptyState().integrityProfile),
    institutionalNotes: normalizeInstitutionalNotes(raw.institutionalNotes),
    lastUpdated: typeof raw.lastUpdated === 'string' && !isNaN(Date.parse(raw.lastUpdated))
      ? raw.lastUpdated
      : new Date().toISOString(),
  };

  return base;
}

export type ValidationResult =
  | { success: true; data: AppState }
  | { success: false; error: string };

/**
 * Proportionate structural validation for imported JSON.
 */
export function validateImportJSON(raw: unknown): ValidationResult {
  if (!isRecord(raw)) {
    return {
      success: false,
      error: 'Invalid file format: Expected a valid JSON object.',
    };
  }

  const recognizedKeys = [
    'integrityProfile',
    'meta',
    'institutionalNotes',
    'acceptableUses',
    'unacceptableUses',
    'conditions',
    'aiUsagePosition',
    'stance'
  ];

  const hasRecognizedKey = recognizedKeys.some(key => key in raw);
  if (!hasRecognizedKey) {
    return {
      success: false,
      error: 'Unrecognized file structure: File does not contain AI Integrity Design data.',
    };
  }

  // Validate meta if present
  if ('meta' in raw && raw.meta !== undefined) {
    if (!isRecord(raw.meta)) {
      return {
        success: false,
        error: "Invalid structure: 'meta' field must be an object.",
      };
    }
    const metaStringFields = [
      'moduleName', 'programmeName', 'assessmentTitle', 'assessmentType',
      'level', 'unitCode', 'unitTitle', 'assessmentName', 'assessor', 'academicYear'
    ];
    for (const field of metaStringFields) {
      if (field in raw.meta && raw.meta[field] !== undefined && typeof raw.meta[field] !== 'string') {
        return {
          success: false,
          error: `Invalid structure: meta '${field}' must be a string.`,
        };
      }
    }
  }

  // Validate institutionalNotes if present
  if ('institutionalNotes' in raw && raw.institutionalNotes !== undefined) {
    if (!isRecord(raw.institutionalNotes)) {
      return {
        success: false,
        error: "Invalid structure: 'institutionalNotes' field must be an object.",
      };
    }
  }

  // Determine profile object to validate
  let profileToValidate: unknown;
  if ('integrityProfile' in raw) {
    if (!isRecord(raw.integrityProfile)) {
      return {
        success: false,
        error: "Invalid structure: 'integrityProfile' field must be an object.",
      };
    }
    profileToValidate = raw.integrityProfile;
  } else if ('acceptableUses' in raw || 'unacceptableUses' in raw || 'conditions' in raw || 'aiUsagePosition' in raw || 'stance' in raw) {
    profileToValidate = raw;
  }

  if (isRecord(profileToValidate)) {
    const listFields = ['acceptableUses', 'unacceptableUses', 'conditions'] as const;
    for (const field of listFields) {
      if (field in profileToValidate && profileToValidate[field] !== undefined) {
        if (!Array.isArray(profileToValidate[field])) {
          return {
            success: false,
            error: `Invalid structure: '${field}' field must be an array.`,
          };
        }
        const arr = profileToValidate[field] as unknown[];
        for (let i = 0; i < arr.length; i++) {
          if (typeof arr[i] !== 'string') {
            return {
              success: false,
              error: `Invalid structure: '${field}' entry at index ${i} must be a string.`,
            };
          }
        }
      }
    }

    const textFields = [
      'title', 'contextDescription', 'studentGuidance', 'staffRationale',
      'authenticityNotes', 'risksOrConcerns', 'aiInvolvement', 'assumptions',
      'reviewNotes', 'capabilityNotes', 'governanceNotes'
    ] as const;

    for (const field of textFields) {
      if (field in profileToValidate && profileToValidate[field] !== undefined && typeof profileToValidate[field] !== 'string') {
        return {
          success: false,
          error: `Invalid structure: '${field}' field must be a string.`,
        };
      }
    }
  }

  return {
    success: true,
    data: normalizeState(raw),
  };
}
