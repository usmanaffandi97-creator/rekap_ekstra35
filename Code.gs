// ============================================================
// SISTEM REKAP KETIDAKHADIRAN EKSTRAKURIKULER — VERSI 4.0
// Multi-User Dedicated Accounts: Setiap Pelatih & Wali Kelas
// Memiliki Username & Password Sendiri Terikat Cabang / Kelas Binaan.
// Fitur: Portal Siswa, Pendaftaran Mandiri, Buka/Tutup Ekskul,
// Filter Peserta Terdaftar, Role-Specific Dashboard, & Mobile UX.
// ============================================================

/**
 * PENGATURAN SPREADSHEET (OTOMATIS / AUTO-DETECT)
 * Jika Apps Script dibuat dari Google Sheets (Ekstensi -> Apps Script),
 * variabel SPREADSHEET_ID tidak perlu diubah karena sistem otomatis mendeteksi sheet aktif Anda.
 */
var SPREADSHEET_ID = '1d7Gm08DhSTx1pphGaz265XcjkQk2-_rASojkIRWsIJ0';

var SHEET = {
  USERS:         'Users',
  KELAS:         'Kelas',
  EKSKUL:        'Ekskul',
  SISWA:         'Siswa',
  KEIKUTSERTAAN: 'Keikutsertaan',
  ABSENSI:       'Absensi'
};

var SHEET_CONFIG = '_Config';

// ============================================================
// WEB APP & SPREADSHEET ENTRY POINTS (HYBRID: NATIVE & EXTERNAL REST API)
// ============================================================
function doGet(e) {
  // 1. Dukungan API eksternal via GET (Vercel / curl / test ping)
  if (e && e.parameter && e.parameter.action) {
    var getArgs = [];
    if (e.parameter.args) {
      try { getArgs = JSON.parse(e.parameter.args); } catch(err) { getArgs = []; }
    }
    return handleApiRequest(e.parameter.action, getArgs);
  }

  // 2. Tampilan Native Web App jika dibuka langsung dari script.google.com
  try {
    initSheetsIfMissing();
  } catch(err) {
    console.warn('Auto-init info:', err);
  }

  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Rekap Presensi Ekskul v4.0 — Multi-User Dedicated')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var payload = {};
    try { payload = JSON.parse(raw); } catch(pErr) { payload = {}; }
    var action = payload.action || (e && e.parameter && e.parameter.action);
    var args = payload.args || [];
    return handleApiRequest(action, args);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message || String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleApiRequest(action, args) {
  try {
    initSheetsIfMissing();
    args = args || [];

    if (action === 'ping') {
      var ss = getSpreadsheet();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: {
          status: 'ok',
          message: 'Koneksi ke Google Apps Script Berhasil!',
          version: '4.0',
          spreadsheetName: ss ? ss.getName() : 'Google Sheets',
          timestamp: new Date().toISOString()
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var handlers = {
      login: login,
      getAppConfigServer: getAppConfigServer,
      saveAppConfigServer: saveAppConfigServer,
      resetAppConfigServer: resetAppConfigServer,
      getAllData: getAllData,
      getUsers: getUsers,
      addUser: addUser,
      updateUser: updateUser,
      removeUser: removeUser,
      changeUserPassword: changeUserPassword,
      getSiswa: getSiswa,
      addSiswa: addSiswa,
      updateSiswa: updateSiswa,
      removeSiswa: removeSiswa,
      importSiswa: importSiswa,
      getEkskul: getEkskul,
      addEkskul: addEkskul,
      updateEkskul: updateEkskul,
      removeEkskul: removeEkskul,
      toggleBukaEkskul: toggleBukaEkskul,
      setAllBukaEkskul: setAllBukaEkskul,
      getKeikutsertaan: getKeikutsertaan,
      daftarEkskul: daftarEkskul,
      batalEkskul: batalEkskul,
      adminAddPeserta: adminAddPeserta,
      adminRemovePeserta: adminRemovePeserta,
      getSessionAbsensi: getSessionAbsensi,
      saveAbsensi: saveAbsensi,
      getLaporanKelas: getLaporanKelas,
      getRekapPresensiSiswa: getRekapPresensiSiswa,
      exportCsvKelas: exportCsvKelas,
      exportCsvEkskul: exportCsvEkskul
    };

    if (typeof handlers[action] === 'function') {
      var result = handlers[action].apply(null, args);
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Aksi API tidak ditemukan: ' + action }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message || String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('⚡ Rekap Ekskul v4.0')
      .addItem('🚀 Setup / Inisialisasi Database', 'setupSheets')
      .addItem('⚡ Perbaiki Angka 0 di Depan NIS/NISN (Auto-Fix)', 'menuRepairNisn')
      .addSeparator()
      .addItem('ℹ️ Petunjuk Akun Khusus Pelatih & Wali', 'showPetunjukDialog')
      .addToUi();
  } catch(e) {
    console.log('onOpen berjalan di luar konteks Spreadsheet UI');
  }
}

function showPetunjukDialog() {
  var ui = SpreadsheetApp.getUi();
  ui.alert(
    '⚡ Rekap Ekskul v4.0 — Akun Mandiri Setiap Pelatih & Wali Kelas',
    'Setiap pelatih dan wali kelas memiliki akun tersendiri:\n\n' +
    '🔑 Akun Pelatih Ekskul (Password: 123):\n' +
    '• Pramuka: pelatih_pramuka (Kak Budi Santoso)\n' +
    '• Futsal: pelatih_futsal (Coach Doni Hermawan)\n' +
    '• Basket: pelatih_basket (Coach Michael Wijaya)\n' +
    '• Paduan Suara: pelatih_padus (Ibu Ratna Sari, S.Sn.)\n' +
    '• PMR: pelatih_pmr (dr. Hendra Pratama)\n' +
    '• Koordinator: pelatih (Akses Universal Seluruh Ekskul)\n\n' +
    '🔑 Akun Wali Kelas (Password: 123):\n' +
    '• Kelas 7A: wali_7a (Ibu Siti Rahayu, S.Pd.)\n' +
    '• Kelas 7B: wali_7b (Bapak Ahmad Dahlan, M.Pd.)\n' +
    '• Kelas 8A: wali_8a (Ibu Nurul Hidayah, S.Pd.)\n' +
    '• Kelas 8B: wali_8b (Bapak Bambang Sutrisno, S.Pd.)\n' +
    '• Kelas 9A: wali_9a (Ibu Sri Wahyuni, M.Pd.)\n' +
    '• Kelas 9B: wali_9b (Bapak Agus Prasetyo, S.Pd.)\n' +
    '• Koordinator: walikelas (Akses Universal Seluruh Kelas)\n\n' +
    '🔑 Akun Lainnya:\n' +
    '• Admin: admin / admin123\n' +
    '• Siswa: Gunakan NIS masing-masing / password: 123',
    ui.ButtonSet.OK
  );
}

// ============================================================
// DATABASE & AUTO-DETECTION SPREADSHEET
// ============================================================
function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '' && SPREADSHEET_ID !== 'ISI_SPREADSHEET_ID_ANDA_DI_SINI') {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch(err) {
      console.warn('Gagal openById, mencoba getActiveSpreadsheet:', err);
    }
  }

  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch(e) {}

  try {
    var props = PropertiesService.getScriptProperties();
    var savedId = props.getProperty('AUTO_SPREADSHEET_ID_V4');
    if (savedId) {
      try { return SpreadsheetApp.openById(savedId); } catch(e){}
    }
    var newSs = SpreadsheetApp.create('Sistem Rekap Ekskul v4 — Database');
    props.setProperty('AUTO_SPREADSHEET_ID_V4', newSs.getId());
    return newSs;
  } catch(e) {
    throw new Error('Tidak dapat menemukan atau membuat Google Spreadsheet: ' + e.message);
  }
}

function getSheet(name) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function formatNisn(val) {
  if (val === null || val === undefined) return '';
  var str = String(val).trim();
  if (str.startsWith("'")) str = str.substring(1).trim();
  str = str.replace(/\.0+$/, '').replace(/[^0-9]/g, '');
  if (!str) return '';
  if (str.length >= 7 && str.length < 10) {
    str = ('0000000000' + str).slice(-10);
  }
  return str;
}

function menuRepairNisn() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(SHEET.SISWA);
    if (!sheet || sheet.getLastRow() < 2) {
      SpreadsheetApp.getUi().alert('Tabel Siswa masih kosong.');
      return;
    }
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nisCol = findColIndex(headers, 'nis');
    if (nisCol === -1) {
      SpreadsheetApp.getUi().alert('Kolom NIS tidak ditemukan.');
      return;
    }
    sheet.getRange(2, nisCol + 1, sheet.getLastRow() - 1, 1).setNumberFormat("@");
    var values = sheet.getRange(2, nisCol + 1, sheet.getLastRow() - 1, 1).getValues();
    var fixedCount = 0;
    for (var i = 0; i < values.length; i++) {
      var raw = values[i][0];
      var fixed = formatNisn(raw);
      if (fixed && fixed !== String(raw)) {
        sheet.getRange(i + 2, nisCol + 1).setValue("'" + fixed);
        fixedCount++;
      }
    }
    SpreadsheetApp.getUi().alert('Selesai! Sebanyak ' + fixedCount + ' data NIS/NISN berhasil dipulihkan angka nol di depannya dan diformat Teks.');
  } catch(e) {
    SpreadsheetApp.getUi().alert('Error: ' + e.message);
  }
}

