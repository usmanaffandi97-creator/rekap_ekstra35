# Script PowerShell untuk Upload ke GitHub & Deploy ke Vercel
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🚀 PANDUAN CEPAT UPLOAD KE GITHUB & VERCEL" -ForegroundColor Yellow
Write-Host "  Aplikasi Rekapitulasi Presensi Ekstrakurikuler V4.0" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
    Write-Host "[PERHATIAN] Git belum terpasang atau belum masuk dalam PATH sistem." -ForegroundColor Red
    Write-Host ""
    Write-Host "Pilihan solusi termudah:" -ForegroundColor Yellow
    Write-Host "1. Unduh Git: https://git-scm.com/download/win"
    Write-Host "2. Atau gunakan GitHub Desktop: https://desktop.github.com"
    Write-Host "   (File > Add Local Repository > Pilih folder ini > Klik Publish Repository)"
    Write-Host ""
    Read-Host "Tekan Enter untuk keluar"
    exit
}

$repoPath = $PSScriptRoot
Set-Location $repoPath

if (-not (Test-Path "$repoPath\.git")) {
    Write-Host "[1/4] Inisialisasi Git lokal..." -ForegroundColor Green
    git init
    git branch -M main
} else {
    Write-Host "[1/4] Repositori Git lokal sudah aktif." -ForegroundColor Green
}

Write-Host "[2/4] Menambahkan file ke Git..." -ForegroundColor Green
git add .

Write-Host "[3/4] Membuat commit..." -ForegroundColor Green
git commit -m "feat: Rekap Presensi Ekskul V4.0 siap deploy ke Vercel" 2>$null

Write-Host "[4/4] Konfigurasi Remote GitHub..." -ForegroundColor Green
$repoUrl = Read-Host "Masukkan URL Repositori GitHub Anda (contoh: https://github.com/username/rekap-ekskul.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "URL Repositori kosong. Silakan jalankan script kembali setelah membuat repo di GitHub." -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit
}

git remote remove origin 2>$null
git remote add origin $repoUrl.Trim()

Write-Host "`nSedang melakukan push ke GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host "  BERHASIL UPLOAD KE GITHUB! 🎉" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "Langkah selanjutnya untuk deploy ke Vercel:" -ForegroundColor Cyan
    Write-Host "1. Buka https://vercel.com lalu login dengan akun GitHub Anda."
    Write-Host "2. Klik 'Add New...' > 'Project'"
    Write-Host "3. Pilih repositori GitHub Anda lalu klik 'Import'."
    Write-Host "4. Framework Preset: pilih 'Other' (biarkan setting default)."
    Write-Host "5. Klik tombol 'Deploy'. Selesai!"
} else {
    Write-Host "`n[Gagal Push] Pastikan URL repositori benar dan kredensial GitHub Anda valid." -ForegroundColor Red
}

Read-Host "`nTekan Enter untuk selesai"
