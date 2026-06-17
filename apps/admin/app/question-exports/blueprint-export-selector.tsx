"use client";

import { useMemo, useState } from "react";
import { ListChecks, Search } from "lucide-react";

type BlueprintOption = {
  id: string;
  code: string;
  title: string;
  group: string;
  mode: string;
};

type Props = {
  blueprints: BlueprintOption[];
};

const PAGE_SIZE = 10;

function number(value: number) {
  return value.toLocaleString("id-ID");
}

export function BlueprintExportSelector({ blueprints }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const selectedSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);

  const filteredBlueprints = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return blueprints;

    return blueprints.filter((blueprint) => {
      return [blueprint.code, blueprint.title, blueprint.group, blueprint.mode]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [blueprints, query]);

  const totalPages = Math.max(1, Math.ceil(filteredBlueprints.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredBlueprints.slice(startIndex, startIndex + PAGE_SIZE);

  function setFilter(value: string) {
    setQuery(value);
    setPage(1);
  }

  function toggleCode(code: string) {
    setSelectedCodes((current) => {
      if (current.includes(code)) return current.filter((item) => item !== code);
      return [...current, code];
    });
  }

  function selectVisiblePage() {
    setSelectedCodes((current) => Array.from(new Set([...current, ...pageItems.map((item) => item.code)])));
  }

  return (
    <section className="card panel form-grid" style={{ marginTop: 24 }}>
      {selectedCodes.map((code) => (
        <input key={code} type="hidden" name="blueprintCode" value={code} />
      ))}

      <div className="panel-heading" style={{ alignItems: "flex-start", gap: 16 }}>
        <div>
          <h3><ListChecks size={18} /> Export berdasarkan kisi-kisi yang dipilih</h3>
          <p className="muted-text">
            Bila tidak ada kisi-kisi yang dicentang, sistem otomatis mengekspor semua kisi-kisi yang lolos filter status dan pola export.
          </p>
          <p className="muted-text" style={{ marginTop: 4 }}>
            Terpilih: <strong>{number(selectedCodes.length)}</strong> kisi-kisi dari {number(blueprints.length)} kisi-kisi aktif.
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? "Hide" : "Unhide"}
        </button>
      </div>

      {isOpen ? (
        <div className="form-grid">
          <label className="field-block">
            <span className="field-label">Filter kisi-kisi</span>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ left: 12, position: "absolute", top: 13 }} />
              <input
                className="text-input"
                type="search"
                value={query}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Cari kode kisi-kisi, judul, kelompok tes, atau mode soal..."
                style={{ paddingLeft: 38 }}
              />
            </div>
          </label>

          <div className="package-action-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            <button className="secondary-button" type="button" onClick={selectVisiblePage} disabled={!pageItems.length}>
              Pilih halaman ini
            </button>
            <button className="secondary-button" type="button" onClick={() => setSelectedCodes([])} disabled={!selectedCodes.length}>
              Kosongkan pilihan
            </button>
          </div>

          <div className="form-grid" style={{ maxHeight: 420, overflow: "auto", paddingRight: 6 }}>
            {pageItems.length ? pageItems.map((blueprint) => (
              <label key={blueprint.id} className="check-row" style={{ alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  checked={selectedSet.has(blueprint.code)}
                  onChange={() => toggleCode(blueprint.code)}
                />
                <span>
                  <strong>{blueprint.code}</strong> — {blueprint.title || "Tanpa judul"}
                  <small className="muted-text" style={{ display: "block" }}>
                    {blueprint.group ? `${blueprint.group} · ` : ""}{blueprint.mode || "Mode soal belum diisi"}
                  </small>
                </span>
              </label>
            )) : (
              <p className="muted-text">Tidak ada kisi-kisi yang cocok dengan filter.</p>
            )}
          </div>

          <div className="panel-heading" style={{ alignItems: "center", gap: 12 }}>
            <p className="muted-text">
              Menampilkan {filteredBlueprints.length ? number(startIndex + 1) : 0}–{number(Math.min(startIndex + PAGE_SIZE, filteredBlueprints.length))} dari {number(filteredBlueprints.length)} kisi-kisi.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage <= 1}
              >
                Sebelumnya
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage >= totalPages}
              >
                Berikutnya
              </button>
            </div>
          </div>
          <small className="muted-text">Halaman {number(currentPage)} dari {number(totalPages)}</small>
        </div>
      ) : null}
    </section>
  );
}