function cellToString(val, ss) {
  if (val === null || val === undefined) return '';
  if (val instanceof Date) {
    var tz = ss ? ss.getSpreadsheetTimeZone() : 'Asia/Jakarta';
    return Utilities.formatDate(val, tz, 'yyyy-MM-dd');
  }
  return String(val);
}

function normalizeKey(k) {
  return String(k || '')
    .trim()
    .replace(/^["']+|["']+$/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function findColIndex(headers, fieldName) {
  var target = normalizeKey(fieldName);
  for (var i = 0; i < headers.length; i++) {
    if (normalizeKey(headers[i]) === target) return i;
  }
  return -1;
}

function sheetToObjects(name) {
  var sheet = getSheet(name);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0].map(function(h) {
    return String(h).trim().replace(/^["']+|["']+$/g, '');
  });
  var ss = sheet.getParent();
  var result = [];

  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var isEmpty = row.every(function(cell) {
      return cell === '' || cell === null || cell === undefined;
    });
    if (isEmpty) continue;

    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var h = headers[c];
      if (h) {
        obj[h] = cellToString(row[c], ss);
      }
    }
    result.push(obj);
  }
  return result;
}

function appendRow(name, obj) {
  var sheet = getSheet(name);
  var headers = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
  var newRow = [];
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i];
    var val = (obj[h] !== undefined && obj[h] !== null) ? obj[h] : '';
    newRow.push(val);
  }
  sheet.appendRow(newRow);
}

function updateRow(name, keyField, keyValue, updated) {
  var sheet = getSheet(name);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return;

  var headers = data[0];
  var keyCol = findColIndex(headers, keyField);
  if (keyCol === -1) return;

  var ss = sheet.getParent();
  for (var r = 1; r < data.length; r++) {
    var currentKey = cellToString(data[r][keyCol], ss);
    if (currentKey === String(keyValue)) {
      for (var k in updated) {
        var col = findColIndex(headers, k);
        if (col !== -1) {
          sheet.getRange(r + 1, col + 1).setValue(updated[k]);
        }
      }
      return;
    }
  }
}

function deleteRows(name, keyField, keyValue) {
  var sheet = getSheet(name);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return;

  var headers = data[0];
  var keyCol = findColIndex(headers, keyField);
  if (keyCol === -1) return;

  var ss = sheet.getParent();
  for (var r = data.length - 1; r >= 1; r--) {
    if (cellToString(data[r][keyCol], ss) === String(keyValue)) {
      sheet.deleteRow(r + 1);
    }
  }
}

function deleteRowsMulti(name, conditions) {
  var sheet = getSheet(name);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return;

  var headers = data[0];
  var ss = sheet.getParent();
  var colMap = {};
  for (var k in conditions) {
    colMap[k] = findColIndex(headers, k);
  }

  for (var r = data.length - 1; r >= 1; r--) {
    var match = true;
    for (var fld in conditions) {
      var col = colMap[fld];
      if (col === -1 || cellToString(data[r][col], ss) !== String(conditions[fld])) {
        match = false;
        break;
      }
    }
    if (match) {
      sheet.deleteRow(r + 1);
    }
  }
}

