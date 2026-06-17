import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getCurrentUser } from "@/lib/auth";
import { canAccess } from "@/lib/access";
import { db } from "@seleksi/database";

export const dynamic = "force-dynamic";

type ExportFormat = "xlsx" | "pdf";
type ValidationFilter = "ALL" | "APPROVED" | "UNVALIDATED";
type SelectionMode = "ALL" | "RANDOM_PER_BLUEPRINT";
type StimulusOrderFilter = "ALL" | "1" | "2";

type ExportParams = {
  format: ExportFormat;
  validation: ValidationFilter;
  selection: SelectionMode;
  stimulusOrder: StimulusOrderFilter;
  includeAnswer: boolean;
  includeBlueprint: boolean;
  includeStimulus: boolean;
  includeExplanation: boolean;
};

type ExportQuestion = {
  id: string;
  code: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  blueprint: {
    id: string;
    code: string;
    currentVersion: {
      versionNumber: number;
      titleHtml: string;
      testGroupHtml: string | null;
      testTopicHtml: string | null;
      competencyHtml: string;
      indicatorHtml: string;
      materialHtml: string | null;
      gridHtml: string | null;
      cognitiveLevel: string | null;
      expectedQuestionCount: number;
      questionMode: string;
    } | null;
  };
  stimulus: {
    code: string;
    type: string;
    language: string;
    status: string;
    currentVersion: {
      titleHtml: string;
      instructionsHtml: string;
      contentHtml: string;
      source: string | null;
      copyrightNote: string | null;
    } | null;
  } | null;
  currentVersion: {
    versionNumber: number;
    orderInStimulus: number | null;
    stemHtml: string;
    explanationHtml: string | null;
    difficulty: string;
    answerKey: string;
    options: Array<{
      label: string;
      contentHtml: string;
      sortOrder: number;
    }>;
  } | null;
};

const validationLabels: Record<ValidationFilter, string> = {
  ALL: "Semua status soal",
  APPROVED: "Tervalidasi / APPROVED",
  UNVALIDATED: "Belum tervalidasi / selain APPROVED",
};

const selectionLabels: Record<SelectionMode, string> = {
  ALL: "Seluruh soal sesuai filter",
  RANDOM_PER_BLUEPRINT: "Random 1 soal pada setiap kisi-kisi",
};

const stimulusOrderLabels: Record<StimulusOrderFilter, string> = {
  ALL: "Semua soal",
  "1": "Soal urutan stimulus 1 saja",
  "2": "Soal urutan stimulus 2 saja",
};

function readParams(request: Request): ExportParams {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") === "pdf" ? "pdf" : "xlsx";
  const validationRaw = url.searchParams.get("validation") ?? "ALL";
  const selectionRaw = url.searchParams.get("selection") ?? "ALL";
  const stimulusOrderRaw = url.searchParams.get("stimulusOrder") ?? "ALL";

  return {
    format,
    validation:
      validationRaw === "APPROVED" || validationRaw === "UNVALIDATED"
        ? validationRaw
        : "ALL",
    selection: selectionRaw === "RANDOM_PER_BLUEPRINT" ? "RANDOM_PER_BLUEPRINT" : "ALL",
    stimulusOrder:
      stimulusOrderRaw === "1" || stimulusOrderRaw === "2" ? stimulusOrderRaw : "ALL",
    includeAnswer: url.searchParams.get("includeAnswer") !== "0",
    includeBlueprint: url.searchParams.get("includeBlueprint") !== "0",
    includeStimulus: url.searchParams.get("includeStimulus") !== "0",
    includeExplanation: url.searchParams.get("includeExplanation") === "1",
  };
}

function safeFilename(value: string) {
  return value
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
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
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function dateTime(value: Date | null | undefined) {
  return value?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) ?? "";
}

function optionMap(question: ExportQuestion) {
  return Object.fromEntries(
    (question.currentVersion?.options ?? [])
      .slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((option) => [option.label, option.contentHtml]),
  ) as Record<string, string | undefined>;
}

function buildWhere(params: ExportParams) {
  const where: any = { currentVersionId: { not: null } };

  if (params.validation === "APPROVED") {
    where.status = "APPROVED";
  } else if (params.validation === "UNVALIDATED") {
    where.status = { not: "APPROVED" };
  }

  if (params.stimulusOrder !== "ALL") {
    where.currentVersion = {
      is: { orderInStimulus: Number(params.stimulusOrder) },
    };
  }

  return where;
}

