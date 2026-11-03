# 📋 Panduan Master — Sistem Rekap Ketidakhadiran Ekstrakurikuler
## Google Apps Script & Standalone Web App (Versi 1, 2, 3, dan 4)

Aplikasi ini dirancang untuk memudahkan pencatatan, pemantauan, dan rekapitulasi ketidakhadiran peserta didik dalam kegiatan ekstrakurikuler sekolah. Repositori ini menyediakan **4 versi lengkap** yang dapat digunakan sesuai kebutuhan dan skala tata kelola sekolah Anda:

* **Versi 4.0 (Multi-User Dedicated — Folder `versi-4/`):**
  Pembaruan terlengkap dengan **Akun Mandiri Setiap Pelatih & Setiap Wali Kelas** (username & password unik terikat ke cabang/rombel binaan), **Manajemen Akun Pengguna oleh Admin** (tambah, edit penugasan, reset password), serta seluruh keunggulan Versi 3 (Portal Siswa NIS, filter peserta terdaftar, buka/tutup pendaftaran, dan kustomisasi logo sekolah).
* **Versi 3.0 (Flagship Portal Siswa — Root & `versi-3/` serta `siap-pasang/`):**
  Dilengkapi **Portal Mandiri Siswa (Login NIS)**, **Pendaftaran Ekstra Mandiri**, **Admin Buka/Tutup Pendaftaran & Kelola Peserta**, **Penyaringan Otomatis Peserta untuk Pelatih**, akun universal pelatih/wali kelas, serta **Mobile Bottom Navigation Bar**.
* **Versi 2.0 (Universal Coach & Wali Kelas — Folder `versi-2/`):**
  Penyederhanaan akun (1 Akun Pelatih & 1 Akun Wali Kelas Universal), siswa bebas ikut banyak ekskul, rincian ketidakhadiran di ekstranya pada rekap wali kelas, dan *Sticky Save Bar* di smartphone.
* **Versi 1.0 (Klasik — Folder `versi-1/`):**
  Format klasik awal dengan akun multi-pengguna terikat cabang & kelas dengan struktur lembar kerja dasar.

---

## 🗂️ Struktur Direktori Proyek

```
f:\rekap-ekskul-appscript\
├── versi-4\                  # 🔐 VERSI 4.0 (MULTI-USER DEDICATED COACH & WALI KELAS)
│   ├── Code.gs               # Backend Versi 4.0 (Multi-User Sheet + CRUD Users API)
│   ├── index.html            # Frontend Versi 4.0 (Storage key: rekapEkskul_v4_multi)
│   └── PANDUAN_VERSI_4.md    # Panduan khusus Versi 4.0
│
├── siap-pasang\              # 🚀 VERSI SIAP PASANG (ZERO-CONFIG & PLUG-AND-PLAY)
│   ├── Code.gs               # Backend Auto-Detect Spreadsheet & Auto-Init
│   ├── index.html            # Frontend Versi 3.0 Mobile Ready
│   ├── PETUNJUK_INSTALASI_CEPAT.md # Panduan 3 Langkah (2 Menit Deploy)
│   └── template_import_siswa.csv   # Template Data Siswa Siap Import
│
├── versi-3\                  # 🌟 VERSI 3.0 (PORTAL SISWA & REGISTRASI EKSKUL)
│   ├── Code.gs               # Backend Versi 3.0
│   ├── index.html            # Frontend Versi 3.0 (Storage key: rekapEkskul_v3)
│   └── PANDUAN_VERSI_3.md    # Panduan khusus Versi 3.0
│
├── versi-2\                  # 📱 VERSI 2.0 (UNIVERSAL COACH & HOMEROOM REKAP)
│   ├── Code.gs               # Backend Versi 2.0
│   ├── index.html            # Frontend Versi 2.0 (Storage key: rekapEkskul_v4)
│   └── PANDUAN_VERSI_2.md    # Panduan khusus Versi 2.0
│
├── versi-1\                  # 🏛️ VERSI 1.0 (MULTI-USER KLASIK TERIKAT)
│   ├── Code.gs               # Backend Versi 1.0
│   ├── index.html            # Frontend Versi 1.0 (Storage key: rekapEkskul_v1)
│   └── PANDUAN_VERSI_1.md    # Panduan khusus Versi 1.0
│
├── Code.gs                   # Backend Google Apps Script (Versi 3.0 Root)
├── index.html                # Frontend Responsive + Mobile (Versi 3.0 Root)
└── PANDUAN.md                # Panduan Master Seluruh Versi (File Ini)
```

