import type { AppState } from '../types';

export const getPositionLabel = (pos: string): string => {
  const normalized = (pos || '').trim().toLowerCase().replace(/[-\s]/g, '_');
  switch (normalized) {
    case 'allowed':
      return 'Allowed';
    case 'not_allowed':
      return 'Not Allowed';
    case 'conditional':
      return 'Conditional';
    default:
      return pos ? pos : 'Not Defined';
  }
};

export function generatePlainTextSummary(state: AppState): string {
  const { meta, integrityProfile, institutionalNotes } = state;
  const lines: string[] = [];

  lines.push('===================================================');
  lines.push('AI INTEGRITY STATEMENT & GUIDANCE');
  lines.push('===================================================');
  lines.push('');

  lines.push('--- ASSESSMENT CONTEXT ---');
  lines.push(`Programme: ${meta.programmeName || 'N/A'}`);
  lines.push(`Module: ${meta.moduleName || 'N/A'}`);
  lines.push(`Assessment: ${meta.assessmentTitle || 'N/A'} (${meta.assessmentType || 'Type N/A'} - ${meta.level || 'Level N/A'})`);
  if (integrityProfile.contextDescription) {
    lines.push(`Context: ${integrityProfile.contextDescription}`);
  }
  lines.push('');

  const stanceLabel = getPositionLabel(integrityProfile.aiUsagePosition || (integrityProfile.stance as string) || '');
  lines.push('--- AI USAGE POSITION ---');
  lines.push(`Position: ${stanceLabel}`);
  lines.push('');

  lines.push('--- ACCEPTABLE USES ---');
  if (integrityProfile.acceptableUses && integrityProfile.acceptableUses.length > 0) {
    integrityProfile.acceptableUses.forEach(item => lines.push(`• ${item}`));
  } else {
    lines.push('None specified.');
  }
  lines.push('');

  lines.push('--- UNACCEPTABLE USES ---');
  if (integrityProfile.unacceptableUses && integrityProfile.unacceptableUses.length > 0) {
    integrityProfile.unacceptableUses.forEach(item => lines.push(`• ${item}`));
  } else {
    lines.push('None specified.');
  }
  lines.push('');

  lines.push('--- CONDITIONS / CAVEATS ---');
  if (integrityProfile.conditions && integrityProfile.conditions.length > 0) {
    integrityProfile.conditions.forEach(item => lines.push(`• ${item}`));
  } else {
    lines.push('None specified.');
  }
  lines.push('');

  if (integrityProfile.acknowledgementRequired !== undefined || integrityProfile.acknowledgementFormat) {
    lines.push('--- ACKNOWLEDGEMENT REQUIREMENTS ---');
    if (integrityProfile.acknowledgementRequired !== undefined) {
      const isReq = typeof integrityProfile.acknowledgementRequired === 'boolean'
        ? (integrityProfile.acknowledgementRequired ? 'Yes' : 'No')
        : integrityProfile.acknowledgementRequired;
      lines.push(`Declaration Required: ${isReq}`);
    }
    if (integrityProfile.acknowledgementFormat) {
      lines.push(`Format: ${integrityProfile.acknowledgementFormat}`);
    }
    lines.push('');
  }

  lines.push('--- STUDENT GUIDANCE ---');
  lines.push(integrityProfile.studentGuidance || 'None specified.');
  lines.push('');

  lines.push('--- STAFF RATIONALE ---');
  lines.push(integrityProfile.staffRationale || 'None specified.');
  lines.push('');

  lines.push('--- AUTHENTICITY NOTES ---');
  lines.push(integrityProfile.authenticityNotes || 'None specified.');
  lines.push('');

  lines.push('--- RISKS / CONCERNS ---');
  lines.push(integrityProfile.risksOrConcerns || 'None specified.');
  lines.push('');

  if (integrityProfile.reviewNotes) {
    lines.push('--- REVIEW NOTES ---');
    lines.push(integrityProfile.reviewNotes);
    lines.push('');
  }

  if (integrityProfile.aiInvolvement) {
    lines.push('--- AI INVOLVEMENT ---');
    lines.push(integrityProfile.aiInvolvement);
    lines.push('');
  }

  if (integrityProfile.assumptions) {
    lines.push('--- ASSUMPTIONS ---');
    lines.push(integrityProfile.assumptions);
    lines.push('');
  }

  lines.push('--- INSTITUTIONAL NOTES ---');
  if (institutionalNotes.policyReference) {
    lines.push(`Policy Reference: ${institutionalNotes.policyReference}`);
  }
  if (institutionalNotes.generalNotes) {
    lines.push(institutionalNotes.generalNotes);
  } else if (!institutionalNotes.policyReference) {
    lines.push('None specified.');
  }
  if (institutionalNotes.staffMonitoringStrategy) {
    lines.push(`Monitoring Strategy: ${institutionalNotes.staffMonitoringStrategy}`);
  }
  if (institutionalNotes.reviewDate) {
    lines.push(`Review Date: ${institutionalNotes.reviewDate}`);
  }
  lines.push('');

  if (integrityProfile.capabilityNotes || integrityProfile.governanceNotes) {
    lines.push('--- CAPABILITY & GOVERNANCE REFLECTION ---');
    if (integrityProfile.capabilityNotes) {
      lines.push(`Capability: ${integrityProfile.capabilityNotes}`);
    }
    if (integrityProfile.governanceNotes) {
      lines.push(`Governance: ${integrityProfile.governanceNotes}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