function genId() {
  return Utilities.getUuid().substring(0, 8);
}

// ============================================================
// AUTO SETUP & INISIALISASI SHEET VERSI 4.0
// ============================================================
function initSheetsIfMissing() {
  var ss = getSpreadsheet();
  var usersSheet = ss.getSheetByName(SHEET.USERS);
  if (!usersSheet || usersSheet.getLastRow() < 2) {
    setupSheetsInternal(ss, false);
  }
}

function setupSheets() {
  var ss = getSpreadsheet();
  setupSheetsInternal(ss, true);
  return '✅ Setup Versi 4.0 Berhasil! Database multi-user siap digunakan.';
}

function setupSheetsInternal(ss, forceReset) {
  var schema = [
    {
      name: SHEET.USERS,
      headers: ['id', 'username', 'password', 'name', 'role', 'ekskulId', 'kelasId', 'siswaId'],
      defaults: [
        // 1. Administrator
        ['u1', 'admin', 'admin123', 'Administrator', 'admin', '', '', ''],

        // 2. Akun Mandiri Setiap Pelatih Ekskul
        ['u_pel_1', 'pelatih_pramuka', '123', 'Kak Budi Santoso',        'pelatih', 'e1', '', ''],
        ['u_pel_2', 'pelatih_futsal',  '123', 'Coach Doni Hermawan',      'pelatih', 'e2', '', ''],
        ['u_pel_3', 'pelatih_basket',  '123', 'Coach Michael Wijaya',     'pelatih', 'e3', '', ''],
        ['u_pel_4', 'pelatih_padus',   '123', 'Ibu Ratna Sari, S.Sn.',    'pelatih', 'e4', '', ''],
        ['u_pel_5', 'pelatih_pmr',     '123', 'dr. Hendra Pratama',       'pelatih', 'e5', '', ''],
        ['u_pel_all','pelatih',        '123', 'Koordinator Pelatih',      'pelatih', '',   '', ''],

        // 3. Akun Mandiri Setiap Wali Kelas
        ['u_wali_7a', 'wali_7a',   '123', 'Ibu Siti Rahayu, S.Pd.',       'walikelas', '', 'k1', ''],
        ['u_wali_7b', 'wali_7b',   '123', 'Bapak Ahmad Dahlan, M.Pd.',    'walikelas', '', 'k2', ''],
        ['u_wali_8a', 'wali_8a',   '123', 'Ibu Nurul Hidayah, S.Pd.',     'walikelas', '', 'k3', ''],
        ['u_wali_8b', 'wali_8b',   '123', 'Bapak Bambang Sutrisno, S.Pd.','walikelas', '', 'k4', ''],
        ['u_wali_9a', 'wali_9a',   '123', 'Ibu Sri Wahyuni, M.Pd.',       'walikelas', '', 'k5', ''],
        ['u_wali_9b', 'wali_9b',   '123', 'Bapak Agus Prasetyo, S.Pd.',   'walikelas', '', 'k6', ''],
        ['u_wali_all','walikelas', '123', 'Koordinator Wali Kelas',       'walikelas', '', '',   ''],

        // 4. Contoh Akun Siswa (Siswa dapat login langsung via NIS)
        ['u_s1', '2024001', '123', 'Ahmad Fauzi',    'siswa', '', 'k1', 's1'],
        ['u_s2', '2024002', '123', 'Bella Agustina', 'siswa', '', 'k1', 's2']
      ]
    },
    {
      name: SHEET.KELAS,
      headers: ['id', 'name', 'tingkat'],
      defaults: [
        ['k1', 'Kelas 7A', '7'],
        ['k2', 'Kelas 7B', '7'],
        ['k3', 'Kelas 8A', '8'],
        ['k4', 'Kelas 8B', '8'],
        ['k5', 'Kelas 9A', '9'],
        ['k6', 'Kelas 9B', '9']
      ]
    },
    {
      name: SHEET.EKSKUL,
      headers: ['id', 'name', 'hari', 'jam', 'isBuka', 'kuota', 'deskripsi'],
      defaults: [
        ['e1', 'Pramuka',      'Jumat', '15:00 - 17:00', 'BUKA', '50', 'Kepramukaan, pembentukan karakter, kepemimpinan, dan bakti lingkungan.'],
        ['e2', 'Futsal',       'Sabtu', '08:00 - 10:00', 'BUKA', '30', 'Latihan fisik, teknik olah bola, strategi futsal, dan turnamen antar sekolah.'],
        ['e3', 'Basket',       'Selasa','15:30 - 17:00', 'BUKA', '30', 'Latihan dribble, tembakan akurat, pertahanan tim, dan kebugaran jasmani.'],
        ['e4', 'Paduan Suara', 'Kamis', '14:00 - 15:30', 'BUKA', '40', 'Pelatihan olah vokal, harmonisasi paduan suara, dan persiapan konser seni.'],
        ['e5', 'PMR',          'Rabu',  '15:00 - 16:30', 'BUKA', '35', 'Pertolongan pertama, donor darah remaja, dan kesiapsiagaan tanggap darurat.']
      ]
    },
    {
      name: SHEET.SISWA,
      headers: ['id', 'nama', 'kelasId', 'nis'],
      defaults: [
        ['s1',  'Ahmad Fauzi',   'k1', '2024001'],
        ['s2',  'Bella Agustina', 'k1', '2024002'],
        ['s3',  'Citra Dewi',    'k2', '2024003'],
        ['s4',  'Doni Setiawan', 'k2', '2024004'],
        ['s5',  'Rizky Pratama', 'k3', '2024005'],
        ['s6',  'Siti Rahma',    'k3', '2024006'],
        ['s7',  'Kevin Sanjaya', 'k4', '2024007'],
        ['s8',  'Larasati',      'k4', '2024008'],
        ['s9',  'Wahyu Hidayat', 'k5', '2024009'],
        ['s10', 'Zahra Amalia',  'k5', '2024010'],
        ['s11', 'Budi Santoso',  'k6', '2024011'],
        ['s12', 'Putri Indah',   'k6', '2024012']
      ]
    },
    {
      name: SHEET.KEIKUTSERTAAN,
      headers: ['id', 'siswaId', 'ekskulId', 'tanggalDaftar'],
      defaults: [
        ['reg1',  's1',  'e1', '2026-09-01'],
        ['reg2',  's1',  'e2', '2026-09-01'],
        ['reg3',  's2',  'e5', '2026-09-01'],
        ['reg4',  's2',  'e4', '2026-09-02'],
        ['reg5',  's3',  'e3', '2026-09-01'],
        ['reg6',  's3',  'e1', '2026-09-02'],
        ['reg7',  's4',  'e2', '2026-09-01'],
        ['reg8',  's5',  'e2', '2026-09-01'],
        ['reg9',  's5',  'e3', '2026-09-02'],
        ['reg10', 's6',  'e5', '2026-09-01'],
        ['reg11', 's7',  'e3', '2026-09-01'],
        ['reg12', 's7',  'e1', '2026-09-02'],
        ['reg13', 's8',  'e4', '2026-09-01'],
        ['reg14', 's9',  'e1', '2026-09-01'],
        ['reg15', 's9',  'e2', '2026-09-02'],
        ['reg16', 's10', 'e5', '2026-09-01'],
        ['reg17', 's10', 'e3', '2026-09-02'],
        ['reg18', 's11', 'e2', '2026-09-01'],
        ['reg19', 's12', 'e4', '2026-09-01'],
        ['reg20', 's12', 'e1', '2026-09-02']
      ]
    },
    {
      name: SHEET.ABSENSI,
      headers: ['id', 'ekskulId', 'tanggal', 'siswaId', 'status', 'keterangan'],
      defaults: [
        ['a1', 'e1', '2026-10-04', 's1', 'sakit', 'Demam tinggi'],
        ['a2', 'e1', '2026-10-11', 's1', 'alpha', 'Tanpa keterangan'],
        ['a3', 'e1', '2026-10-11', 's3', 'izin',  'Acara keluarga'],
        ['a4', 'e2', '2026-10-06', 's1', 'izin',  'Urusan keluarga'],
        ['a5', 'e2', '2026-10-06', 's5', 'sakit', 'Kaki terkilir'],
        ['a6', 'e2', '2026-10-13', 's4', 'alpha', 'Tanpa keterangan'],
        ['a7', 'e3', '2026-10-08', 's7', 'sakit', 'Flu & demam'],
        ['a8', 'e4', '2026-10-10', 's12','izin',  'Lomba eksternal'],
        ['a9', 'e5', '2026-10-07', 's2', 'izin',  'Piknik keluarga']
      ]
    }
  ];

  schema.forEach(function(sc) {
    var sh = ss.getSheetByName(sc.name);
    if (!sh) {
      sh = ss.insertSheet(sc.name);
      forceReset = true;
    }
    if (forceReset || sh.getLastRow() === 0) {
      sh.clear();
      sh.appendRow(sc.headers);
      if (sc.defaults && sc.defaults.length > 0) {
        var rng = sh.getRange(2, 1, sc.defaults.length, sc.headers.length);
        rng.setValues(sc.defaults);
      }
      sh.getRange(1, 1, 1, sc.headers.length).setFontWeight('bold');
    }
  });

  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }
}

