import { AdminShell } from "@/components/admin-shell";
import { requirePageUser } from "@/lib/auth";
import { db } from "@seleksi/database";
import {
  CheckCircle2,
  FileDown,
  FileSpreadsheet,
  FileText,
  ListFilter,
  Shuffle,
} from "lucide-react";

export const dynamic = "force-dynamic";

function number(value: number) {
  return value.toLocaleString("id-ID");
}

export default async function QuestionExportsPage() {
  await requirePageUser(["EXAM_ADMIN", "SUPER_ADMIN"]);

  const [totalQuestions, approvedQuestions, totalBlueprints, stimulusOneQuestions, stimulusTwoQuestions] = await Promise.all([
    db.question.count({ where: { currentVersionId: { not: null } } }),
    db.question.count({ where: { currentVersionId: { not: null }, status: "APPROVED" } }),
    db.blueprint.count({ where: { currentVersionId: { not: null } } }),
    db.question.count({
      where: {
        currentVersionId: { not: null },
        currentVersion: { is: { orderInStimulus: 1 } },
      },
    }),
    db.question.count({
      where: {
        currentVersionId: { not: null },
        currentVersion: { is: { orderInStimulus: 2 } },
      },
    }),
  ]);

  const unvalidatedQuestions = Math.max(totalQuestions - approvedQuestions, 0);

  return (
    <AdminShell
      title="Export Soal"
      subtitle="Export bank soal ke Excel berisi HTML atau PDF siap baca"
      allowedRoles={["EXAM_ADMIN", "SUPER_ADMIN"]}
    >
      <div className="page-header">
        <div>
          <h2>Pengaturan export bank soal</h2>
          <p>
            Pilih status validasi, pola pengambilan soal, filter urutan stimulus, lalu unduh dalam format Excel atau PDF.
          </p>
        </div>
        <span className="badge">Export Soal</span>
      </div>

      <section className="analysis-summary-grid">
        <article className="card analysis-summary-card">
          <FileText size={22} />
          <div><span>Total soal aktif</span><strong>{number(totalQuestions)}</strong></div>
        </article>
        <article className="card analysis-summary-card">
          <CheckCircle2 size={22} />
          <div><span>Soal tervalidasi</span><strong>{number(approvedQuestions)}</strong></div>
        </article>
        <article className="card analysis-summary-card">
          <ListFilter size={22} />
          <div><span>Belum tervalidasi</span><strong>{number(unvalidatedQuestions)}</strong></div>
        </article>
        <article className="card analysis-summary-card">
          <Shuffle size={22} />
          <div><span>Kisi-kisi aktif</span><strong>{number(totalBlueprints)}</strong></div>
        </article>
      </section>

      <section className="card panel form-grid">
        <div className="panel-heading">
          <div>
            <h3><FileDown size={19} /> Form export soal</h3>
            <p className="muted-text">
              Excel selalu dibuat lengkap dengan kode soal, HTML soal, opsi, kunci, pembahasan, kisi-kisi, serta teks bacaan/stimulus bila tersedia.
            </p>
          </div>
        </div>

        <form method="get" action="/api/question-exports" className="form-grid">
          <div className="two-columns">
            <label className="field-block">
              <span className="field-label">Status soal</span>
              <select className="select-input" name="validation" defaultValue="APPROVED">
                <option value="ALL">Semua soal</option>
                <option value="APPROVED">Soal tervalidasi / APPROVED</option>
                <option value="UNVALIDATED">Soal belum tervalidasi / selain APPROVED</option>
              </select>
            </label>
            <label className="field-block">
              <span className="field-label">Pola export</span>
              <select className="select-input" name="selection" defaultValue="ALL">
                <option value="ALL">Seluruh soal sesuai filter</option>
                <option value="RANDOM_PER_BLUEPRINT">Random 1 soal pada setiap kisi-kisi</option>
              </select>
            </label>
          </div>

          <label className="field-block">
            <span className="field-label">Filter stimulus</span>
            <select className="select-input" name="stimulusOrder" defaultValue="ALL">
              <option value="ALL">Semua soal, termasuk independent dan stimulus</option>
              <option value="1">Soal urutan stimulus 1 saja ({number(stimulusOneQuestions)} soal)</option>
              <option value="2">Soal urutan stimulus 2 saja ({number(stimulusTwoQuestions)} soal)</option>
            </select>
          </label>

          <section className="card soft-card form-grid">
            <div>
              <strong>Pengaturan khusus PDF</strong>
              <p className="muted-text">
                Pilihan ini hanya memengaruhi PDF. Excel tetap mengekspor data lengkap dalam sel HTML dan versi teks.
              </p>
            </div>
            <div className="two-columns">
              <label className="check-row"><input type="checkbox" name="includeAnswer" value="1" defaultChecked /> Sertakan kunci jawaban</label>
              <label className="check-row"><input type="checkbox" name="includeBlueprint" value="1" defaultChecked /> Sertakan informasi kisi-kisi</label>
              <label className="check-row"><input type="checkbox" name="includeStimulus" value="1" defaultChecked /> Sertakan teks bacaan/stimulus</label>
              <label className="check-row"><input type="checkbox" name="includeExplanation" value="1" /> Sertakan pembahasan</label>
            </div>
            <input type="hidden" name="includeAnswer" value="0" />
            <input type="hidden" name="includeBlueprint" value="0" />
            <input type="hidden" name="includeStimulus" value="0" />
          </section>

          <div className="package-action-grid">
            <button className="primary-button" type="submit" name="format" value="xlsx">
              <FileSpreadsheet size={17} /> Export Excel HTML
            </button>
            <button className="secondary-button" type="submit" name="format" value="pdf">
              <FileText size={17} /> Export PDF
            </button>
          </div>
        </form>
      </section>

      <section className="card panel">
        <div className="panel-heading">
          <h3>Catatan isi export</h3>
        </div>
        <div className="package-field-summary-list">
          <section className="package-field-summary">
            <div>
              <span className="package-field-number">1</span>
              <div>
                <strong>Excel</strong>
                <small>Berisi sheet Ringkasan, Data Soal HTML, dan Versi Teks.</small>
              </div>
            </div>
          </section>
          <section className="package-field-summary">
            <div>
              <span className="package-field-number">2</span>
              <div>
                <strong>PDF</strong>
                <small>Berisi naskah soal siap baca dengan opsi kunci jawaban, kisi-kisi, stimulus, dan pembahasan.</small>
              </div>
            </div>
          </section>
          <section className="package-field-summary">
            <div>
              <span className="package-field-number">3</span>
              <div>
                <strong>Random per kisi-kisi</strong>
                <small>Jika dipilih, sistem mengambil satu soal secara acak dari setiap kisi-kisi yang lolos filter.</small>
              </div>
            </div>
          </section>
        </div>
      </section>
    </AdminShell>
  );
}
