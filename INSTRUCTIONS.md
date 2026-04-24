# AI Integrity Design Tool — User Instructions

---

### 1. Purpose
The AI Integrity Design Tool is a local-first application designed to help educators and programme teams define clear, structured, and governance-ready approaches to acceptable AI use in assessment. It supports a shift from reactive enforcement to "integrity-by-design."

---

### 2. What This Tool Does
This tool enables users to:
- Define the context for an assessment (module name, programme, assessment type).
- Establish a clear position on AI usage (Allowed, Not Allowed, or Conditional).
- Specify granular acceptable and unacceptable AI uses.
- Define conditions and constraints for appropriate AI use.
- Generate student-facing guidance and staff-facing rationale.
- Document risks, authenticity considerations, and assumptions.
- Export integrity profiles for use in other CloudPedagogy tools.

---

### 3. Role in the Ecosystem
- **Phase:** Phase 4 — Assessment & Integrity Layer
- **Role:** Supports the design of AI-aware academic integrity approaches by defining acceptable use, conditions, risks, and guidance.
- **Reference:** [./PROJECT_SPEC.md](./PROJECT_SPEC.md)

---

### 4. When to Use This Tool
- **Designing New Assessments:** When creating an assessment and deciding how AI should (or should not) be used.
- **Reviewing Existing Assessments:** When updating existing assessments to address generative AI capabilities and risks.
- **Standardising Guidance:** When seeking to create consistent student-facing instructions across a programme.
- **Governance & Audit Preparation:** When documenting the rationale for AI-related assessment decisions for quality assurance.

---

### 5. Inputs
The tool expects the following inputs via the UI:
- **Assessment Metadata:** Module name, programme name, assessment title, type, and level.
- **Context Description:** A brief description of the assessment task and its purpose.
- **AI Usage Position:** Selection of "Allowed", "Not Allowed", or "Conditional".
- **Usage Lists:** Text-based lists of acceptable uses, unacceptable uses, and conditions.
- **Guidance & Rationale:** Qualitative descriptions of student guidance, staff rationale, and authenticity notes.
- **Governance Details:** Identification of risks, concerns, AI involvement in the design process, and assumptions.

---

### 6. How to Use (Step-by-Step)
1. **Define Assessment Context:** Enter the module and assessment details in the "Assessment Context" section.
2. **Set AI Usage Position:** Choose the high-level policy for AI use (Allowed, Not Allowed, or Conditional).
3. **Define Specific Uses:** Add items to the "Acceptable Uses" and "Unacceptable Uses" lists to provide clarity.
4. **Specify Conditions:** Add any specific boundaries or constraints in the "Conditions & Constraints" section.
5. **Draft Guidance & Rationale:** Write the student-facing instructions and the internal staff rationale.
6. **Address Risks & Governance:** Document any risks, authenticity concerns, and assumptions.
7. **Review & Refine:** Check the generated output summary for consistency and clarity.
8. **Export/Save:** Use the "Export JSON" button to save your work locally or "Copy to Clipboard" to use the text in other documents.

---

### 7. Key Outputs
- **Integrity Profile:** A comprehensive summary of the AI integrity approach for a specific assessment.
- **Student-Facing Guidance:** Ready-to-use text for assessment briefs.
- **Staff Rationale:** Documented justification for AI-related design decisions.
- **JSON Export:** A machine-readable file for persistence and interoperability with other CloudPedagogy tools.

---

### 8. How It Connects to Other Tools
- **Upstream:** Assessment structures from the **Assessment Design Engine**.
- **Downstream:** Structured guidance for the **Evidence & QA Pack Generator** and inputs for the **Curriculum Change Manager** to track policy evolution.

---

### 9. Limitations
- **Not a Detection Tool:** This tool does not detect or police AI-generated content or misconduct.
- **Not a Policy Replacement:** It does not replace institutional policy frameworks but helps implement them at the assessment level.
- **No Automated Decisions:** It supports human judgement; it does not automatically determine if an assessment is "safe" or "compliant."
- **Local Persistence:** Data is stored in your browser's `localStorage`; clearing browser data will remove unsaved work.

---

### 10. Tips
- **Be Specific:** Use the list editors to provide concrete examples of what AI can and cannot do to reduce student ambiguity.
- **Align with Outcomes:** Ensure the "Staff Rationale" explains how the AI usage position supports the achievement of learning outcomes.
- **Regular Exports:** Regularly use the "Export JSON" feature to keep backups of your integrity designs outside of the browser.
- **Use the Demo:** Load the "Demo State" (if available) to see an example of a well-documented postgraduate policy essay.
