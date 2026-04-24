export type AIUsagePosition = 'allowed' | 'not_allowed' | 'conditional' | '';

export interface Meta {
  moduleName?: string;
  programmeName?: string;
  assessmentTitle?: string;
  assessmentType?: string;
  level?: string;
}

export interface IntegrityProfile {
  id: string; // usually fixed or simply randomly generated for the single profile if needed
  title: string;
  contextDescription: string;
  aiUsagePosition: AIUsagePosition;
  acceptableUses: string[];
  unacceptableUses: string[];
  conditions: string[];
  studentGuidance: string;
  staffRationale: string;
  authenticityNotes: string;
  risksOrConcerns: string;
  aiInvolvement?: string;
  assumptions?: string;
  reviewNotes?: string;
}

export interface InstitutionalNotes {
  policyReference?: string;
  generalNotes?: string;
}

export interface AppState {
  meta: Meta;
  integrityProfile: IntegrityProfile;
  institutionalNotes: InstitutionalNotes;
  lastUpdated: string;
}

export const createEmptyState = (): AppState => ({
  meta: {
    moduleName: '',
    programmeName: '',
    assessmentTitle: '',
    assessmentType: '',
    level: '',
  },
  integrityProfile: {
    id: 'default-profile',
    title: '',
    contextDescription: '',
    aiUsagePosition: '',
    acceptableUses: [],
    unacceptableUses: [],
    conditions: [],
    studentGuidance: '',
    staffRationale: '',
    authenticityNotes: '',
    risksOrConcerns: '',
    aiInvolvement: '',
    assumptions: '',
    reviewNotes: '',
  },
  institutionalNotes: {
    generalNotes: '',
  },
  lastUpdated: new Date().toISOString(),
});

export const DEMO_STATE: AppState = {
  meta: {
    moduleName: 'Health Policy Analysis',
    programmeName: 'Master of Public Health',
    assessmentTitle: 'Policy Analysis Essay',
    assessmentType: 'Essay',
    level: 'Postgraduate',
  },
  integrityProfile: {
    id: 'demo-policy-analysis-essay',
    title: 'Policy Analysis Essay – Public Health',
    contextDescription: 'Students are required to write a policy analysis essay examining a current public health policy issue. The task is intended to assess critical analysis, use of evidence, policy reasoning, and the student’s ability to construct a coherent argument.',
    aiUsagePosition: 'conditional',
    acceptableUses: [
      'Brainstorming possible policy angles or questions',
      'Creating an initial essay structure or outline',
      'Improving clarity, grammar, or academic tone in student-written text',
      'Summarising policy documents or reports for initial orientation',
      'Helping identify areas that may need further evidence or explanation'
    ],
    unacceptableUses: [
      'Generating the full essay or substantial sections of the final submission',
      'Producing final arguments without the student’s own critical analysis',
      'Fabricating references, data, citations, or policy examples',
      'Replacing the student’s own interpretation of the policy issue',
      'Submitting AI-generated text as if it were fully the student’s own work'
    ],
    conditions: [
      'Students must remain responsible for the final argument, structure, and interpretation',
      'Any AI use must comply with module and institutional guidance',
      'Students should critically evaluate any AI-generated suggestions before using them',
      'Students may be required to declare or describe how AI was used in completing the task',
      'Use of AI must not replace independent reading, evidence selection, or policy reasoning'
    ],
    studentGuidance: 'You may use generative AI tools in a limited and supportive way for this assessment, for example to help brainstorm ideas, improve the clarity of your writing, or summarise documents for initial orientation. However, the final essay must reflect your own critical analysis, argument, and interpretation. You must not use AI to generate the full essay, produce final arguments for you, or fabricate references or evidence. You remain responsible for the accuracy, originality, and academic integrity of your submission.',
    staffRationale: 'This assessment is designed to evaluate students’ ability to analyse public health policy critically, use evidence appropriately, and construct an independent argument. Limited AI use may support planning and writing development, but unrestricted AI use would undermine the authenticity of the task and reduce confidence that the submitted work represents the student’s own reasoning.',
    authenticityNotes: 'Authenticity is preserved when AI is used only as a support tool and not as a substitute for critical thinking, evidence selection, or policy analysis. The core learning outcome depends on the student demonstrating independent judgement.',
    risksOrConcerns: 'Key risks include over-reliance on AI-generated arguments, shallow engagement with source material, fabricated references, and reduced visibility of the student’s own analytical thinking.',
    aiInvolvement: 'Drafted integrity guidelines with AI support, followed by module lead review.',
    assumptions: 'Assumes basic student AI literacy and institutional guideline accessibility.',
    reviewNotes: 'This example is intended as a public health demo scenario and can be adapted for other assessment types later.',
  },
  institutionalNotes: {
    policyReference: 'Refer to local institutional guidance on acceptable use of generative AI in assessment.',
    generalNotes: 'This demo should remain editable by users after loading.',
  },
  lastUpdated: new Date().toISOString(),
};
