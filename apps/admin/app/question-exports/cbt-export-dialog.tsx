"use client";

import { useState } from "react";
import { FileSpreadsheet, X } from "lucide-react";

const CBT_PACKAGES = [
  { value: "DASAR_PENALARAN", label: "Dasar Penalaran" },
  { value: "LITERASI_BIDANG", label: "Literasi Bidang" },
  { value: "LITERASI_KEISLAMAN", label: "Literasi Dasar Pengetahuan Keislaman" },
  { value: "LITERASI_BAHASA", label: "Literasi Bahasa" },
] as const;

export function CbtExportDialog() {
  const [isOpen, setIsOpen] = useState(false);

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
          <section className="card panel form-grid" style={{ maxWidth: 640, width: "100%" }}>
            <div className="panel-heading" style={{ alignItems: "flex-start", gap: 16 }}>
              <div>
                <h3 id="cbt-export-title" style={{ marginTop: 0 }}>Export CBT</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Isi nama file export, lalu pilih paket yang akan dibuat. Sistem akan menghasilkan file Excel terpisah untuk setiap paket yang dicentang.
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
                <strong>Pilih paket CBT</strong>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Centang satu atau beberapa paket. Hasil export akan diunduh dalam ZIP berisi file Excel sesuai paket yang dipilih.
                </p>
              </div>
              <div className="two-columns">
                {CBT_PACKAGES.map((item) => (
                  <label className="check-row" key={item.value}>
                    <input type="checkbox" name="cbtPackage" value={item.value} defaultChecked /> {item.label}
                  </label>
                ))}
              </div>
            </section>

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
