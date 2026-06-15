"use client";

import { RichTextEditor } from "@seleksi/ui";
import { useState } from "react";

const optionLabels = ["A", "B", "C", "D", "E"] as const;

type ReviewInitial = {
  id: string;
  stemHtml?: string | null;
  explanationHtml?: string | null;
  answerKey?: string | null;
  difficulty?: string | null;
  options?: Record<string, string>;
};

export function ReviewQuestionForm({
  action,
  formId,
  initial
}: {
  action: (formData: FormData) => Promise<void>;
  formId?: string;
  initial: ReviewInitial;
}) {
  const [stem, setStem] = useState(initial.stemHtml ?? "<p></p>");
  const [explanation, setExplanation] = useState(initial.explanationHtml ?? "<p></p>");
  const [validatorNotes, setValidatorNotes] = useState("<p>Catatan hasil validasi.</p>");
  const [options, setOptions] = useState<Record<string, string>>({
    A: initial.options?.A ?? "<p></p>",
    B: initial.options?.B ?? "<p></p>",
    C: initial.options?.C ?? "<p></p>",
    D: initial.options?.D ?? "<p></p>",
    E: initial.options?.E ?? "<p></p>"
  });

  return (
    <form id={formId} action={action} className="inline-edit-form form-grid review-form-wide">
      <input type="hidden" name="id" value={initial.id} />
      <input type="hidden" name="stem" value={stem} />
      <input type="hidden" name="explanation" value={explanation} />
      <input type="hidden" name="validatorNotes" value={validatorNotes} />
      {optionLabels.map((label) => <input key={label} type="hidden" name={`option${label}`} value={options[label]} />)}

      <RichTextEditor label="Perbaikan soal" value={stem} onChange={setStem} minHeight={170} required />
      <div className="option-form-grid">
        {optionLabels.map((label) => (
          <RichTextEditor key={label} label={`Jawaban ${label}`} value={options[label]} onChange={(html) => setOptions((current) => ({ ...current, [label]: html }))} minHeight={80} required />
        ))}
      </div>
      <div className="two-columns">
        <label className="field-block"><span className="field-label">Kunci jawaban</span><select className="select-input" name="answerKey" defaultValue={initial.answerKey ?? "A"}>{optionLabels.map((label) => <option key={label}>{label}</option>)}</select></label>
        <label className="field-block"><span className="field-label">Kesulitan</span><select className="select-input" name="difficulty" defaultValue={initial.difficulty ?? "MEDIUM"}><option value="EASY">Mudah</option><option value="MEDIUM">Sedang</option><option value="HARD">Sulit</option></select></label>
      </div>
      <RichTextEditor label="Pembahasan / jawaban" value={explanation} onChange={setExplanation} />
      <RichTextEditor label="Catatan validator" value={validatorNotes} onChange={setValidatorNotes} minHeight={120} />
    </form>
  );
}