> 💡 **Penyimpanan Terisolasi:** Setiap versi menggunakan kunci penyimpanan lokal (*localStorage*) yang berbeda (`rekapEkskul_v1`, `rekapEkskul_v4`, `rekapEkskul_v3`, `rekapEkskul_v4_multi`). Anda dapat membuka dan menguji keempat versi di peramban yang sama tanpa risiko data saling menimpa.

---

## ⚖️ Matriks Perbandingan Antar Versi

| Fitur / Karakteristik | Versi 1.0 (Klasik) | Versi 2.0 (Universal) | Versi 3.0 (Portal Siswa) | Versi 4.0 (Multi-User Dedicated) |
|---|---|---|---|---|
| **Akun Pelatih & Wali Kelas** | Terpisah | 1 Akun Universal Pelatih & 1 Wali | 1 Akun Universal Pelatih & 1 Wali | ✅ **Akun Mandiri Setiap Pelatih & Setiap Wali Kelas** + Akun Universal Koordinator |
| **Manajemen Akun Pengguna** | ❌ Manual Sheet | ❌ Tidak ada | ❌ Tidak ada | ✅ **Menu Admin "Kelola Akun Pengguna"** (Tambah, Edit Penugasan, Reset Password) |
| **Dashboard Khusus Sesuai Tugas** | Sama | Sama | Sesuai Peran (Admin, Pelatih, Wali, Siswa) | ✅ **Sangat Terfokus:** Pelatih Futsal hanya fokus Futsal, Wali 7A hanya fokus Kelas 7A |
| **Portal Mandiri Siswa (NIS)** | ❌ Tidak ada | ❌ Tidak ada | ✅ Ada (Cek presensi & persentase hadir) | ✅ Ada (Login NIS bawaan password `123`) |
| **Pendaftaran Ekskul Mandiri** | ❌ Tidak ada | ❌ Tidak ada | ✅ Ada (Katalog & tombol daftar) | ✅ Ada (Siswa daftar mandiri) |
| **Buka/Tutup Pendaftaran** | ❌ Tidak ada | ❌ Tidak ada | ✅ Ada (Kontrol Admin Buka/Tutup) | ✅ Ada (Kontrol Admin Buka/Tutup) |
| **Daftar Peserta saat Pelatih Absen** | Semua siswa | Semua siswa | ✅ Hanya peserta terdaftar ekskul tsb | ✅ Hanya peserta terdaftar & terkunci ke ekskul tugasnya |
| **Kustomisasi Logo & Identitas** | Hardcoded | Hardcoded | ✅ Pengaturan Logo (URL & Unggah Gambar) | ✅ Pengaturan Logo (URL & Unggah Gambar) |
| **Navigasi Smartphone (Mobile UX)** | Desktop view | Sticky Bar | Bottom Nav + Sticky Bar (44px) | Bottom Nav + Sticky Bar (44px) |

---

## 🔑 Akun Default & Demo Login

### Akun Versi 4.0 (Multi-User Dedicated — Rekomendasi Tertinggi)
| Peran | Username | Password | Penugasan / Hak Akses |
|---|---|---|---|
| **Administrator** | `admin` | `admin123` | Akses penuh, kelola master data, pendaftaran, akun pengguna, ganti logo |
| **Pelatih Pramuka** | `pelatih_pramuka` | `123` | ⚽ Pramuka (Jumat, 15:00 - 17:00) |
| **Pelatih Futsal** | `pelatih_futsal` | `123` | ⚽ Futsal (Sabtu, 08:00 - 10:00) |
| **Pelatih Basket** | `pelatih_basket` | `123` | ⚽ Basket (Selasa, 15:30 - 17:00) |
| **Pelatih Paduan Suara**| `pelatih_padus` | `123` | ⚽ Paduan Suara (Kamis, 14:00 - 15:30) |
| **Pelatih PMR** | `pelatih_pmr` | `123` | ⚽ PMR (Rabu, 15:00 - 16:30) |
| **Koordinator Pelatih** | `pelatih` | `123` | 🌐 Universal (Dapat memilih dan absen semua cabang) |
| **Wali Kelas 7A** | `wali_7a` | `123` | 🏫 Kelas 7A (Ibu Siti Rahayu, S.Pd.) |
| **Wali Kelas 7B** | `wali_7b` | `123` | 🏫 Kelas 7B (Bapak Ahmad Dahlan, M.Pd.) |
| **Wali Kelas 8A** | `wali_8a` | `123` | 🏫 Kelas 8A (Ibu Nurul Hidayah, S.Pd.) |
| **Wali Kelas 8B** | `wali_8b` | `123` | 🏫 Kelas 8B (Bapak Bambang Sutrisno, S.Pd.) |
| **Wali Kelas 9A** | `wali_9a` | `123` | 🏫 Kelas 9A (Ibu Sri Wahyuni, M.Pd.) |
| **Wali Kelas 9B** | `wali_9b` | `123` | 🏫 Kelas 9B (Bapak Agus Prasetyo, S.Pd.) |
| **Koordinator Wali** | `walikelas` | `123` | 🌐 Universal (Dapat memantau semua rombel 7A-9B) |
| **Siswa (Ahmad Fauzi)** | `2024001` | `123` | Siswa Kelas 7A (Portal Presensi Mandiri) |
| **Semua Siswa Lain** | *[NIS Siswa]* | `123` | Login menggunakan NIS masing-masing |