// ============================================================
// LOGIN & AUTENTIKASI MULTI-USER
// ============================================================
function login(username, password) {
  initSheetsIfMissing();
  var u = String(username || '').trim().toLowerCase();
  var p = String(password || '').trim();

  // 1. Cek di tabel Users (Admin, Pelatih Spesifik, Wali Kelas Spesifik)
  var allUsers = sheetToObjects(SHEET.USERS);
  for (var i = 0; i < allUsers.length; i++) {
    var user = allUsers[i];
    var userU = String(user.username || user.Username || '').trim().toLowerCase();
    var userP = String(user.password || user.Password || '').trim();
    if (userU === u && userP === p) {
      return {
        success: true,
        user: {
          id: user.id || user.ID || genId(),
          username: userU,
          name: user.name || user.Name || userU,
          role: user.role || user.Role || 'pelatih',
          ekskulId: user.ekskulId || user.EkskulId || '',
          kelasId: user.kelasId || user.KelasId || '',
          siswaId: user.siswaId || user.SiswaId || ''
        }
      };
    }
  }

  // 1b. Fallback: Cek daftar akun default Versi 4 (jika tabel users belum di-setupSheets)
  var defaultUsers = [
    { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin', ekskulId: '', kelasId: '' },
    { username: 'pelatih_pramuka', password: '123', name: 'Kak Budi Santoso', role: 'pelatih', ekskulId: 'e1', kelasId: '' },
    { username: 'pelatih_futsal',  password: '123', name: 'Coach Doni Hermawan', role: 'pelatih', ekskulId: 'e2', kelasId: '' },
    { username: 'pelatih_basket',  password: '123', name: 'Coach Michael Wijaya', role: 'pelatih', ekskulId: 'e3', kelasId: '' },
    { username: 'pelatih_padus',   password: '123', name: 'Ibu Ratna Sari, S.Sn.', role: 'pelatih', ekskulId: 'e4', kelasId: '' },
    { username: 'pelatih_pmr',     password: '123', name: 'dr. Hendra Pratama', role: 'pelatih', ekskulId: 'e5', kelasId: '' },
    { username: 'pelatih',        password: '123', name: 'Koordinator Pelatih', role: 'pelatih', ekskulId: '', kelasId: '' },
    { username: 'wali_7a', password: '123', name: 'Ibu Siti Rahayu, S.Pd.', role: 'walikelas', ekskulId: '', kelasId: 'k1' },
    { username: 'wali_7b', password: '123', name: 'Bapak Ahmad Dahlan, M.Pd.', role: 'walikelas', ekskulId: '', kelasId: 'k2' },
    { username: 'wali_8a', password: '123', name: 'Ibu Nurul Hidayah, S.Pd.', role: 'walikelas', ekskulId: '', kelasId: 'k3' },
    { username: 'wali_8b', password: '123', name: 'Bapak Bambang Sutrisno, S.Pd.', role: 'walikelas', ekskulId: '', kelasId: 'k4' },
    { username: 'wali_9a', password: '123', name: 'Ibu Sri Wahyuni, M.Pd.', role: 'walikelas', ekskulId: '', kelasId: 'k5' },
    { username: 'wali_9b', password: '123', name: 'Bapak Agus Prasetyo, S.Pd.', role: 'walikelas', ekskulId: '', kelasId: 'k6' },
    { username: 'walikelas', password: '123', name: 'Koordinator Wali Kelas', role: 'walikelas', ekskulId: '', kelasId: '' }
  ];
  for (var d = 0; d < defaultUsers.length; d++) {
    var du = defaultUsers[d];
    if (du.username === u && du.password === p) {
      try {
        appendRow(SHEET.USERS, {
          id: 'u_' + du.username,
          username: du.username,
          password: du.password,
          name: du.name,
          role: du.role,
          ekskulId: du.ekskulId || '',
          kelasId: du.kelasId || '',
          siswaId: ''
        });
      } catch(err) {}
      return {
        success: true,
        user: {
          id: 'u_' + du.username,
          username: du.username,
          name: du.name,
          role: du.role,
          ekskulId: du.ekskulId || '',
          kelasId: du.kelasId || '',
          siswaId: ''
        }
      };
    }
  }

  // 2. Cek di tabel Siswa (Login Siswa via NIS/NISN, toleran terhadap angka 0 di depan)
  var allSiswa = sheetToObjects(SHEET.SISWA);
  var cleanU = formatNisn(u) || u;
  for (var j = 0; j < allSiswa.length; j++) {
    var s = allSiswa[j];
    var sNis = formatNisn(s.nis) || String(s.nis).trim();
    if (sNis.toLowerCase() === cleanU || String(s.nis).trim().toLowerCase() === u) {
      if (p === '123' || p === String(s.nis).trim() || p === sNis) {
        return {
          success: true,
          user: {
            id: s.id,
            username: sNis,
            name: s.nama,
            role: 'siswa',
            ekskulId: '',
            kelasId: resolveKelasIdServer(s.kelasId),
            siswaId: s.id,
            nis: sNis
          }
        };
      }
    }
  }

  return { success: false, message: 'Username/NIS atau password salah!' };
}

// ============================================================
// PENGATURAN LOGO & IDENTITAS SEKOLAH (PERSISTENSI SPREADSHEET)
// ============================================================
function getAppConfigServer() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_CONFIG);
    if (!sheet || sheet.getLastRow() < 2) return null;
    var data = sheet.getDataRange().getValues();
    var cfg = {};
    var foundAny = false;
    for (var i = 1; i < data.length; i++) {
      var k = String(data[i][0] || '').trim();
      var v = data[i][1];
      if (k) {
        cfg[k] = cellToString(v, ss);
        foundAny = true;
      }
    }
    return foundAny ? cfg : null;
  } catch(e) {
    console.warn('Gagal membaca config server:', e);
    return null;
  }
}

