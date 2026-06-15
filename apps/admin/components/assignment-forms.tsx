"use client";

import { RichTextEditor } from "@seleksi/ui";
import { ClipboardCheck, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

type Option = { id: string; label: string; targetCount?: number };

type AssignmentInitial = {
  id?: string;
  blueprintId?: string;
  originalBlueprintId?: string;
  assignedToId?: string;
  originalAssignedToId?: string;
  targetCount?: number | null;
  noteHtml?: string | null;
  status?: string | null;
  dueAt?: string | null;
};

export function WritingAssignmentForm({
  action,
  blueprints,
  authors,
  initial,
  compact = false
}: {
  action: (formData: FormData) => Promise<void>;
  blueprints: Option[];
  authors: Option[];
  initial?: AssignmentInitial;
  compact?: boolean;
}) {
  const [note, setNote] = useState(initial?.noteHtml ?? "<p>Tulis seluruh slot soal sesuai kode kisi-kisi yang ditugaskan.</p>");
  const [blueprintId, setBlueprintId] = useState(initial?.blueprintId ?? blueprints[0]?.id ?? "");
  const selected = useMemo(() => blueprints.find((item) => item.id === blueprintId), [blueprints, blueprintId]);

  return (
    <form action={action} className={compact ? "inline-edit-form form-grid" : "card panel form-grid"}>
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {initial?.originalBlueprintId ? <input type="hidden" name="originalBlueprintId" value={initial.originalBlueprintId} /> : null}
      {initial?.originalAssignedToId ? <input type="hidden" name="originalAssignedToId" value={initial.originalAssignedToId} /> : null}
      <input type="hidden" name="note" value={note} />
      {!compact ? <div className="panel-heading"><h3><ClipboardCheck size={18} /> Plotting penulis soal</h3></div> : null}
      <label className="field-block"><span className="field-label">Kode kisi-kisi</span><select className="select-input" name="blueprintId" value={blueprintId} onChange={(event) => setBlueprintId(event.target.value)} required>{blueprints.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label className="field-block"><span className="field-label">Penulis soal</span><select className="select-input" name="assignedToId" defaultValue={initial?.assignedToId} required>{authors.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <div className="two-columns">
        <label className="field-block"><span className="field-label">Target slot soal</span><input className="text-input" value={selected?.targetCount ?? initial?.targetCount ?? 1} disabled readOnly /><span className="field-help">Mengikuti jumlah soal pada kisi-kisi.</span></label>
        <label className="field-block"><span className="field-label">Batas waktu</span><input className="text-input" name="dueAt" type="date" defaultValue={initial?.dueAt ?? undefined} /></label>
      </div>
      {compact ? <label className="field-block"><span className="field-label">Status</span><select className="select-input" name="status" defaultValue={initial?.status ?? "ASSIGNED"}><option value="ASSIGNED">Ditugaskan</option><option value="IN_PROGRESS">Dikerjakan</option><option value="COMPLETED">Selesai</option><option value="CANCELLED">Dibatalkan</option></select></label> : null}
      <RichTextEditor label="Catatan tugas" value={note} onChange={setNote} />
      <button className="primary-button" type="submit">Simpan plotting penulis</button>
    </form>
  );
}

export function ValidationAssignmentForm({
  action,
  blueprints,
  validators,
  initial,
  compact = false
}: {
  action: (formData: FormData) => Promise<void>;
  blueprints: Option[];
  validators: Option[];
  initial?: AssignmentInitial;
  compact?: boolean;
}) {
  const [note, setNote] = useState(initial?.noteHtml ?? "<p>Validasi seluruh soal pada kode kisi-kisi ini: redaksi, opsi, kunci jawaban, dan pembahasan.</p>");
  const [blueprintId, setBlueprintId] = useState(initial?.blueprintId ?? blueprints[0]?.id ?? "");
  const selected = useMemo(() => blueprints.find((item) => item.id === blueprintId), [blueprints, blueprintId]);

  return (
    <form action={action} className={compact ? "inline-edit-form form-grid" : "card panel form-grid"}>
      {initial?.originalBlueprintId ? <input type="hidden" name="originalBlueprintId" value={initial.originalBlueprintId} /> : null}
      {initial?.originalAssignedToId ? <input type="hidden" name="originalAssignedToId" value={initial.originalAssignedToId} /> : null}
      <input type="hidden" name="note" value={note} />
      {!compact ? <div className="panel-heading"><h3><ShieldCheck size={18} /> Plotting validator soal</h3></div> : null}
      <label className="field-block"><span className="field-label">Kode kisi-kisi yang divalidasi</span><select className="select-input" name="blueprintId" value={blueprintId} onChange={(event) => setBlueprintId(event.target.value)} required>{blueprints.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      {selected ? <div className="assignment-hint">Validator akan menerima seluruh <strong>{selected.targetCount ?? 1} slot soal</strong> pada kisi-kisi ini. Soal akan muncul di antrian validasi setelah penulis mengirimkannya.</div> : null}
      <label className="field-block"><span className="field-label">Validator soal</span><select className="select-input" name="assignedToId" defaultValue={initial?.assignedToId} required>{validators.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      {compact ? <label className="field-block"><span className="field-label">Status seluruh tugas</span><select className="select-input" name="status" defaultValue={initial?.status ?? "ASSIGNED"}><option value="ASSIGNED">Ditugaskan</option><option value="IN_REVIEW">Sedang direview</option><option value="DONE">Selesai</option><option value="CANCELLED">Dibatalkan</option></select></label> : null}
      <RichTextEditor label="Catatan validasi" value={note} onChange={setNote} />
      <button className="primary-button" type="submit">Simpan plotting validator</button>
    </form>
  );
}