### Akun Versi 3.0 (Universal Coach & Wali)
* Admin: `admin` / `admin123`
* Pelatih Universal: `pelatih` / `123`
* Wali Kelas Universal: `walikelas` / `123`
* Siswa: Login via NIS (misal: `2024001` / `123`)

### Akun Versi 2.0 (Universal)
* Admin: `admin` / `admin123`
* Pelatih: `pelatih` / `123`
* Wali Kelas: `walikelas` / `123`

### Akun Versi 1.0 (Klasik)
* Admin: `admin` / `admin123`
* Pelatih: `pelatih_pramuka` / `123`, `pelatih_futsal` / `123`, dll.
* Wali Kelas: `wali_7a` / `123`, `wali_7b` / `123`, dll.

---

## 🚀 Panduan Pemasangan di Google Apps Script (Online)

Untuk memasang versi pilihan Anda secara daring terkoneksi Google Spreadsheet:

1. **Buat Google Spreadsheet:**
   - Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet kosong baru.
   - Salin **ID Spreadsheet** dari URL di address bar browser:
     ```text
     https://docs.google.com/spreadsheets/d/[ID_SPREADSHEET_DI_SINI]/edit
     ```
2. **Buka Apps Script:**
   - Di Google Spreadsheet, klik menu **Ekstensi → Apps Script**.
3. **Salin Backend (`Code.gs`):**
   - Hapus kode default di `Code.gs`.
   - Buka file `Code.gs` dari folder versi yang Anda pilih (misal `versi-4/Code.gs`), salin seluruh isinya.
   - Masukkan ID spreadsheet pada baris atas jika diperlukan (atau biarkan kosong `''` untuk deteksi otomatis).
4. **Salin Frontend (`index.html`):**
   - Di Apps Script, klik tanda **+** di panel kiri → pilih **HTML**.
   - Beri nama file: `index` *(tanpa ekstensi .html)*.
   - Tempel seluruh isi file `index.html` dari versi yang Anda pilih (misal `versi-4/index.html`).
   - Simpan proyek (**Ctrl + S**).
5. **Inisialisasi Lembar Kerja (Jalankan Sekali):**
   - Pada dropdown toolbar nama fungsi, pilih fungsi **`setupSheets`**.
   - Klik tombol **▶ Jalankan**.
   - Berikan izin akses (*Review Permissions* → Pilih Akun → *Advanced* → *Go to project* → *Allow*).
   - Tunggu hingga proses selesai.
6. **Deploy sebagai Web App:**
   - Klik **Deploy → New Deployment**.
   - Pilih jenis: **Web App**.
   - Konfigurasi:
     - *Execute as*: **Me**
     - *Who has access*: **Anyone**
   - Klik **Deploy** dan salin URL Web App yang dihasilkan untuk dibagikan kepada pelatih, wali kelas, dan siswa.

---

## 💻 Panduan Menjalankan Secara Standalone (Offline di Browser)

Tanpa perlu internet maupun setup Google Spreadsheet, Anda dapat langsung menguji coba seluruh fitur:
* **Versi 4.0:** Buka file `versi-4/index.html` langsung di browser.
* **Versi 3.0:** Buka file `siap-pasang/index.html` atau `versi-3/index.html` langsung di browser.
* **Versi 2.0:** Buka file `versi-2/index.html` langsung di browser.
* **Versi 1.0:** Buka file `versi-1/index.html` langsung di browser.