function selectRandomPerBlueprint(questions: ExportQuestion[]) {
  const groups = new Map<string, ExportQuestion[]>();
  for (const question of questions) {
    const current = groups.get(question.blueprint.id) ?? [];
    current.push(question);
    groups.set(question.blueprint.id, current);
  }

  return Array.from(groups.values()).map((group) => {
    const index = Math.floor(Math.random() * group.length);
    return group[index];
  });
}

function sortQuestions(questions: ExportQuestion[]) {
  return questions.slice().sort((left, right) => {
    const blueprint = left.blueprint.code.localeCompare(right.blueprint.code, "id-ID");
    if (blueprint !== 0) return blueprint;
    const leftOrder = left.currentVersion?.orderInStimulus ?? 9999;
    const rightOrder = right.currentVersion?.orderInStimulus ?? 9999;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return left.code.localeCompare(right.code, "id-ID");
  });
}

async function loadQuestions(params: ExportParams): Promise<ExportQuestion[]> {
  const questions = await db.question.findMany({
    where: buildWhere(params),
    orderBy: [{ blueprint: { code: "asc" } }, { code: "asc" }],
    include: {
      blueprint: { include: { currentVersion: true } },
      stimulus: { include: { currentVersion: true } },
      currentVersion: { include: { options: { orderBy: { sortOrder: "asc" } } } },
    },
  });

  const selected =
    params.selection === "RANDOM_PER_BLUEPRINT"
      ? selectRandomPerBlueprint(questions as ExportQuestion[])
      : (questions as ExportQuestion[]);

  return sortQuestions(selected);
}

function buildSummaryRows(params: ExportParams, questions: ExportQuestion[]) {
  return [
    ["SOALFLOW — EXPORT SOAL"],
    [],
    ["Tanggal export", dateTime(new Date())],
    ["Status validasi", validationLabels[params.validation]],
    ["Mode export", selectionLabels[params.selection]],
    ["Filter stimulus", stimulusOrderLabels[params.stimulusOrder]],
    ["Jumlah soal", questions.length],
    ["Jumlah kisi-kisi", new Set(questions.map((question) => question.blueprint.code)).size],
    [],
    [
      "Catatan Excel",
      "Kolom stem, pilihan jawaban, pembahasan, kisi-kisi, dan stimulus disimpan dalam bentuk HTML agar konten rich text tetap lengkap.",
    ],
  ];
}

function setWidths(sheet: XLSX.WorkSheet, widths: number[]) {
  sheet["!cols"] = widths.map((wch) => ({ wch }));
}

