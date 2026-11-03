@echo off
chcp 65001 >nul
cls
echo ==========================================================
echo   🚀 PANDUAN CEPAT UPLOAD KE GITHUB & VERCEL
echo   Aplikasi Rekapitulasi Presensi Ekstrakurikuler V4.0
echo ==========================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [PERHATIAN] Git belum terdeteksi di Command Line komputer Anda.
    echo.
    echo Silakan pilih salah satu cara termudah berikut:
    echo 1. Unduh & install Git resmi: https://git-scm.com/download/win
    echo    (Setelah install, buka ulang jendela terminal ini)
    echo.
    echo 2. ATAU gunakan GitHub Desktop (sangat mudah dengan tampilan visual):
    echo    https://desktop.github.com/
    echo    - Buka GitHub Desktop
    echo    - File ^> Add Local Repository ^> Pilih folder: %~dp0
    echo    - Klik "Publish repository" ke GitHub Anda!
    echo.
    pause
    exit /b
)

echo [1/4] Memeriksa status repositori Git lokal...
if not exist "%~dp0.git" (
    echo Inisialisasi Git repository...
    git init
    git branch -M main
)

echo [2/4] Menambahkan semua file ke Git...
git add .

echo [3/4] Membuat commit...
git commit -m "feat: Rekap Presensi Ekskul V4.0 siap deploy ke Vercel" >nul 2>nul

echo [4/4] Konfigurasi Remote GitHub...
set /p REPO_URL="Masukkan URL Repositori GitHub Anda (contoh: https://github.com/username/rekap-ekskul.git): "

if "%REPO_URL%"=="" (
    echo.
    echo URL Repositori kosong. Silakan jalankan script ini kembali setelah membuat repositori di GitHub.
    pause
    exit /b
)

git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%

echo.
echo Sedang melakukan upload (push) ke GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================================
    echo   BERHASIL UPLOAD KE GITHUB!
    echo ==========================================================
    echo Langkah selanjutnya untuk deploy ke Vercel:
    echo 1. Buka https://vercel.com
    echo 2. Login dengan akun GitHub Anda.
    echo 3. Klik tombol "Add New..." ^> "Project"
    echo 4. Pilih repositori GitHub yang baru saja Anda upload.
    echo 5. Framework Preset: Pilih "Other" (biarkan default).
    echo 6. Klik "Deploy". Selesai dalam hitungan detik!
    echo ==========================================================
) else (
    echo.
    echo [Gagal Push] Pastikan URL repositori benar dan Anda sudah login ke akun GitHub Anda.
)

pause
