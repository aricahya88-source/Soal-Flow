"use client";

import { useState } from "react";
import { FileSpreadsheet, X } from "lucide-react";

export function ProCbtExportDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="secondary-button" type="button" onClick={() => setIsOpen(true)}>
        <FileSpreadsheet size={17} /> export v.ProCBT
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="procbt-export-title"
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
                <h3 id="procbt-export-title" style={{ marginTop: 0 }}>Export v.ProCBT</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Isi identitas export. Pilihan status, pola export, dan kisi-kisi tetap mengikuti form export soal yang sudah dipilih.
                </p>
              </div>
              <button className="secondary-button compact-button" type="button" onClick={() => setIsOpen(false)} aria-label="Tutup export v.ProCBT">
                <X size={16} />
              </button>
            </div>

            <div className="form-grid">
              <label className="field-block">
                <span className="field-label">Prodi</span>
                <input className="text-input" name="procbtProdi" required placeholder="Contoh: PMB Kedokteran" />
              </label>

              <label className="field-block">
                <span className="field-label">Tipe</span>
                <input className="text-input" name="procbtTipe" required placeholder="Contoh: PMB" />
              </label>

              <label className="field-block">
                <span className="field-label">Versi</span>
                <input className="text-input" name="procbtVersion" required placeholder="Contoh: Dasar Penalaran" />
              </label>
            </div>

            <div className="package-action-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
              <button className="secondary-button" type="button" onClick={() => setIsOpen(false)}>
                Batal
              </button>
              <button className="primary-button" type="submit" name="format" value="procbt">
                <FileSpreadsheet size={17} /> Export v.ProCBT
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