function buildWorkbook(params: ExportParams, questions: ExportQuestion[]) {
  const workbook = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.aoa_to_sheet(buildSummaryRows(params, questions));
  setWidths(summarySheet, [28, 100]);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

  const rows = questions.map((question, index) => {
    const version = question.currentVersion;
    const blueprintVersion = question.blueprint.currentVersion;
    const stimulusVersion = question.stimulus?.currentVersion;
    const options = optionMap(question);
    const stimulusLanguage = question.stimulus?.language ?? "";
    const isEnglishStimulus = stimulusLanguage.toLowerCase().startsWith("en");

    return {
      No: index + 1,
      "Kode soal": question.code,
      "Status soal": question.status,
      "Versi soal": version?.versionNumber ?? "",
      "Kode kisi-kisi": question.blueprint.code,
      "Judul kisi-kisi HTML": blueprintVersion?.titleHtml ?? "",
      "Kelompok tes HTML": blueprintVersion?.testGroupHtml ?? "",
      "Topik tes HTML": blueprintVersion?.testTopicHtml ?? "",
      "Kompetensi HTML": blueprintVersion?.competencyHtml ?? "",
      "Indikator HTML": blueprintVersion?.indicatorHtml ?? "",
      "Materi HTML": blueprintVersion?.materialHtml ?? "",
      "Grid HTML": blueprintVersion?.gridHtml ?? "",
      "Level kognitif": blueprintVersion?.cognitiveLevel ?? "",
      "Target jumlah soal": blueprintVersion?.expectedQuestionCount ?? "",
      "Mode soal": blueprintVersion?.questionMode ?? "",
      "Nomor dalam stimulus": version?.orderInStimulus ?? "",
      "Kode stimulus": question.stimulus?.code ?? "",
      "Status stimulus": question.stimulus?.status ?? "",
      "Jenis stimulus": question.stimulus?.type ?? "",
      "Bahasa stimulus": stimulusLanguage,
      "Judul stimulus HTML": stimulusVersion?.titleHtml ?? "",
      "Instruksi stimulus HTML": stimulusVersion?.instructionsHtml ?? "",
      "Teks bacaan / stimulus HTML": stimulusVersion?.contentHtml ?? "",
      "Teks bacaan bahasa Inggris HTML": isEnglishStimulus ? stimulusVersion?.contentHtml ?? "" : "",
      "Sumber stimulus": stimulusVersion?.source ?? "",
      "Catatan hak cipta stimulus": stimulusVersion?.copyrightNote ?? "",
      "Stem / soal HTML": version?.stemHtml ?? "",
      "Pilihan A HTML": options.A ?? "",
      "Pilihan B HTML": options.B ?? "",
      "Pilihan C HTML": options.C ?? "",
      "Pilihan D HTML": options.D ?? "",
      "Pilihan E HTML": options.E ?? "",
      "Kunci jawaban": version?.answerKey ?? "",
      "Tingkat kesulitan": version?.difficulty ?? "",
      "Pembahasan HTML": version?.explanationHtml ?? "",
      "Dibuat pada": dateTime(question.createdAt),
      "Diubah pada": dateTime(question.updatedAt),
    };
  });

  const questionSheet = XLSX.utils.json_to_sheet(rows);
  setWidths(questionSheet, [6, 18, 20, 12, 18, 34, 28, 28, 48, 48, 34, 34, 18, 18, 18, 18, 18, 18, 18, 18, 34, 42, 70, 70, 34, 34, 70, 60, 60, 60, 60, 60, 14, 18, 70, 22, 22]);
  XLSX.utils.book_append_sheet(workbook, questionSheet, "Data Soal HTML");

  const readableRows = questions.map((question, index) => {
    const version = question.currentVersion;
    const blueprintVersion = question.blueprint.currentVersion;
    const stimulusVersion = question.stimulus?.currentVersion;
    const options = optionMap(question);
    return {
      No: index + 1,
      "Kode soal": question.code,
      Status: question.status,
      "Kode kisi-kisi": question.blueprint.code,
      "Judul kisi-kisi": htmlToText(blueprintVersion?.titleHtml),
      "Mode soal": blueprintVersion?.questionMode ?? "",
      "Nomor stimulus": version?.orderInStimulus ?? "",
      "Kode stimulus": question.stimulus?.code ?? "",
      "Teks bacaan": htmlToText(stimulusVersion?.contentHtml),
      Soal: htmlToText(version?.stemHtml),
      A: htmlToText(options.A),
      B: htmlToText(options.B),
      C: htmlToText(options.C),
      D: htmlToText(options.D),
      E: htmlToText(options.E),
      Kunci: version?.answerKey ?? "",
      Kesulitan: version?.difficulty ?? "",
      Pembahasan: htmlToText(version?.explanationHtml),
    };
  });
  const readableSheet = XLSX.utils.json_to_sheet(readableRows);
  setWidths(readableSheet, [6, 18, 18, 18, 34, 18, 14, 18, 70, 70, 42, 42, 42, 42, 42, 10, 15, 70]);
  XLSX.utils.book_append_sheet(workbook, readableSheet, "Versi Teks");

  return workbook;
}