function saveAppConfigServer(cfg) {
  try {
    if (!cfg || typeof cfg !== 'object') return { success: false, message: 'Invalid config' };
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_CONFIG);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_CONFIG);
      sheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
    }

    var data = sheet.getDataRange().getValues();
    var keyRowMap = {};
    for (var i = 1; i < data.length; i++) {
      keyRowMap[String(data[i][0]).trim()] = i + 1;
    }

    for (var key in cfg) {
      if (!cfg.hasOwnProperty(key)) continue;
      var val = String(cfg[key] || '');
      if (keyRowMap[key]) {
        sheet.getRange(keyRowMap[key], 2).setValue(val);
      } else {
        sheet.appendRow([key, val]);
        keyRowMap[key] = sheet.getLastRow();
      }
    }
    return { success: true };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

function resetAppConfigServer() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_CONFIG);
    if (sheet) {
      sheet.clearContents();
      sheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
    }
    return { success: true };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

function getAllData() {
  initSheetsIfMissing();
  return {
    users:         sheetToObjects(SHEET.USERS),
    kelas:         sheetToObjects(SHEET.KELAS),
    ekskul:        sheetToObjects(SHEET.EKSKUL),
    siswa:         sheetToObjects(SHEET.SISWA),
    keikutsertaan: sheetToObjects(SHEET.KEIKUTSERTAAN),
    absensi:       sheetToObjects(SHEET.ABSENSI),
    appConfig:     getAppConfigServer()
  };
}

// ============================================================
// MANAJEMEN AKUN PENGGUNA (PELATIH & WALI KELAS OLEH ADMIN)
// ============================================================
function getUsers() {
  return sheetToObjects(SHEET.USERS);
}

function addUser(data) {
  var id = genId();
  data.id = id;
  appendRow(SHEET.USERS, data);
  return { success: true, id: id };
}

function updateUser(data) {
  updateRow(SHEET.USERS, 'id', data.id, data);
  return { success: true };
}

function removeUser(id) {
  deleteRows(SHEET.USERS, 'id', id);
  return { success: true };
}

function changeUserPassword(id, newPass) {
  updateRow(SHEET.USERS, 'id', id, { password: newPass });
  return { success: true };
}

// ============================================================
// MANAJEMEN DATA SISWA & EKSKUL
// ============================================================
function getSiswa() { return sheetToObjects(SHEET.SISWA); }

function addSiswa(data) {
  var id = genId();
  data.id = id;
  appendRow(SHEET.SISWA, data);
  return { success: true, id: id };
}

function updateSiswa(data) {
  updateRow(SHEET.SISWA, 'id', data.id, data);
  return { success: true };
}

function removeSiswa(id) {
  deleteRows(SHEET.SISWA, 'id', id);
  deleteRows(SHEET.ABSENSI, 'siswaId', id);
  deleteRows(SHEET.KEIKUTSERTAAN, 'siswaId', id);
  deleteRows(SHEET.USERS, 'siswaId', id);
  return { success: true };
}

function importSiswa(rows) {
  var count = 0;
  rows.forEach(function(r) {
    r.id = genId();
    appendRow(SHEET.SISWA, r);
    count++;
  });
  return { success: true, count: count };
}

function getEkskul() { return sheetToObjects(SHEET.EKSKUL); }

function addEkskul(data) {
  var id = genId();
  data.id = id;
  if (!data.isBuka) data.isBuka = 'BUKA';
  appendRow(SHEET.EKSKUL, data);
  return { success: true, id: id };
}

function updateEkskul(data) {
  updateRow(SHEET.EKSKUL, 'id', data.id, data);
  return { success: true };
}

