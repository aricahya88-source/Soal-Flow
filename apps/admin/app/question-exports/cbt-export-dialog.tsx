"use client";

import { useMemo, useState } from "react";
import { ChevronDown, FileSpreadsheet, ListChecks, X } from "lucide-react";

type BlueprintOption = {
  id: string;
  code: string;
  title: string;
  group: string;
  mode: string;
  allCount: number;
  approvedCount: number;
  unvalidatedCount: number;
};

type CbtPackageKey = "DASAR_PENALARAN" | "LITERASI_BIDANG" | "LITERASI_KEISLAMAN" | "LITERASI_BAHASA";

const CBT_PACKAGES = [
  {
    value: "DASAR_PENALARAN",
    label: "Dasar Penalaran",
    codePatterns: [/^2026CBT-DP/i, /(?:^|[-_])DP\d/i],
    textPatterns: [/dasar\s+penalaran/i],
  },
  {
    value: "LITERASI_BIDANG",
    label: "Literasi Bidang",
    codePatterns: [/^2026CBT-LB/i, /LBSains/i, /LBSos/i, /(?:^|[-_])LB\d/i],
    textPatterns: [/literasi\s+bidang/i, /literasi\s+bidang\s+sains/i, /literasi\s+sosial/i],
  },
  {
    value: "LITERASI_KEISLAMAN",
    label: "Literasi Dasar Pengetahuan Keislaman",
    codePatterns: [/^2026CBT-LI/i, /(?:^|[-_])LI\d/i],
    textPatterns: [/literasi\s+dasar\s+pengetahuan\s+keislaman/i, /pengetahuan\s+keislaman/i],
  },
  {
    value: "LITERASI_BAHASA",
    label: "Literasi Bahasa",
    codePatterns: [/^2026CBT-BI/i, /^2026CBT-BA/i, /(?:^|[-_])BI[A-Z]*/i, /(?:^|[-_])BA[A-Z]*/i, /bahasa/i],
    textPatterns: [/literasi\s+bahasa/i, /bahasa\s+inggris/i, /bahasa\s+arab/i, /structure/i],
  },
] as const satisfies Array<{
  value: CbtPackageKey;
  label: string;
  codePatterns: RegExp[];
  textPatterns: RegExp[];
}>;

type SelectedByPackage = Record<CbtPackageKey, string[]>;

type Props = {
  blueprints: BlueprintOption[];
};

function number(value: number) {
  return value.toLocaleString("id-ID");
}

function emptySelection(): SelectedByPackage {
  return {
    DASAR_PENALARAN: [],
    LITERASI_BIDANG: [],
    LITERASI_KEISLAMAN: [],
    LITERASI_BAHASA: [],
  };
}

function blueprintSearchText(blueprint: BlueprintOption) {
  return [blueprint.code, blueprint.title, blueprint.group, blueprint.mode]
    .filter(Boolean)
    .join(" ");
}

function matchesPackage(blueprint: BlueprintOption, packageKey: CbtPackageKey) {
  const config = CBT_PACKAGES.find((item) => item.value === packageKey);
  if (!config) return false;
  const text = blueprintSearchText(blueprint);
  return config.codePatterns.some((pattern) => pattern.test(blueprint.code))
    || config.textPatterns.some((pattern) => pattern.test(text));
}

function buildPackageBlueprints(blueprints: BlueprintOption[]) {
  return Object.fromEntries(
    CBT_PACKAGES.map((item) => [
      item.value,
      blueprints.filter((blueprint) => matchesPackage(blueprint, item.value)),
    ]),
  ) as Record<CbtPackageKey, BlueprintOption[]>;
}

function buildDefaultSelection(blueprints: BlueprintOption[]) {
  const result = emptySelection();
  const assigned = new Set<string>();

  for (const item of CBT_PACKAGES) {
    for (const blueprint of blueprints) {
      if (assigned.has(blueprint.code)) continue;
      if (!matchesPackage(blueprint, item.value)) continue;
      result[item.value].push(blueprint.code);
      assigned.add(blueprint.code);
    }
  }

  return result;
}