function toPdfSafe(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function escapePdfText(value: string) {
  return toPdfSafe(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapLine(text: string, maxChars: number) {
  const words = toPdfSafe(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

class SimplePdf {
  private readonly pageWidth = 595;
  private readonly pageHeight = 842;
  private readonly margin = 42;
  private y = 800;
  private pages: string[][] = [[]];

  private currentPage() {
    return this.pages[this.pages.length - 1];
  }

  private newPage() {
    this.pages.push([]);
    this.y = 800;
  }

  private ensureSpace(lines = 1, size = 10) {
    const needed = lines * (size + 4);
    if (this.y - needed < this.margin) this.newPage();
  }

  line(text: string, size = 10, font = "F1") {
    const maxChars = Math.max(35, Math.floor((this.pageWidth - this.margin * 2) / (size * 0.53)));
    const sourceLines = String(text || "").split("\n");
    for (const sourceLine of sourceLines) {
      const wrapped = wrapLine(sourceLine, maxChars);
      for (const line of wrapped) {
        this.ensureSpace(1, size);
        this.currentPage().push(`BT /${font} ${size} Tf ${this.margin} ${this.y} Td (${escapePdfText(line)}) Tj ET`);
        this.y -= size + 4;
      }
    }
  }

  gap(points = 6) {
    if (this.y - points < this.margin) this.newPage();
    this.y -= points;
  }

  heading(text: string, size = 13) {
    this.ensureSpace(2, size);
    this.line(text, size, "F2");
    this.gap(2);
  }

  build() {
    const objects: string[] = [];
    const addObject = (content: string) => {
      objects.push(content);
      return objects.length;
    };

    const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
    const pagesId = addObject("__PAGES__");
    const fontId = 3 + this.pages.length * 2;
    const boldFontId = fontId + 1;
    const pageIds: number[] = [];

    this.pages.forEach((commands) => {
      const pageId = objects.length + 1;
      const contentId = objects.length + 2;
      pageIds.push(pageId);
      addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${this.pageWidth} ${this.pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
      const stream = commands.join("\n");
      addObject(`<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`);
    });

    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
    addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets[index + 1] = Buffer.byteLength(pdf, "latin1");
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = Buffer.byteLength(pdf, "latin1");
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let index = 1; index <= objects.length; index += 1) {
      pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return Buffer.from(pdf, "latin1");
  }
}

function buildPdf(params: ExportParams, questions: ExportQuestion[]) {
  const pdf = new SimplePdf();
  pdf.heading("SOALFLOW - EXPORT SOAL", 16);
  pdf.line(`Tanggal export: ${dateTime(new Date())}`, 10);
  pdf.line(`Status validasi: ${validationLabels[params.validation]}`, 10);
  pdf.line(`Mode export: ${selectionLabels[params.selection]}`, 10);
  pdf.line(`Filter stimulus: ${stimulusOrderLabels[params.stimulusOrder]}`, 10);
  pdf.line(`Jumlah soal: ${questions.length}`, 10);
  pdf.gap(10);

  if (!questions.length) {
    pdf.line("Tidak ada soal yang sesuai dengan pengaturan export.", 11);
    return pdf.build();
  }

  questions.forEach((question, index) => {
    const version = question.currentVersion;
    const blueprintVersion = question.blueprint.currentVersion;
    const stimulusVersion = question.stimulus?.currentVersion;
    const options = optionMap(question);

    pdf.heading(`${index + 1}. ${question.code} (${question.status})`, 12);
    if (params.includeBlueprint) {
      pdf.line(`Kisi-kisi: ${question.blueprint.code} - ${htmlToText(blueprintVersion?.titleHtml)}`, 10);
      pdf.line(`Kompetensi: ${htmlToText(blueprintVersion?.competencyHtml)}`, 10);
      pdf.line(`Indikator: ${htmlToText(blueprintVersion?.indicatorHtml)}`, 10);
      if (blueprintVersion?.cognitiveLevel) pdf.line(`Level kognitif: ${blueprintVersion.cognitiveLevel}`, 10);
    }

    if (params.includeStimulus && stimulusVersion?.contentHtml) {
      pdf.line(`Stimulus: ${question.stimulus?.code ?? "-"} ${version?.orderInStimulus ? `(nomor ${version.orderInStimulus})` : ""}`, 10, "F2");
      pdf.line(htmlToText(stimulusVersion.titleHtml), 10);
      pdf.line(htmlToText(stimulusVersion.contentHtml), 10);
    }

    pdf.line(`Soal: ${htmlToText(version?.stemHtml)}`, 10, "F2");
    for (const label of ["A", "B", "C", "D", "E"]) {
      pdf.line(`${label}. ${htmlToText(options[label])}`, 10);
    }

    if (params.includeAnswer) {
      pdf.line(`Kunci jawaban: ${version?.answerKey ?? "-"}`, 10, "F2");
    }
    if (params.includeExplanation && version?.explanationHtml) {
      pdf.line(`Pembahasan: ${htmlToText(version.explanationHtml)}`, 10);
    }
    pdf.gap(8);
  });

  return pdf.build();
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!canAccess(user.roles, ["EXAM_ADMIN", "SUPER_ADMIN"])) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const params = readParams(request);
  const questions = await loadQuestions(params);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "");
  const baseFilename = safeFilename(`export-soal-${params.validation}-${params.selection}-${params.stimulusOrder}-${timestamp}`);

  if (params.format === "pdf") {
    const buffer = buildPdf(params, questions);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseFilename}.pdf"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  }

  const workbook = buildWorkbook(params, questions);
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${baseFilename}.xlsx"`,
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}