function removeEkskul(id) {
  deleteRows(SHEET.EKSKUL, 'id', id);
  deleteRows(SHEET.ABSENSI, 'ekskulId', id);
  deleteRows(SHEET.KEIKUTSERTAAN, 'ekskulId', id);
  return { success: true };
}

function toggleBukaEkskul(ekskulId, status) {
  var stat = (status === 'BUKA' || status === true) ? 'BUKA' : 'TUTUP';
  updateRow(SHEET.EKSKUL, 'id', ekskulId, { isBuka: stat });
  return { success: true, isBuka: stat };
}

function setAllBukaEkskul(status) {
  var stat = (status === 'BUKA' || status === true) ? 'BUKA' : 'TUTUP';
  var list = sheetToObjects(SHEET.EKSKUL);
  list.forEach(function(e) {
    updateRow(SHEET.EKSKUL, 'id', e.id, { isBuka: stat });
  });
  return { success: true, isBuka: stat };
}

// ============================================================
// MANAJEMEN KEIKUTSERTAAN SISWA
// ============================================================
function getKeikutsertaan() { return sheetToObjects(SHEET.KEIKUTSERTAAN); }

function daftarEkskul(siswaId, ekskulId, isAdmin) {
  var allEkskul = sheetToObjects(SHEET.EKSKUL);
  var targetE = allEkskul.find(function(e){ return e.id === ekskulId; });
  if (!targetE) return { success: false, message: 'Ekskul tidak ditemukan!' };

  if (!isAdmin && (targetE.isBuka || 'BUKA').toUpperCase() !== 'BUKA') {
    return { success: false, message: 'Pendaftaran ekskul ' + targetE.name + ' sedang DITUTUP oleh Admin.' };
  }

  var allReg = sheetToObjects(SHEET.KEIKUTSERTAAN);
  var already = allReg.some(function(r){ return r.siswaId === siswaId && r.ekskulId === ekskulId; });
  if (already) {
    return { success: false, message: 'Siswa sudah terdaftar di cabang ekskul ini.' };
  }

  var id = genId();
  var tz = getSpreadsheet().getSpreadsheetTimeZone() || 'Asia/Jakarta';
  var tgl = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

  appendRow(SHEET.KEIKUTSERTAAN, {
    id: id,
    siswaId: siswaId,
    ekskulId: ekskulId,
    tanggalDaftar: tgl
  });

  return { success: true, id: id };
}

function batalEkskul(siswaId, ekskulId, isAdmin) {
  var allEkskul = sheetToObjects(SHEET.EKSKUL);
  var targetE = allEkskul.find(function(e){ return e.id === ekskulId; });

  if (!isAdmin && targetE && (targetE.isBuka || 'BUKA').toUpperCase() !== 'BUKA') {
    return { success: false, message: 'Pendaftaran sudah ditutup. Siswa tidak dapat membatalkan pendaftaran mandiri.' };
  }

  deleteRowsMulti(SHEET.KEIKUTSERTAAN, { siswaId: siswaId, ekskulId: ekskulId });
  return { success: true };
}

function adminAddPeserta(ekskulId, siswaIds) {
  if (!Array.isArray(siswaIds)) siswaIds = [siswaIds];
  var allReg = sheetToObjects(SHEET.KEIKUTSERTAAN);
  var count = 0;
  var tz = getSpreadsheet().getSpreadsheetTimeZone() || 'Asia/Jakarta';
  var tgl = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

  siswaIds.forEach(function(sid) {
    var exists = allReg.some(function(r){ return r.siswaId === sid && r.ekskulId === ekskulId; });
    if (!exists) {
      appendRow(SHEET.KEIKUTSERTAAN, {
        id: genId(),
        siswaId: sid,
        ekskulId: ekskulId,
        tanggalDaftar: tgl
      });
      count++;
    }
  });

  return { success: true, added: count };
}

function adminRemovePeserta(ekskulId, siswaId) {
  deleteRowsMulti(SHEET.KEIKUTSERTAAN, { siswaId: siswaId, ekskulId: ekskulId });
  return { success: true };
}

// ============================================================
// MANAJEMEN ABSENSI (PELATIH & ADMIN)
// ============================================================
function getSessionAbsensi(ekskulId, tanggal) {
  var allAbs = sheetToObjects(SHEET.ABSENSI);
  var eid = resolveEkskulIdServer(ekskulId);
  return allAbs.filter(function(a) {
    var rawEid = resolveEkskulIdServer(a.ekskulId);
    return rawEid === eid && a.tanggal === tanggal;
  });
}

function saveAbsensi(ekskulId, tanggal, absenList) {
  var eid = resolveEkskulIdServer(ekskulId);
  deleteRowsMulti(SHEET.ABSENSI, { ekskulId: eid, tanggal: tanggal });

  var count = 0;
  absenList.forEach(function(item) {
    if (item.status && item.status !== 'hadir') {
      appendRow(SHEET.ABSENSI, {
        id: genId(),
        ekskulId: eid,
        tanggal: tanggal,
        siswaId: item.siswaId,
        status: item.status,
        keterangan: item.keterangan || ''
      });
      count++;
    }
  });

  return { success: true, count: count };
}

// ============================================================
// REKAP KETIDAKHADIRAN WALI KELAS & PORTAL SISWA
// ============================================================
function resolveEkskulIdServer(val) {
  if (!val) return '';
  var v = String(val).trim().toLowerCase();
  var allE = sheetToObjects(SHEET.EKSKUL);
  for (var i = 0; i < allE.length; i++) {
    var e = allE[i];
    if (String(e.id).toLowerCase() === v || String(e.name).toLowerCase() === v) return e.id;
  }
  return String(val).trim();
}

function resolveKelasIdServer(val) {
  if (!val) return '';
  var v = String(val).trim().toLowerCase();
  var allK = sheetToObjects(SHEET.KELAS);
  for (var i = 0; i < allK.length; i++) {
    var k = allK[i];
    if (String(k.id).toLowerCase() === v || String(k.name).toLowerCase() === v) return k.id;
  }
  return String(val).trim();
}

