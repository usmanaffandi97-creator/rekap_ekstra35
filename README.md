# 📊 Sistem Rekapitulasi Presensi Ekstrakurikuler (Versi 4.0)

Aplikasi Web modern, cepat, dan responsif untuk pencatatan presensi, rekapitulasi kehadiran, dan manajemen kegiatan ekstrakurikuler sekolah dengan dukungan sistem **Role-Based Access Control (RBAC)** individual, integrasi **Google Sheets via Google Apps Script (GAS)**, serta penyimpanan otomatis **Local Storage**.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Versi](https://img.shields.io/badge/Versi-4.0%20RBAC-blue)
![Platform](https://img.shields.io/badge/Platform-Vercel%20%7C%20GitHub%20Pages%20%7C%20Google%20Apps%20Script-purple)
![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JavaScript%20Vanilla-orange)

---

## 🌟 Fitur Utama

1. **Autentikasi & Akun Unik Masing-Masing User (RBAC Multi-User):**
   - Setiap Pelatih memiliki akun sendiri dan **hanya bisa mengakses ekskul yang diampunya**.
   - Setiap Wali Kelas memiliki akun sendiri dan **hanya bisa memantau siswa dari kelas binaannya**.
   - Administrator memiliki akses penuh ke seluruh data, konfigurasi sekolah, dan manajemen akun pengguna.
2. **Kustomisasi Identitas & Logo Sekolah:**
   - Fitur upload logo langsung dari komputer/HP (Base64) atau menggunakan link URL gambar.
   - Perubahan identitas sekolah (Nama Sekolah, Kota/Kabupaten, Semester, Tahun Ajaran) diproteksi khusus Admin.
3. **Pencatatan Presensi Cepat & Fleksibel:**
   - Input status kehadiran (Hadir, Sakit, Izin, Alpa) dengan 1 klik.
   - Otomatis menghitung statistik kehadiran per pertemuan dan kumulatif per semester.
4. **Ekspor & Cetak Laporan:**
   - Cetak PDF rekap presensi per ekskul maupun per kelas.
   - Ekspor data ke format CSV / kompatibel Microsoft Excel & Google Sheets.
5. **Mode Dual Storage (Online + Offline Safe):**
   - Mode Local Storage: Dapat berjalan langsung di browser tanpa backend tambahan.
   - Mode Google Sheets: Terhubung ke Google Spreadsheet sekolah via Google Apps Script Web App (`Code.gs`).
6. **Zero Dependencies & Siap Deploy:**
   - Dibangun murni dengan HTML5, CSS3, dan Vanilla JavaScript. Tanpa `npm install` atau proses build.

---

## 👥 Akun Demo Bawaan

| Role | Username | Password Default | Hak Akses & Tugas |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Akses penuh seluruh ekskul, kelas, pengaturan identitas/logo, dan manajemen akun |
| **Pelatih Futsal** | `pelatih_futsal` | `futsal123` | Input presensi & rekap khusus Ekskul Futsal |
| **Pelatih Pramuka** | `pelatih_pramuka` | `pramuka123` | Input presensi & rekap khusus Ekskul Pramuka |
| **Pelatih Robotik** | `pelatih_robotik` | `robotik123` | Input presensi & rekap khusus Ekskul Robotik |
| **Pelatih PMR** | `pelatih_pmr` | `pmr123` | Input presensi & rekap khusus Ekskul PMR |
| **Wali Kelas 7A** | `wali_7a` | `wali7a123` | Monitoring keaktifan siswa khusus Kelas 7A |
| **Wali Kelas 7B** | `wali_7b` | `wali7b123` | Monitoring keaktifan siswa khusus Kelas 7B |
| **Wali Kelas 8A** | `wali_8a` | `wali8a123` | Monitoring keaktifan siswa khusus Kelas 8A |
| **Wali Kelas 9A** | `wali_9a` | `wali9a123` | Monitoring keaktifan siswa khusus Kelas 9A |

*(Kata sandi dan daftar akun dapat diubah atau ditambahkan langsung oleh Administrator di menu Pengaturan Akun).*

---

## 📁 Struktur Repositori

```text
├── index.html           # File utama aplikasi (Versi 4.0 - Standalone & RBAC)
├── Code.gs              # Script backend untuk Google Apps Script (Opsional)
├── vercel.json          # Konfigurasi routing static untuk deployment Vercel
├── .gitignore           # File pengabaian git
├── PANDUAN.md           # Panduan lengkap integrasi Google Apps Script
├── RINCIAN_FITUR.md     # Rincian komprehensif seluruh modul dan fitur V4.0
├── versi-4/             # Cadangan arsip Versi 4.0
├── versi-3/             # Arsip Versi 3.0
├── versi-2/             # Arsip Versi 2.0
├── versi-1/             # Arsip Versi 1.0
└── siap-pasang/         # Paket siap pasang & template spreadsheet
```

---

## 🚀 Panduan Deploy ke Vercel (Mudah & Cepat)

Aplikasi ini bersifat **Static Web App murni**, sehingga proses deployment ke Vercel sangat cepat tanpa perlu build command.

### Cara 1: Deploy Langsung lewat GitHub (Rekomendasi)
1. Push repositori ini ke akun GitHub Anda (lihat panduan push di bawah).
2. Buka dashboard [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
3. Klik tombol **"Add New..."** lalu pilih **"Project"**.
4. Cari dan pilih repositori GitHub aplikasi ini, lalu klik **"Import"**.
5. Pada pengaturan proyek:
   - **Framework Preset**: Pilih `Other`
   - **Root Directory**: `./` (biarkan default)
   - **Build Command**: Kosongkan (tidak perlu build)
   - **Output Directory**: Kosongkan (biarkan default)
6. Klik **"Deploy"**.
7. Dalam hitungan detik, aplikasi Anda sudah live dengan URL publik (contoh: `https://rekap-ekskul.vercel.app`).

### Cara 2: Deploy Menggunakan Vercel CLI
Jika sudah menginstal Vercel CLI di komputer:
```bash
# Login ke Vercel
vercel login

# Jalankan deploy
vercel --prod
```

---

## 🐙 Panduan Upload / Push ke GitHub

### Langkah 1: Buat Repositori Baru di GitHub
1. Buka [github.com/new](https://github.com/new).
2. Beri nama repositori, misalnya: `rekap-ekskul-appscript` atau `presensi-ekskul`.
3. Pilih visibilitas **Public** atau **Private**.
4. Biarkan opsi *Initialize this repository with README* **tidak dicentang** (karena kita sudah membuat README).
5. Klik **Create repository**.

### Langkah 2: Jalankan Perintah Git di Terminal / Komputer
Buka Command Prompt atau PowerShell di folder ini (`f:\rekap-ekskul-appscript`), lalu jalankan:

```bash
# Inisialisasi Git
git init

# Tambahkan semua file
git add .

# Buat commit perdana
git commit -m "feat: Inisialisasi Rekap Presensi Ekskul V4.0 siap deploy"

# Ubah branch utama menjadi main
git branch -M main

# Sambungkan ke repositori GitHub Anda (ganti URL di bawah dengan URL repo Anda)
git remote add origin https://github.com/USERNAME-ANDA/NAMA-REPO-ANDA.git

# Push ke GitHub
git push -u origin main
```

---

## 🔗 Integrasi Google Apps Script (Opsional)

Jika ingin data tersimpan otomatis di Google Sheets sekolah:
1. Buka [Google Sheets](https://sheets.new) baru.
2. Buka menu **Ekstensi** > **Apps Script**.
3. Hapus kode bawaan, lalu salin seluruh isi file [`Code.gs`](file:///f:/rekap-ekskul-appscript/Code.gs).
4. Klik **Terapkan (Deploy)** > **Deployment Baru**.
5. Pilih jenis **Aplikasi Web (Web App)**:
   - **Jalankan sebagai**: *Saya (email pemilik spreadsheet)*
   - **Siapa yang memiliki akses**: *Siapa saja (Anyone)*
6. Salin URL Web App yang dihasilkan.
7. Masukkan URL tersebut ke dalam aplikasi melalui menu **Pengaturan Aplikasi (Khusus Admin)**.

---

## 📄 Lisensi & Kontribusi

Dikembangkan untuk kemudahan manajemen kegiatan ekstrakurikuler di tingkat SD, SMP, SMA/SMK sederajat. Bebas digunakan dan dimodifikasi untuk kebutuhan instansi pendidikan.
