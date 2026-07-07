"use client";

import { useState } from "react";
import { FileSpreadsheet, X } from "lucide-react";

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
          <section className="card panel form-grid" style={{ maxWidth: 560, width: "100%" }}>
            <div className="panel-heading" style={{ alignItems: "flex-start", gap: 16 }}>
              <div>
                <h3 id="cbt-export-title" style={{ marginTop: 0 }}>Export CBT</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Isi nama file export bila diperlukan. Jika dikosongkan, sistem membuat nama file otomatis.
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
                placeholder="Contoh: CBT TPA IPA Paket 16"
              />
            </label>

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