function matchKelasServer(valA, valB, allKelas) {
  if (!valA || !valB) return false;
  var a = String(valA).toLowerCase().replace(/\s+/g, '');
  var b = String(valB).toLowerCase().replace(/\s+/g, '');
  if (a === b) return true;

  var kA = allKelas.find(function(k){ return String(k.id).toLowerCase() === a || String(k.name).toLowerCase().replace(/\s+/g, '') === a; });
  var kB = allKelas.find(function(k){ return String(k.id).toLowerCase() === b || String(k.name).toLowerCase().replace(/\s+/g, '') === b; });

  if (kA && kB && kA.id === kB.id) return true;
  if (kA && (String(kA.id).toLowerCase() === b || String(kA.name).toLowerCase().replace(/\s+/g, '') === b)) return true;
  if (kB && (String(kB.id).toLowerCase() === a || String(kB.name).toLowerCase().replace(/\s+/g, '') === a)) return true;
  return false;
}

function getLaporanKelas(kelasId, ekskulId, dari, sampai) {
  var allKelas = sheetToObjects(SHEET.KELAS);
  var allEkskul = sheetToObjects(SHEET.EKSKUL);
  var allSiswa = sheetToObjects(SHEET.SISWA);
  var allAbs = sheetToObjects(SHEET.ABSENSI);

  var targetKid = kelasId ? resolveKelasIdServer(kelasId) : null;
  var eid = ekskulId ? resolveEkskulIdServer(ekskulId) : null;

  var eMap = {};
  allEkskul.forEach(function(e) { eMap[e.id] = e.name; });

  var filteredSiswa = allSiswa.filter(function(s) {
    if (!targetKid) return true;
    return matchKelasServer(s.kelasId, targetKid, allKelas);
  });

  filteredSiswa.sort(function(a, b) {
    return (a.kelasId + a.nama).localeCompare(b.kelasId + b.nama);
  });

  var ekskulTotals = {};

  var rekap = filteredSiswa.map(function(s) {
    var abs = allAbs.filter(function(a) {
      if (a.siswaId !== s.id) return false;
      var rawEid = resolveEkskulIdServer(a.ekskulId);
      if (eid && rawEid !== eid) return false;
      if (dari && a.tanggal < dari) return false;
      if (sampai && a.tanggal > sampai) return false;
      return true;
    });

    var sCount = 0, iCount = 0, aCount = 0;
    var pMap = {};

    abs.forEach(function(a) {
      var st = (a.status || '').toLowerCase();
      if (st === 'sakit') sCount++;
      else if (st === 'izin') iCount++;
      else if (st === 'alpha') aCount++;

      var rawEid = resolveEkskulIdServer(a.ekskulId);
      var eName = eMap[rawEid] || rawEid;

      if (!pMap[rawEid]) {
        pMap[rawEid] = { id: rawEid, name: eName, total: 0, sakit: 0, izin: 0, alpha: 0 };
      }
      pMap[rawEid].total++;
      if (st === 'sakit') pMap[rawEid].sakit++;
      else if (st === 'izin') pMap[rawEid].izin++;
      else if (st === 'alpha') pMap[rawEid].alpha++;

      if (!ekskulTotals[rawEid]) {
        ekskulTotals[rawEid] = { id: rawEid, name: eName, total: 0 };
      }
      ekskulTotals[rawEid].total++;
    });

    var perEkskul = Object.keys(pMap).map(function(k) { return pMap[k]; });

    return {
      siswa: s,
      sakit: sCount,
      izin: iCount,
      alpha: aCount,
      total: sCount + iCount + aCount,
      perEkskul: perEkskul,
      detail: abs
    };
  });

  return {
    rekap: rekap,
    ekskulTotals: Object.keys(ekskulTotals).map(function(k) { return ekskulTotals[k]; })
  };
}

function getRekapPresensiSiswa(siswaId, dari, sampai) {
  var allSiswa = sheetToObjects(SHEET.SISWA);
  var allKelas = sheetToObjects(SHEET.KELAS);
  var allEkskul = sheetToObjects(SHEET.EKSKUL);
  var allReg = sheetToObjects(SHEET.KEIKUTSERTAAN);
  var allAbs = sheetToObjects(SHEET.ABSENSI);

  var s = allSiswa.find(function(x){ return x.id === siswaId || x.nis === siswaId; });
  if (!s) return { success: false, message: 'Data siswa tidak ditemukan' };

  var sid = s.id;
  var kObj = allKelas.find(function(k){ return k.id === s.kelasId; });

  var myRegs = allReg.filter(function(r){ return r.siswaId === sid; });
  var myEids = myRegs.map(function(r){ return resolveEkskulIdServer(r.ekskulId); });

  var sesiMap = {};
  allAbs.forEach(function(a) {
    var rawEid = resolveEkskulIdServer(a.ekskulId);
    if (myEids.indexOf(rawEid) >= 0) {
      if (dari && a.tanggal < dari) return;
      if (sampai && a.tanggal > sampai) return;
      var key = rawEid + '_' + a.tanggal;
      sesiMap[key] = { ekskulId: rawEid, tanggal: a.tanggal };
    }
  });

  var myAbs = allAbs.filter(function(a) {
    if (a.siswaId !== sid) return false;
    if (dari && a.tanggal < dari) return false;
    if (sampai && a.tanggal > sampai) return false;
    return true;
  });

  var absMap = {};
  myAbs.forEach(function(a) {
    var rawEid = resolveEkskulIdServer(a.ekskulId);
    absMap[rawEid + '_' + a.tanggal] = a;
  });

  var perEkskul = [];
  var totalSesiAll = Object.keys(sesiMap).length;
  var tS = 0, tI = 0, tA = 0;

  myEids.forEach(function(eid) {
    var eObj = allEkskul.find(function(e){ return e.id === eid; }) || { id: eid, name: eid };
    var sesiEkskul = 0;
    for (var k in sesiMap) {
      if (sesiMap[k].ekskulId === eid) sesiEkskul++;
    }

    var sCount = 0, iCount = 0, aCount = 0;
    myAbs.forEach(function(ab) {
      var rawEid = resolveEkskulIdServer(ab.ekskulId);
      if (rawEid === eid) {
        var st = (ab.status || '').toLowerCase();
        if (st === 'sakit') { sCount++; tS++; }
        else if (st === 'izin') { iCount++; tI++; }
        else if (st === 'alpha') { aCount++; tA++; }
      }
    });

    var totAbs = sCount + iCount + aCount;
    var hadir = Math.max(0, sesiEkskul - totAbs);
    var pers = sesiEkskul > 0 ? Math.round((hadir / sesiEkskul) * 100) : 100;

    perEkskul.push({
      ekskulId: eid,
      ekskulName: eObj.name,
      hari: eObj.hari || '-',
      jam: eObj.jam || '-',
      totalSesi: sesiEkskul,
      hadir: hadir,
      sakit: sCount,
      izin: iCount,
      alpha: aCount,
      totalAbsen: totAbs,
      persenHadir: pers
    });
  });

  var totAbsAll = tS + tI + tA;
  var totHadirAll = Math.max(0, totalSesiAll - totAbsAll);
  var persHadirAll = totalSesiAll > 0 ? Math.round((totHadirAll / totalSesiAll) * 100) : 100;

  var riwayat = [];
  for (var key in sesiMap) {
    var sInfo = sesiMap[key];
    var ab = absMap[key];
    var eObj = allEkskul.find(function(e){ return e.id === sInfo.ekskulId; });
    riwayat.push({
      tanggal: sInfo.tanggal,
      ekskulId: sInfo.ekskulId,
      ekskulName: eObj ? eObj.name : sInfo.ekskulId,
      status: ab ? ab.status : 'Hadir',
      keterangan: ab ? ab.keterangan : 'Mengikuti kegiatan'
    });
  }

  riwayat.sort(function(a, b) { return b.tanggal.localeCompare(a.tanggal); });

  return {
    success: true,
    siswa: { id: s.id, nama: s.nama, nis: s.nis, kelasName: kObj ? kObj.name : s.kelasId },
    ringkasan: {
      totalSesi: totalSesiAll,
      hadir: totHadirAll,
      sakit: tS,
      izin: tI,
      alpha: tA,
      totalAbsen: totAbsAll,
      persenHadir: persHadirAll
    },
    perEkskul: perEkskul,
    riwayat: riwayat
  };
}

