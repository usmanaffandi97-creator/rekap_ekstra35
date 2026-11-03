# 📋 Rincian Fitur Lengkap — Sistem Rekap Presensi & Pendaftaran Ekstrakurikuler
### Berbasis Google Apps Script & Standalone Responsive Web App

Dokumen ini memuat spesifikasi dan dokumentasi rincian seluruh fitur yang tersedia pada aplikasi **Rekap Presensi & Pendaftaran Ekstrakurikuler Sekolah**, mulai dari arsitektur multi-peran, alur kerja masing-masing pengguna, fitur khusus mobile UX, hingga keandalan teknis sistem.

---

## 📑 Daftar Isi
1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Matriks Hak Akses & Peran Pengguna](#2-matriks-hak-akses--peran-pengguna)
3. [Rincian Fitur per Peran Pengguna](#3-rincian-fitur-per-peran-pengguna)
   - [A. Portal Siswa (Peserta Didik)](#a-portal-siswa-peserta-didik)
   - [B. Portal Pelatih Ekstrakurikuler](#b-portal-pelatih-ekstrakurikuler)
   - [C. Portal Wali Kelas (Guru Kelas)](#c-portal-wali-kelas-guru-kelas)
   - [D. Portal Administrator Sekolah](#d-portal-administrator-sekolah)
4. [Fitur Antarmuka & Optimasi Seluler (Mobile UX)](#4-fitur-antarmuka--optimasi-seluler-mobile-ux)
5. [Fitur Kustomisasi Logo & Identitas Instansi](#5-fitur-kustomisasi-logo--identitas-instansi)
6. [Arsitektur Teknis & Ketahanan Sistem](#6-arsitektur-teknis--ketahanan-sistem)
7. [Matriks Perjalanan Fitur (Versi 1 s/d Versi 4)](#7-matriks-perjalanan-fitur-versi-1-sd-versi-4)

---

## 1. Ringkasan Eksekutif

Aplikasi dirancang untuk menjawab tantangan pengelolaan ekstrakurikuler di tingkat sekolah (SMP/MTs/SMA/SMK) yang sering kali menghadapi kendala:
- Pelatih kesulitan mencatat presensi karena daftar siswa bercampur dengan siswa yang tidak ikut.
- Wali kelas kesulitan memantau keaktifan siswa binaannya di luar jam pelajaran kelas untuk pengisian buku rapor.
- Siswa tidak memiliki transparansi atas rekap kehadiran latihannya.
- Pendaftaran ekstra masih menggunakan kertas manual yang rawan hilang atau tidak terdata rapi.

**Prinsip Utama Aplikasi:**
> *"Catat Hanya yang Tidak Hadir (Exception-based Attendance), Saring Otomatis Peserta Terdaftar, dan Sajikan Rekapitulasi Terpadu per Siswa serta per Rombel."*

---

## 2. Matriks Hak Akses & Peran Pengguna

Sistem mendukung **4 Peran Utama** dengan hak akses yang terisolasi secara ketat:

| Fitur / Modul | Administrator | Pelatih Ekskul | Wali Kelas | Siswa (Peserta Didik) |
|---|:---:|:---:|:---:|:---:|
| **Login Mandiri** | Username + Password | Username + Password | Username + Password | NIS Siswa + Password |
| **Karakter Akun** | 1 Akun Admin Utama | Khusus per Cabang / Universal | Khusus per Kelas / Universal | Otomatis sesuai NIS |
| **Dashboard Khusus** | ✅ Khusus Admin | ✅ Khusus Cabang | ✅ Khusus Rombel | ✅ Khusus Siswa |
| **Katalog & Daftar Ekskul Mandiri** | ✅ Pantau / Atur | ❌ | ❌ | ✅ Mandiri (Saat Buka) |
| **Buka/Tutup Pendaftaran** | ✅ Penuh (Global/Per Ekskul) | ❌ | ❌ | ❌ |
| **Kelola Peserta Ekskul** | ✅ Tambah / Keluarkan | ❌ | ❌ | ❌ (Hanya mandiri) |
| **Input Ketidakhadiran (Absensi)** | ✅ Semua Cabang | ✅ Cabang Binaannya | ❌ | ❌ |
| **Penyaringan Peserta Terdaftar** | ✅ Otomatis | ✅ Otomatis | ❌ | ❌ |
| **Rekapitulasi Ketidakhadiran Rombel** | ✅ Semua Kelas | ❌ | ✅ Kelas Binaannya | ❌ |
| **Detail Ketidakhadiran di Ekstranya** | ✅ Terperinci | ❌ | ✅ Terperinci | ❌ |
| **Peringatan Siswa Perlu Perhatian** | ✅ Global | ❌ | ✅ Filter per Kelas | ❌ |
| **Portal Presensi & Persentase Hadir** | ❌ | ❌ | ❌ | ✅ Real-time |
| **Kelola Akun (Tambah, Edit, Reset Pass)** | ✅ Penuh | ❌ | ❌ | ❌ |
| **Ganti Logo & Identitas Sekolah** | ✅ Upload / URL | ❌ | ❌ | ❌ |
| **Unduh Laporan (CSV / Excel)** | ✅ Semua Rombel | ❌ | ✅ Kelas Binaannya | ❌ |

---

## 3. Rincian Fitur per Peran Pengguna

### A. Portal Siswa (Peserta Didik)
Akses dirancang khusus untuk kemandirian peserta didik:
1. **Autentikasi Cepat berbasis NIS:**
   - Siswa login menggunakan **NIS** (Nomor Induk Siswa) masing-masing.
   - Password bawaan `123` (atau sesuai NIS), tanpa perlu proses registrasi akun rumit di awal.
2. **Dashboard Siswa Terintegrasi:**
   - Menyapa nama lengkap siswa, NIS, dan kelas binaannya.
   - Badge ringkasan seluruh ekskul yang sedang aktif diikuti.
   - Metrik visual kehadiran: Total Pertemuan, Jumlah Hadir, Sakit, Izin, Alpha, dan **Persentase Tingkat Kehadiran (%)** dengan indikator progress bar warna.
3. **Katalog & Pendaftaran Ekstrakurikuler Mandiri:**
   - Menampilkan kartu seluruh cabang ekstrakurikuler lengkap dengan hari, jam latihan, deskripsi, kuota, serta status pendaftaran (**BUKA** / **TUTUP**).
   - Tombol **"Daftar Ekstra Ini"** untuk mendaftar mandiri dengan konfirmasi dialog.
   - Tombol **"Batal"** jika siswa ingin berganti pilihan selama masa pendaftaran masih dibuka.
   - Siswa diperbolehkan mendaftar lebih dari satu ekstrakurikuler sesuai bakat dan minat.
4. **Laporan Presensi Saya (Real-Time):**
   - Rincian kehadiran per cabang ekskul yang diikuti.
   - Riwayat log presensi kronologis per tanggal latihan, mencatat status (Hadir, Sakit, Izin, Alpha) serta keterangan alasan tidak hadir.

---

### B. Portal Pelatih Ekstrakurikuler
Dirancang untuk efisiensi waktu di lapangan saat memimpin latihan:
1. **Akun Mandiri Terikat Cabang:**
   - Pelatih memiliki username dan password khusus (misal: `pelatih_futsal`, `pelatih_pramuka`, `pelatih_basket`, dll.).
   - Koordinator ekstrakurikuler dapat menggunakan akun universal (`pelatih`) untuk mengawasi seluruh cabang.
2. **Dashboard Pelatih Personal:**
   - Banner khusus yang mengidentifikasi cabang binaan pelatih bersangkutan.
   - 4 Kartu Statistik Cepat: Cabang Tugas, Total Peserta Terdaftar di cabang tsb, Jumlah Sesi Latihan yang telah diabsen, dan Total Catatan Ketidakhadiran.
   - Pintasan 1-klik untuk langsung membuka form absensi cabang tugasnya.
   - Tabel riwayat 5 sesi latihan terakhir dengan status S/I/A dan tombol periksa/edit.
3. **Penyaringan Otomatis Peserta Terdaftar (*Filtering Engine*):**
   - Saat membuka form absensi, sistem **hanya menampilkan siswa yang sah terdaftar** pada cabang ekskul tersebut. Siswa sekolah lain yang tidak bergabung otomatis disaring keluar.
   - Mengeliminasi risiko pelatih salah mengabsen siswa yang bukan anggota.
4. **Formulir Input Ketidakhadiran Cepat (*Exception-based*):**
   - **Prinsip Default Hadir:** Seluruh peserta dianggap Hadir secara otomatis. Pelatih hanya perlu menyentuh tombol bagi siswa yang **Sakit (S)**, **Izin (I)**, atau **Alpha (A)**.
   - Tombol status ergonomis dengan umpan balik visual warna instan (Hijau = Hadir, Kuning = Sakit, Biru = Izin, Merah = Alpha).
   - Kolom isian keterangan opsional untuk menuliskan alasan (misal: *"Demam"*, *"Izin acara keluarga"*, *"Lomba luar"*).
   - Filter rombel kelas (7A-9B) dan kolom pencarian instan nama peserta.
   - Tombol *"Tandai Semua Hadir"* untuk menyetel ulang secara cepat jika seluruh siswa hadir lengkap.
5. **Sticky Save Bar di Smartphone:**
   - Tombol simpan mengambang (*floating*) di bagian bawah layar yang menghitung jumlah siswa tidak hadir secara langsung (*live counter*), mencegah pelatih lupa menyimpan saat menggulir daftar panjang.
6. **Riwayat & Manajemen Sesi Latihan:**
   - Daftar seluruh tanggal pertemuan latihan yang telah tersimpan.
   - Pelatih dapat memeriksa kembali hasil input maupun menghapus sesi jika terjadi kekeliruan jadwal.

---

### C. Portal Wali Kelas (Guru Kelas)
Dirancang untuk kebutuhan pemantauan karakter, disiplin, bimbingan konseling (BK), dan pelaporan buku rapor:
1. **Akun Mandiri Terikat Rombel:**
   - Setiap wali kelas memiliki username dan password tersendiri (misal: `wali_7a`, `wali_7b`, `wali_8a`, dll.).
   - Koordinator wali kelas/BK dapat menggunakan akun universal (`walikelas`) untuk melihat rekap lintas rombel.
2. **Dashboard Wali Kelas Personal:**
   - Banner resmi mengidentifikasi rombel binaan.
   - Statistik kelas: Jumlah Siswa Rombel, Angka Partisipasi Ekskul (berapa siswa yang aktif ikut kegiatan), dan Akumulasi Ketidakhadiran siswa kelas tersebut.
   - **Peringatan Siswa Perlu Perhatian (*Early Warning System*):** Langsung menyorot 5 siswa dengan ketidakhadiran terbanyak di kelasnya lengkap dengan akumulasi angka dan rincian di ekskul apa saja mereka membolos/absen.
3. **Rekapitulasi Ketidakhadiran Rombel dengan Detail di Ekstranya:**
   - Tabel rekapitulasi per siswa di kelas binaan yang mencantumkan: No, NIS, Nama Siswa, Jumlah Sakit (S), Izin (I), Alpha (A), Total Ketidakhadiran, serta kolom **"Ketidakhadiran di Ekstranya"**.
   - Kolom detail menampilkan badge spesifik, contoh: `⚽ Futsal: 2x (1S, 1A)`, `⚽ Pramuka: 1x (1I)`.
   - Tombol **"Detail"** untuk membuka modal pop-up riwayat tanggal ketidakhadiran siswa beserta alasan keterangannya.
4. **Kartu Akumulasi per Cabang Ekskul:**
   - Menghitung total ketidakhadiran siswa kelas tersebut yang dikelompokkan berdasarkan cabang kegiatan.
5. **Penyaringan & Ekspor Data:**
   - Filter fleksibel berdasarkan cabang ekskul serta rentang tanggal (*Dari Tanggal* s/d *Sampai Tanggal*).
   - **Ekspor CSV / Excel:** Unduh laporan berformat CSV yang kompatibel dengan Microsoft Excel, Google Sheets, dan LibreOffice Calc untuk pelaporan resmi semesteran.

---

### D. Portal Administrator Sekolah
Pusat kendali master data, operasional pendaftaran, tata kelola akun, dan identitas instansi:
1. **Dashboard Eksekutif:**
   - Ringkasan statistik makro: Total Siswa Aktif, Jumlah Cabang Ekskul, Total Pendaftaran Aktif, dan Total Catatan Ketidakhadiran seluruh sekolah.
   - Pintasan kendali cepat ke seluruh modul sistem.
2. **Kelola Status Pendaftaran Ekskul (Buka / Tutup):**
   - **Kontrol Global 1-Klik:** Tombol *"🟢 Buka Semua"* dan *"🔴 Tutup Semua"* untuk membuka atau mengunci serentak periode pendaftaran ekskul di awal atau akhir semester.
   - **Kontrol Parsial per Cabang:** Tombol toggle individual per cabang ekskul jika cabang tertentu kuotanya sudah terpenuhi atau pelatih belum siap membuka pendaftaran.
3. **Kelola Peserta & Pendaftaran oleh Admin:**
   - Menampilkan daftar peserta terdaftar per cabang ekskul.
   - **Tambah Peserta Manual:** Menambahkan siswa ke ekskul tertentu melalui modal dialog pencarian nama/NIS (berguna bagi siswa yang terlambat mendaftar atau ditugaskan khusus oleh sekolah).
   - **Keluarkan Peserta:** Mengeluarkan siswa dari cabang ekskul jika siswa berpindah minat atau tidak aktif.
4. **Manajemen Akun Pengguna (*User Management*):**
   - Tabel direktori seluruh akun pengguna (Administrator, Pelatih, Wali Kelas, Siswa).
   - **Tambah Akun Baru:** Membuat akun baru dengan memilih peran (Pelatih / Wali Kelas / Admin) serta menautkannya ke cabang ekskul atau kelas binaan.
   - **Edit Akun & Penugasan:** Memperbarui nama, username, atau memindahkan penugasan cabang/rombel guru.
   - **Ganti / Reset Password:** Mereset password akun pengguna yang lupa dalam satu klik via modal dialog.
   - **Hapus Akun:** Menghapus akun yang sudah tidak bertugas (dengan proteksi keamanan akun admin utama tidak dapat terhapus).
   - Pencarian instan dan filter peran pengguna di tabel.
5. **Master Data Siswa:**
   - Pendataan siswa kelas 7, 8, dan 9 (NIS, Nama Lengkap, Kelas).
   - Tambah siswa satuan.
   - Dukungan impor massal data siswa via template CSV.
   - Hapus data siswa (otomatis membersihkan relasi pendaftaran dan absensi siswa tsb).
6. **Master Cabang Ekstrakurikuler:**
   - Pendataan cabang (Nama Ekskul, Hari Latihan, Jam, Kuota Maksimal, Deskripsi).
   - Tambah, edit jadwal, dan hapus cabang ekstrakurikuler.

---

## 4. Fitur Antarmuka & Optimasi Seluler (Mobile UX)

Aplikasi dirancang mengikuti standar modern *Mobile-First Design* agar nyaman digunakan di lapangan melalui smartphone:

1. **Mobile Bottom Navigation Bar:**
   - Menu navigasi melayang di bawah layar pada resolusi smartphone (< 768px).
   - Memudahkan perpindahan halaman hanya dengan jangkauan satu jempol tangan.
2. **Touch Targets Ramah Jari (44px):**
   - Seluruh tombol interaktif, khususnya tombol pilihan status Hadir/Sakit/Izin/Alpha, memiliki tinggi minimum 44px sesuai pedoman ergonomi antarmuka Apple iOS & Google Material Design.
3. **Sidebar Responsif dengan Overlay:**
   - Sidebar desktop otomatis berubah menjadi menu laci geser (*off-canvas drawer*) di smartphone dengan tombol pemicu hamburger icon dan penutup latar redup (*backdrop overlay*).
4. **Dukungan Keyboard:**
   - Kolom username dan password login mendukung penekanan tombol **Enter** untuk langsung masuk ke aplikasi tanpa perlu mengetuk layar.
5. **Toast Notification Non-Intrusif:**
   - Notifikasi sukses/peringatan/bahaya tampil mengambang di pojok layar selama 3 detik tanpa mengganggu alur kerja pengguna.

---

## 5. Fitur Kustomisasi Logo & Identitas Instansi

Aplikasi memberikan fleksibilitas penuh bagi pihak sekolah untuk mempersonalisasi kop dan identitas resmi:

1. **Dua Slot Logo Resmi:**
   - Slot 1: **Logo Pemerintah Kota / Lambang Kabupaten / Yayasan**.
   - Slot 2: **Logo Sekolah / Lambang Madrasah**.
   - Dilengkapi garis pembatas vertikal proporsional dan label nama instansi.
2. **Dua Metode Pemasangan Logo:**
   - **Metode Unggah Berkas (*File Upload*):** Langsung memilih berkas gambar (`.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`) dari memori laptop atau galeri HP tanpa perlu repot mencari hosting pihak ketiga.
   - **Metode Tautan Gambar (*Image URL*):** Memasukkan link URL gambar publik atau link Google Drive sharing.
3. **Optimalisasi Otomatis Gambar Sisi Klien (*Client-side Canvas Compression*):**
   - Berkas bitmap yang diunggah otomatis dikompresi dan disesuaikan ukurannya melalui HTML5 Canvas (resolusi optimal 260px, ukuran berkas susut drastis menjadi hanya ~15–25 KB).
   - Hasil kompresi tajam, cepat dimuat, dan sangat hemat kuota internet serta memori database.
   - Khusus format vektor SVG disimpan dalam bentuk aslinya untuk ketajaman tak terbatas (*lossless*).
4. **Pengaturan Teks Identitas Instansi:**
   - Admin dapat menyesuaikan teks *Nama Pemerintah Kota/Daerah*, *Nama Dinas Pendidikan/Kemenag*, *Judul Aplikasi*, serta *Sub-judul*.
5. **Persistensi Ganda:**
   - Tersimpan di *localStorage* peramban dan otomatis tersinkronisasi ke Google Spreadsheet pada lembar kerja `app_config`.
6. **Proteksi Hak Akses Admin:**
   - Perubahan logo dan identitas hanya dapat dilakukan oleh akun dengan peran **Administrator**.

---

## 6. Arsitektur Teknis & Ketahanan Sistem

1. **Dukungan Mode Ganda (Hybrid Online & Offline):**
   - **Mode Daring (Google Apps Script):** Terhubung langsung ke Google Spreadsheet sekolah sebagai basis data cloud gratis, aman, dan tanpa biaya sewa server bulanan.
   - **Mode Standalone / Luring (Browser Parity):** Menggunakan basis data lokal terisolasi (*LocalStorage*), memungkinkan aplikasi diuji coba langsung di laptop atau HP tanpa koneksi internet dan tanpa Google Spreadsheet.
2. **Auto-Detect Spreadsheet (*Zero-Config*):**
   - Script backend otomatis mendeteksi ID Spreadsheet aktif di mana naskah terpasang (`SpreadsheetApp.getActiveSpreadsheet()`), sehingga pengguna tidak wajib menyunting kode program secara manual.
3. **Inisialisasi Skema Otomatis (*Auto-Schema Setup*):**
   - Menjalankan fungsi `setupSheets()` otomatis membuat seluruh lembar kerja (`users`, `kelas`, `ekskul`, `siswa`, `keikutsertaan`, `absensi`, `app_config`) dengan tata letak header dan data awal yang siap pakai.
4. **Pencegahan Bentrok Data Antar Versi (*Storage Isolation*):**
   - Setiap varian versi menggunakan kunci *localStorage* unik yang terisolasi:
     - Versi 1.0: `rekapEkskul_v1`
     - Versi 2.0: `rekapEkskul_v4`
     - Versi 3.0: `rekapEkskul_v3`
     - Versi 4.0: `rekapEkskul_v4_multi`
   - Berbagai versi dapat dibuka pada peramban yang sama secara bersamaan tanpa risiko data tertukar atau tertimpa.
5. **Ketahanan Autentikasi (*Auto-Healing Cache & Fallback*):**
   - Fungsi pemuatan database lokal dilengkapi mekanisme *auto-sync* yang menyisipkan akun-akun baru jika peramban pengguna menyimpan *cache* versi lama.
   - Backend `Code.gs` dilengkapi fallback pencocokan akun bawaan sehingga pelatih atau wali kelas tetap dapat login meskipun lembar kerja baru pertama kali dibuat.

---

## 7. Matriks Perjalanan Fitur (Versi 1 s/d Versi 4)

| Kategori Fitur | Versi 1.0 (Klasik) | Versi 2.0 (Modern) | Versi 3.0 (Student Portal) | Versi 4.0 (Multi-User Dedicated) |
|---|:---:|:---:|:---:|:---:|
| **Struktur Akun Pelatih & Wali** | Terpisah Klasik | 1 Pelatih & 1 Wali Universal | 1 Pelatih & 1 Wali Universal | **Akun Mandiri Tiap Pelatih & Tiap Wali + Universal** |
| **Menu Manajemen User oleh Admin** | ❌ | ❌ | ❌ | **✅ Ada (Tambah, Edit, Reset Pass)** |
| **Portal Mandiri Siswa (Login NIS)** | ❌ | ❌ | ✅ Ada | **✅ Ada** |
| **Pendaftaran Mandiri oleh Siswa** | ❌ | ❌ | ✅ Ada | **✅ Ada** |
| **Buka/Tutup Pendaftaran oleh Admin** | ❌ | ❌ | ✅ Ada (Global & Parsial) | **✅ Ada (Global & Parsial)** |
| **Penyaringan Peserta Presensi Pelatih** | Tampil Semua | Tampil Semua | ✅ Hanya Siswa Terdaftar | **✅ Terdaftar & Terkunci ke Cabang Tugas** |
| **Dashboard Khusus Sesuai Tugas** | Standar/Sama | Standar/Sama | Sesuai Peran (Admin/Guru/Siswa)| **Sangat Spesifik (Futsal, Wali 7A, dll.)** |
| **Detail Ekskul di Rekap Wali Kelas** | Total Angka S/I/A | Ada Rincian per Cabang | Rincian per Cabang + Kartu | **Rincian per Cabang + Kartu Binaan** |
| **Peringatan Siswa Perlu Perhatian** | ❌ | Rekap Umum | Rekap Global | **Khusus Siswa Rombel Binaan** |
| **Kustomisasi Logo & Identitas** | Hardcoded | Hardcoded | ✅ URL & Upload File Gambar | **✅ URL & Upload File Gambar** |
| **Navigasi Mobile (Bottom Bar)** | ❌ | Sticky Bar | Bottom Nav + Sticky Bar | **Bottom Nav + Sticky Bar (44px)** |
| **Kunci Penyimpanan Browser** | `rekapEkskul_v1` | `rekapEkskul_v4` | `rekapEkskul_v3` | `rekapEkskul_v4_multi` |

---

## 📂 Lokasi Berkas Terkait di Proyek

- **Dokumen Master Panduan:** [`f:\rekap-ekskul-appscript\PANDUAN.md`](file:///f:/rekap-ekskul-appscript/PANDUAN.md)
- **Aplikasi Versi 4.0 (Unggulan):**
  - Frontend: [`f:\rekap-ekskul-appscript\versi-4\index.html`](file:///f:/rekap-ekskul-appscript/versi-4/index.html)
  - Backend: [`f:\rekap-ekskul-appscript\versi-4\Code.gs`](file:///f:/rekap-ekskul-appscript/versi-4/Code.gs)
  - Panduan Versi 4: [`f:\rekap-ekskul-appscript\versi-4\PANDUAN_VERSI_4.md`](file:///f:/rekap-ekskul-appscript/versi-4/PANDUAN_VERSI_4.md)
- **Paket Siap Pasang Cepat:** [`f:\rekap-ekskul-appscript\siap-pasang\`](file:///f:/rekap-ekskul-appscript/siap-pasang/)
- **Arsip Versi Sebelumnya:**
  - Versi 3.0: [`f:\rekap-ekskul-appscript\versi-3\`](file:///f:/rekap-ekskul-appscript/versi-3/)
  - Versi 2.0: [`f:\rekap-ekskul-appscript\versi-2\`](file:///f:/rekap-ekskul-appscript/versi-2/)
  - Versi 1.0: [`f:\rekap-ekskul-appscript\versi-1\`](file:///f:/rekap-ekskul-appscript/versi-1/)
