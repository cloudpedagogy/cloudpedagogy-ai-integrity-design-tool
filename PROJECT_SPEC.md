# PROJECT_SPEC: cloudpedagogy-ai-integrity-design-tool

## 1. Repo Name
`cloudpedagogy-ai-integrity-design-tool`

## 2. One-Sentence Purpose
A local-first, governance-aware tool for designing and documenting structured approaches to AI integrity and acceptable use in academic assessments.

## 3. Problem the App Solves
Educators often struggle to translate high-level institutional AI policies into clear, granular, and pedagogically sound guidance for specific assessment tasks. This can lead to student confusion, inconsistent enforcement, and risks to academic integrity. This app provides a structured framework to design "integrity-by-design" assessments by documenting acceptable use, conditions, and rationales.

## 4. Primary User / Audience
- Educators and Module Leaders
- Programme Teams
- Academic Integrity Officers
- Learning Designers

## 5. Core Role in the CloudPedagogy Ecosystem
The tool occupies **Phase 4 (Assessment & Integrity Layer)** of the CloudPedagogy capability framework. It bridges the gap between assessment design (upstream) and quality assurance/evidence generation (downstream).

## 6. Main Entities / Data Structures
- **Meta**: Contains high-level context (moduleName, programmeName, assessmentTitle, assessmentType, level).
- **IntegrityProfile**: The core data structure containing:
  - `aiUsagePosition`: The high-level stance (allowed/not_allowed/conditional).
  - `acceptableUses` / `unacceptableUses`: Arrays of specific allowed/prohibited AI actions.
  - `conditions`: Constraints on AI usage (e.g., must declare use).
  - `studentGuidance` / `staffRationale`: Qualitative text for different audiences.
  - `authenticityNotes`: Notes on how task authenticity is preserved.
  - `risksOrConcerns`: Documentation of potential integrity risks.
  - `aiInvolvement` / `assumptions`: Governance metadata.
- **InstitutionalNotes**: Supplementary context such as policy references.
- **AppState**: The top-level object combining Meta, IntegrityProfile, and InstitutionalNotes.

## 7. Main User Workflows
1. **Context Setup**: User enters metadata about the module and assessment.
2. **Integrity Configuration**: User selects an AI usage position and builds lists of acceptable/unacceptable uses and conditions.
3. **Guidance Drafting**: User writes student instructions and the pedagogical rationale for the chosen AI stance.
4. **Governance Documentation**: User identifies risks and documents design assumptions.
5. **Output & Persistence**: User reviews the summary, exports the design as a JSON file, or copies the text for use in an assessment brief.

## 8. Current Features
- **Structured List Editing**: Interactive components for managing acceptable uses, unacceptable uses, and conditions.
- **AI Usage Positioning**: Radio-based selection for defining the high-level policy.
- **Real-time Output Summary**: Dynamic generation of a structured report (Student View, Staff View, Governance View).
- **Local Persistence**: Automatic saving to `localStorage`.
- **Interoperability**: JSON import and export functionality.
- **Governance Alignment**: Dedicated fields for risks, assumptions, and AI involvement.

## 9. Stubbed / Partial / Incomplete Features
- Multi-profile management (current app focuses on a single profile per session).
- Direct integration/API push to other CloudPedagogy tools (currently manual via JSON).

## 10. Import / Export and Storage Model
- **Storage**: Browser `localStorage` for persistent session state.
- **Import/Export**: JSON-based import/export for portability and long-term storage. The data model is designed to be compatible with other CloudPedagogy tools.

## 11. Relationship to Other CloudPedagogy Apps
- **Upstream**: Can receive assessment structures from the **Assessment Design Engine**.
- **Downstream**: Provides the "Integrity Layer" data for the **Evidence & QA Pack Generator** and policy evolution tracking for the **Curriculum Change Manager**.

## 12. Potential Overlap or Duplication Risks
- Minor overlap with the **Assessment Design Engine** if that tool also attempts to define integrity; however, this tool is the primary "owner" of granular integrity definitions.
- Potential overlap with institutional Virtual Learning Environments (VLEs) if they provide similar form-based brief generators.

## 13. Distinctive Value of This App
This tool focuses specifically on the *design* of integrity rather than just the *detection* of misconduct. It forces a structured reflection on *why* and *how* AI is used, resulting in more defensible and transparent assessment practices.

## 14. Recommended Future Enhancements
- Template library for common assessment types (e.g., standard essay, coding task).
- Version history for integrity profiles.
- Better visualization of risk-to-authenticity mappings.
- Integration with institutional policy APIs to pull in standard "base" conditions.

## 15. Anything Unclear or Inferred from Repo Contents
- **Phase 4 Assignment**: Inferred from README.
- **Downstream/Upstream relationships**: Inferred from README and general CloudPedagogy ecosystem knowledge.
- **Entity Names**: Taken directly from `src/types.ts`.

## Capability and Governance Alignment

This tool is aligned with the CloudPedagogy Capability and Governance standard.

- Capability: The tool supports development of practical AI capability through structured interaction and workflow use.
- Governance: The tool includes lightweight, optional fields that make assumptions, risks, and decisions visible and reviewable.

This alignment ensures the tool supports both effective use of AI and responsible, accountable practice.