function selectedPackageLabel(selectedByPackage: SelectedByPackage, code: string) {
  const found = CBT_PACKAGES.find((item) => selectedByPackage[item.value].includes(code));
  return found?.label ?? "";
}

function totalSelected(selectedByPackage: SelectedByPackage) {
  return Object.values(selectedByPackage).reduce((sum, codes) => sum + codes.length, 0);
}

export function CbtExportDialog({ blueprints }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const packageBlueprints = useMemo(() => buildPackageBlueprints(blueprints), [blueprints]);
  const defaultSelection = useMemo(() => buildDefaultSelection(blueprints), [blueprints]);
  const [selectedByPackage, setSelectedByPackage] = useState<SelectedByPackage>(() => defaultSelection);
  const selectedCount = totalSelected(selectedByPackage);

  function resetToDefaultSelection() {
    setSelectedByPackage(defaultSelection);
  }

  function clearAll() {
    setSelectedByPackage(emptySelection());
  }

  function selectPackage(packageKey: CbtPackageKey) {
    setSelectedByPackage((current) => {
      const next = { ...current } as SelectedByPackage;
      const alreadySelected = new Set(Object.entries(current)
        .filter(([key]) => key !== packageKey)
        .flatMap(([, codes]) => codes));
      next[packageKey] = packageBlueprints[packageKey]
        .map((blueprint) => blueprint.code)
        .filter((code) => !alreadySelected.has(code));
      return next;
    });
  }

  function clearPackage(packageKey: CbtPackageKey) {
    setSelectedByPackage((current) => ({ ...current, [packageKey]: [] }));
  }

  function toggleBlueprint(packageKey: CbtPackageKey, code: string) {
    setSelectedByPackage((current) => {
      const owner = selectedPackageLabel(current, code);
      const ownCodes = current[packageKey];
      const isSelectedHere = ownCodes.includes(code);
      if (owner && !isSelectedHere) return current;

      return {
        ...current,
        [packageKey]: isSelectedHere
          ? ownCodes.filter((item) => item !== code)
          : [...ownCodes, code],
      };
    });
  }

  return (
    <>
      <button className="primary-button" type="button" onClick={() => setIsOpen(true)}>
        <FileSpreadsheet size={17} /> Export CBT
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cbt-export-title"
          style={{
            alignItems: "center",
            background: "rgba(7, 26, 23, .42)",
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            left: 0,
            padding: 20,
            position: "fixed",
            right: 0,
            top: 0,
            zIndex: 60,
          }}
        >
          <section className="card panel form-grid" style={{ maxHeight: "92vh", maxWidth: 860, overflow: "auto", width: "100%" }}>
            {CBT_PACKAGES.map((item) => (
              <input key={item.value} type="hidden" name="cbtPackage" value={item.value} />
            ))}
            <input type="hidden" name="cbtBlueprintSelection" value="1" />
            {CBT_PACKAGES.flatMap((item) => selectedByPackage[item.value].map((code) => (
              <input key={`${item.value}-${code}`} type="hidden" name={`cbtBlueprint_${item.value}`} value={code} />
            )))}

            <div className="panel-heading" style={{ alignItems: "flex-start", gap: 16 }}>
              <div>
                <h3 id="cbt-export-title" style={{ marginTop: 0 }}>Export CBT</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Isi nama file export, lalu buka paket untuk mengatur ceklis kode kisi-kisi. Sistem akan menghasilkan ZIP berisi 4 Excel: Dasar Penalaran, Literasi Bidang, Literasi Dasar Pengetahuan Keislaman, dan Literasi Bahasa.
                </p>
              </div>
              <button className="secondary-button compact-button" type="button" onClick={() => setIsOpen(false)} aria-label="Tutup export CBT">
                <X size={16} />
              </button>
            </div>

            <label className="field-block">
              <span className="field-label">Nama file export</span>
              <input
                className="text-input"
                name="exportFilename"
                placeholder="Contoh: CBT 2026"
              />
            </label>

            <section className="card soft-card form-grid">
              <div>
                <strong><ListChecks size={16} style={{ verticalAlign: "text-bottom" }} /> Ceklis kisi-kisi semua soal</strong>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Setiap paket default hide. Kode kisi-kisi yang sudah dicentang pada satu paket akan terkunci pada paket lain agar tidak masuk dua Excel sekaligus.
                </p>
                <p className="muted-text" style={{ marginBottom: 0, marginTop: 4 }}>
                  Terpilih: <strong>{number(selectedCount)}</strong> kisi-kisi.
                </p>
              </div>
              <div className="package-action-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
                <button className="secondary-button" type="button" onClick={resetToDefaultSelection}>
                  Ceklis otomatis
                </button>
                <button className="secondary-button" type="button" onClick={clearAll} disabled={!selectedCount}>
                  Kosongkan semua
                </button>
              </div>
            </section>

            <div className="form-grid">
              {CBT_PACKAGES.map((item) => {
                const blueprintsForPackage = packageBlueprints[item.value];
                const selectedForPackage = new Set(selectedByPackage[item.value]);
                return (
                  <details className="card soft-card" key={item.value}>
                    <summary style={{ alignItems: "center", cursor: "pointer", display: "flex", gap: 10, justifyContent: "space-between" }}>
                      <span>
                        <strong>{item.label}</strong>
                        <small className="muted-text" style={{ display: "block" }}>
                          {number(selectedForPackage.size)} terpilih dari {number(blueprintsForPackage.length)} kisi-kisi
                        </small>
                      </span>
                      <ChevronDown size={18} />
                    </summary>

                    <div className="form-grid" style={{ marginTop: 14 }}>
                      <div className="package-action-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
                        <button className="secondary-button compact-button" type="button" onClick={() => selectPackage(item.value)} disabled={!blueprintsForPackage.length}>
                          Pilih paket ini
                        </button>
                        <button className="secondary-button compact-button" type="button" onClick={() => clearPackage(item.value)} disabled={!selectedForPackage.size}>
                          Kosongkan paket ini
                        </button>
                      </div>

                      <div className="form-grid" style={{ maxHeight: 280, overflow: "auto", paddingRight: 6 }}>
                        {blueprintsForPackage.length ? blueprintsForPackage.map((blueprint) => {
                          const owner = selectedPackageLabel(selectedByPackage, blueprint.code);
                          const lockedByOtherPackage = Boolean(owner) && owner !== item.label;
                          return (
                            <label key={blueprint.id} className="check-row" style={{ alignItems: "flex-start", opacity: lockedByOtherPackage ? .58 : 1 }}>
                              <input
                                type="checkbox"
                                checked={selectedForPackage.has(blueprint.code)}
                                disabled={lockedByOtherPackage}
                                onChange={() => toggleBlueprint(item.value, blueprint.code)}
                              />
                              <span>
                                <strong>{blueprint.code}</strong> — {blueprint.title || "Tanpa judul"}
                                <small className="muted-text" style={{ display: "block" }}>
                                  {blueprint.group ? `${blueprint.group} · ` : ""}{blueprint.mode || "Mode soal belum diisi"} · {number(blueprint.approvedCount)} soal approved / {number(blueprint.allCount)} total
                                  {lockedByOtherPackage ? ` · sudah dipilih di ${owner}` : ""}
                                </small>
                              </span>
                            </label>
                          );
                        }) : (
                          <p className="muted-text">Belum ada kisi-kisi yang terdeteksi untuk paket ini.</p>
                        )}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>

            <div className="package-action-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
              <button className="secondary-button" type="button" onClick={() => setIsOpen(false)}>
                Batal
              </button>
              <button className="primary-button" type="submit" name="format" value="cbt">
                <FileSpreadsheet size={17} /> Export CBT
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
