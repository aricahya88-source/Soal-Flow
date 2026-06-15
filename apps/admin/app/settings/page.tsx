import { AdminShell } from "@/components/admin-shell";
import { ROLE_META } from "@/lib/access";
import { requirePageUser } from "@/lib/auth";

export default async function SettingsPage() {
  await requirePageUser(["SUPER_ADMIN"]);
  return (
    <AdminShell
      title="Pengaturan"
      subtitle="Konfigurasi aplikasi dan catatan versi 2.8"
      allowedRoles={["SUPER_ADMIN"]}
    >
      <div className="page-header">
        <div>
          <h2>Konfigurasi sistem</h2>
          <p>Halaman ini disiapkan untuk pengaturan organisasi, format kisi-kisi, plotting tugas, mode validasi, dan parameter paket ujian.</p>
        </div>
        <span className="badge">SoalFlow 2.8</span>
      </div>
      <div className="content-grid">
        <section className="card panel form-grid">
          <label className="field-block"><span className="field-label">Nama organisasi</span><input className="text-input" defaultValue="Panitia Seleksi" readOnly /></label>
          <label className="field-block"><span className="field-label">Validasi kisi-kisi</span><input className="text-input" value="Tidak diperlukan" readOnly /></label>
          <label className="field-block"><span className="field-label">Validasi soal</span><input className="text-input" value="Validator diplot per kode kisi-kisi dan dapat mengedit soal/kunci" readOnly /></label>
          <label className="field-block"><span className="field-label">Format kisi-kisi</span><input className="text-input" value="Identitas + tabel Soal-Kunci-Jawaban A-E" readOnly /></label>
          <label className="field-block"><span className="field-label">Kode</span><input className="text-input" value="Kisi-kisi dan soal digenerate sistem" readOnly /></label>
          <label className="field-block"><span className="field-label">Sumber soal paket ujian</span><input className="text-input" value="Hanya soal APPROVED" readOnly /></label>
        </section>
        <aside className="card panel">
          <h3>Role aktif</h3>
          <div className="summary-list">
            {ROLE_META.map((role) => <div className="summary-row" key={role.code}><span>{role.name}</span><strong>{role.code}</strong></div>)}
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