// ============================================================
// EKSPOR CSV (EXCEL-COMPATIBLE)
// ============================================================
function exportCsvKelas(arg1, arg2, arg3, arg4) {
  var allKelas = sheetToObjects(SHEET.KELAS);
  var targetKid = arg1 ? resolveKelasIdServer(arg1) : null;
  var eid = arg2 ? resolveEkskulIdServer(arg2) : null;
  var dari = arg3 || null;
  var sampai = arg4 || null;

  var data = getLaporanKelas(targetKid, eid, dari, sampai);
  var rekap = data.rekap || [];
  var kMap = {};
  allKelas.forEach(function(k) { kMap[k.id] = k.name; });

  var lines = [];
  lines.push('No,NIS,Nama Siswa,Kelas,Sakit,Izin,Alpha,Total Tidak Hadir,Rincian Ketidakhadiran di Ekstranya');

  rekap.forEach(function(item, idx) {
    var s = item.siswa;
    var kName = kMap[s.kelasId] || s.kelasId;
    var rincianArr = (item.perEkskul || []).map(function(p) {
      return p.name + ': ' + p.total + 'x (S:' + p.sakit + ', I:' + p.izin + ', A:' + p.alpha + ')';
    });
    var rincianStr = rincianArr.length > 0 ? rincianArr.join('; ') : 'Nihil / Selalu Hadir';

    lines.push([
      idx + 1,
      '"' + (s.nis || '') + '"',
      '"' + s.nama.replace(/"/g, '""') + '"',
      '"' + kName + '"',
      item.sakit,
      item.izin,
      item.alpha,
      item.total,
      '"' + rincianStr.replace(/"/g, '""') + '"'
    ].join(','));
  });

  return lines.join('\n');
}

function exportCsvEkskul(arg1, arg2, arg3, arg4) {
  var allKelas = sheetToObjects(SHEET.KELAS);
  var allEkskul = sheetToObjects(SHEET.EKSKUL);
  var allAbs = sheetToObjects(SHEET.ABSENSI);
  var allS = sheetToObjects(SHEET.SISWA);

  var targetKid = arg1 ? resolveKelasIdServer(arg1) : null;
  var eid = arg2 ? resolveEkskulIdServer(arg2) : null;
  var dari = arg3 || null;
  var sampai = arg4 || null;

  var eMap = {}; allEkskul.forEach(function(e) { eMap[e.id] = e.name; });
  var kMap = {}; allKelas.forEach(function(k) { kMap[k.id] = k.name; });
  var sMap = {}; allS.forEach(function(s) { sMap[s.id] = s; });

  var filtered = allAbs.filter(function(a) {
    var rawEid = resolveEkskulIdServer(a.ekskulId);
    if (eid && rawEid !== eid) return false;
    if (dari && a.tanggal < dari) return false;
    if (sampai && a.tanggal > sampai) return false;
    if (targetKid) {
      var sObj = sMap[a.siswaId];
      if (!sObj || !matchKelasServer(sObj.kelasId, targetKid, allKelas)) return false;
    }
    return true;
  });

  filtered.sort(function(a, b) {
    if (a.tanggal !== b.tanggal) return a.tanggal.localeCompare(b.tanggal);
    var sa = sMap[a.siswaId] ? sMap[a.siswaId].nama : '';
    var sb = sMap[b.siswaId] ? sMap[b.siswaId].nama : '';
    return sa.localeCompare(sb);
  });

  var lines = [];
  lines.push('No,Tanggal,Ekskul,NIS,Nama Siswa,Kelas,Status,Keterangan');

  filtered.forEach(function(a, idx) {
    var s = sMap[a.siswaId] || { nis: '', nama: '-', kelasId: '' };
    var rawEid = resolveEkskulIdServer(a.ekskulId);
    var eName = eMap[rawEid] || a.ekskulId;
    var kName = kMap[s.kelasId] || s.kelasId;

    lines.push([
      idx + 1,
      a.tanggal,
      '"' + eName.replace(/"/g, '""') + '"',
      '"' + (s.nis || '') + '"',
      '"' + s.nama.replace(/"/g, '""') + '"',
      '"' + kName + '"',
      a.status.toUpperCase(),
      '"' + (a.keterangan || '').replace(/"/g, '""') + '"'
    ].join(','));
  });

  return lines.join('\n');
}
