import { AdminShell } from "@/components/admin-shell";
import { requirePageUser } from "@/lib/auth";
import { db } from "@seleksi/database";
import {
  CheckCircle2,
  FileDown,
  FileSpreadsheet,
  FileText,
  ListChecks,
  ListFilter,
  Shuffle,
} from "lucide-react";

export const dynamic = "force-dynamic";

function number(value: number) {
  return value.toLocaleString("id-ID");
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function htmlToText(html: string | null | undefined) {
  return decodeEntities(html ?? "")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n")
    .replace(/<\s*\/div\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

type ExportStimulusStat = {
  value: string;
  label: string;
  description: string;
  questionCount: number;
  blueprintCount: number;
  sortKey: string;
};

function buildExportStimulusStats(
  rows: Array<{
    blueprint: { code: string };
    stimulusId: string | null;
    stimulus: {
      id: string;
      code: string;
      language: string;
      currentVersion: { titleHtml: string } | null;
    } | null;
    currentVersion: { orderInStimulus: number | null } | null;
  }>,
): ExportStimulusStat[] {
  const independentOrders = new Map<number, { questionCount: number; blueprints: Set<string> }>();
  const stimulusGroups = new Map<
    string,
    {
      code: string;
      language: string;
      title: string;
      questionCount: number;
      blueprints: Set<string>;
    }
  >();

  for (const row of rows) {
    if (row.stimulusId && row.stimulus) {
      const current = stimulusGroups.get(row.stimulusId) ?? {
        code: row.stimulus.code,
        language: row.stimulus.language,
        title: htmlToText(row.stimulus.currentVersion?.titleHtml),
        questionCount: 0,
        blueprints: new Set<string>(),
      };
      current.questionCount += 1;
      current.blueprints.add(row.blueprint.code);
      stimulusGroups.set(row.stimulusId, current);
      continue;
    }

    const order = row.currentVersion?.orderInStimulus;
    if (!order || order < 1) continue;

    const current = independentOrders.get(order) ?? { questionCount: 0, blueprints: new Set<string>() };
    current.questionCount += 1;
    current.blueprints.add(row.blueprint.code);
    independentOrders.set(order, current);
  }

  const orderOptions: ExportStimulusStat[] = Array.from(independentOrders.entries()).map(([order, stat]) => ({
    value: `ORDER:${order}`,
    label: `Urutan stimulus ${order} — soal independen`,
    description: `${number(stat.questionCount)} soal dari ${number(stat.blueprints.size)} kisi-kisi`,
    questionCount: stat.questionCount,
    blueprintCount: stat.blueprints.size,
    sortKey: `A-${String(order).padStart(5, "0")}`,
  }));

  const groupOptions: ExportStimulusStat[] = Array.from(stimulusGroups.entries()).map(([stimulusId, stat]) => {
    const isEnglish = stat.language.toLowerCase().startsWith("en") || /bahasa\s+inggris|english/i.test(stat.title);
    const title = stat.title ? ` — ${stat.title}` : "";
    return {
      value: `GROUP:${stimulusId}`,
      label: `${isEnglish ? "Kelompok Bahasa Inggris" : "Kelompok stimulus"} ${stat.code}${title}`,
      description: `${number(stat.questionCount)} soal dari ${number(stat.blueprints.size)} kisi-kisi`,
      questionCount: stat.questionCount,
      blueprintCount: stat.blueprints.size,
      sortKey: `B-${stat.code}`,
    };
  });

  return [...orderOptions, ...groupOptions].sort((left, right) => left.sortKey.localeCompare(right.sortKey, "id-ID"));
}

export default async function QuestionExportsPage() {
  await requirePageUser(["EXAM_ADMIN", "SUPER_ADMIN"]);

  const [totalQuestions, approvedQuestions, totalBlueprints, stimulusRows, blueprints] = await Promise.all([
    db.question.count({ where: { currentVersionId: { not: null } } }),
    db.question.count({ where: { currentVersionId: { not: null }, status: "APPROVED" } }),
    db.blueprint.count({ where: { currentVersionId: { not: null } } }),
    db.question.findMany({
      where: { currentVersionId: { not: null } },
      select: {
        stimulusId: true,
        blueprint: { select: { code: true } },
        stimulus: {
          select: {
            id: true,
            code: true,
            language: true,
            currentVersion: { select: { titleHtml: true } },
          },
        },
        currentVersion: { select: { orderInStimulus: true } },
      },
    }),
    db.blueprint.findMany({
      where: { currentVersionId: { not: null } },
      orderBy: { code: "asc" },
      select: {
        id: true,
        code: true,
        currentVersion: {
          select: {
            titleHtml: true,
            testGroupHtml: true,
            indicatorHtml: true,
            questionMode: true,
          },
        },
      },
    }),
  ]);

  const unvalidatedQuestions = Math.max(totalQuestions - approvedQuestions, 0);
  const stimulusStats = buildExportStimulusStats(stimulusRows);

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
            Pilih status validasi, pola pengambilan soal, filter urutan stimulus/kelompok bacaan, kisi-kisi tertentu, lalu unduh ke Excel atau PDF.
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
              Excel selalu dibuat lengkap dengan kode soal, HTML soal, opsi, kunci, pembahasan, kisi-kisi, teks bacaan/stimulus, dan sheet format template.
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
            <span className="field-label">Filter stimulus / kelompok bacaan</span>
            <select className="select-input" name="stimulusFilter" defaultValue="ALL">
              <option value="ALL">Semua soal: independen dan seluruh kelompok stimulus</option>
              {stimulusStats.map((stat) => (
                <option key={stat.value} value={stat.value}>
                  {stat.label} ({stat.description})
                </option>
              ))}
            </select>
            <small className="muted-text">
              Untuk soal independen, pilihan diambil dari kolom urutan_stimulus. Untuk soal kelompok seperti Bahasa Inggris, pilihan diambil per kelompok stimulus/bacaan sehingga satu kelompok bacaan dapat diexport tersendiri.
            </small>
          </label>

          <section className="card soft-card form-grid">
            <div>
              <strong>Pengaturan khusus PDF</strong>
              <p className="muted-text">
                Pilihan ini hanya memengaruhi PDF. Excel tetap mengekspor data lengkap dalam sel HTML dan versi teks.
              </p>
            </div>
            <div className="two-columns">
              <input type="hidden" name="includeAnswer" value="0" />
              <label className="check-row"><input type="checkbox" name="includeAnswer" value="1" defaultChecked /> Sertakan kunci jawaban</label>

              <input type="hidden" name="includeBlueprint" value="0" />
              <label className="check-row"><input type="checkbox" name="includeBlueprint" value="1" defaultChecked /> Sertakan informasi kisi-kisi</label>

              <input type="hidden" name="includeStimulus" value="0" />
              <label className="check-row"><input type="checkbox" name="includeStimulus" value="1" defaultChecked /> Sertakan teks bacaan/stimulus dan gambar</label>

              <label className="check-row"><input type="checkbox" name="includeExplanation" value="1" /> Sertakan pembahasan</label>
            </div>
          </section>

          <details className="card soft-card form-grid">
            <summary className="panel-heading" style={{ cursor: "pointer" }}>
              <div>
                <h3><ListChecks size={18} /> Export berdasarkan kisi-kisi yang dipilih</h3>
                <p className="muted-text">
                  Klik untuk hide/unhide. Bila tidak ada kisi-kisi yang dicentang, sistem otomatis mengekspor semua kisi-kisi yang lolos filter di atas.
                </p>
              </div>
            </summary>
            <div className="form-grid" style={{ maxHeight: 360, overflow: "auto", paddingTop: 12 }}>
              {blueprints.map((blueprint) => {
                const version = blueprint.currentVersion;
                const title = htmlToText(version?.titleHtml) || htmlToText(version?.indicatorHtml) || "Tanpa judul";
                const group = htmlToText(version?.testGroupHtml);
                return (
                  <label key={blueprint.id} className="check-row" style={{ alignItems: "flex-start" }}>
                    <input type="checkbox" name="blueprintCode" value={blueprint.code} />
                    <span>
                      <strong>{blueprint.code}</strong> — {title}
                      <small className="muted-text" style={{ display: "block" }}>
                        {group ? `${group} · ` : ""}{version?.questionMode ?? ""}
                      </small>
                    </span>
                  </label>
                );
              })}
            </div>
          </details>

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
                <small>Berisi sheet Ringkasan, Data Soal HTML, Versi Teks, dan Format Template dengan kolom kode_kisi, kode_soal, urutan_stimulus, soal, opsi_a sampai pembahasan.</small>
              </div>
            </div>
          </section>
          <section className="package-field-summary">
            <div>
              <span className="package-field-number">2</span>
              <div>
                <strong>PDF</strong>
                <small>Berisi naskah soal rapi, gambar dari stimulus/soal/opsi, kunci jawaban, kisi-kisi, dan pembahasan sesuai pilihan.</small>
              </div>
            </div>
          </section>
          <section className="package-field-summary">
            <div>
              <span className="package-field-number">3</span>
              <div>
                <strong>Filter stimulus</strong>
                <small>Soal independen memakai urutan_stimulus; soal kelompok memakai pilihan kelompok stimulus/bacaan, termasuk kelompok Bahasa Inggris.</small>
              </div>
            </div>
          </section>
        </div>
      </section>
    </AdminShell>
  );
}
