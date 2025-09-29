/**
 * Google Apps Script untuk Autentikasi Admin
 * Sistem Login untuk Halaman Admin Kelurahan
 * 
 * Cara Setup:
 * 1. Buka Google Sheets dan buat sheet baru dengan nama "Admin_Users"
 * 2. Buat kolom: username, password, nama_lengkap, role, status, last_login
 * 3. Masukkan data admin di sheet tersebut
 * 4. Buka Apps Script (script.google.com)
 * 5. Buat project baru dan paste kode ini
 * 6. Deploy sebagai Web App dengan akses "Anyone"
 * 7. Copy URL Web App untuk digunakan di halaman admin
 */

// Konfigurasi
const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Ganti dengan ID Google Sheets Anda
const SHEET_NAME = 'Admin_Users';

/**
 * Fungsi utama untuk menangani request autentikasi
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'login':
        return handleLogin(data);
      case 'verify':
        return handleVerify(data);
      case 'logout':
        return handleLogout(data);
      default:
        return createResponse(false, 'Action tidak valid');
    }
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

/**
 * Fungsi untuk menangani OPTIONS request (CORS preflight)
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600'
    });
}

/**
 * Fungsi untuk menangani login admin
 */
function handleLogin(data) {
  const { username, password } = data;
  
  if (!username || !password) {
    return createResponse(false, 'Username dan password harus diisi');
  }
  
  try {
    const sheet = getSheet();
    const users = getUsers(sheet);
    
    // Cari user berdasarkan username
    const user = users.find(u => u.username === username && u.status === 'active');
    
    if (!user) {
      return createResponse(false, 'Username tidak ditemukan atau akun tidak aktif');
    }
    
    // Verifikasi password (dalam implementasi nyata, gunakan hash)
    if (user.password !== password) {
      return createResponse(false, 'Password salah');
    }
    
    // Update last login
    updateLastLogin(sheet, user.rowIndex);
    
    // Generate session token
    const sessionToken = generateSessionToken();
    
    // Simpan session (dalam implementasi nyata, simpan di database)
    const sessionData = {
      token: sessionToken,
      username: user.username,
      nama: user.nama_lengkap,
      role: user.role,
      loginTime: new Date().toISOString()
    };
    
    return createResponse(true, 'Login berhasil', {
      token: sessionToken,
      user: {
        username: user.username,
        nama: user.nama_lengkap,
        role: user.role
      }
    });
    
  } catch (error) {
    return createResponse(false, 'Error saat login: ' + error.toString());
  }
}

/**
 * Fungsi untuk verifikasi session token
 */
function handleVerify(data) {
  const { token } = data;
  
  if (!token) {
    return createResponse(false, 'Token tidak valid');
  }
  
  try {
    // Dalam implementasi nyata, verifikasi token dari database
    // Untuk demo, kita akan decode token sederhana
    const decoded = decodeSessionToken(token);
    
    if (!decoded || decoded.exp < Date.now()) {
      return createResponse(false, 'Session expired');
    }
    
    return createResponse(true, 'Session valid', {
      user: decoded.user
    });
    
  } catch (error) {
    return createResponse(false, 'Error verifikasi: ' + error.toString());
  }
}

/**
 * Fungsi untuk logout
 */
function handleLogout(data) {
  const { token } = data;
  
  try {
    // Dalam implementasi nyata, hapus session dari database
    return createResponse(true, 'Logout berhasil');
    
  } catch (error) {
    return createResponse(false, 'Error logout: ' + error.toString());
  }
}

/**
 * Mendapatkan sheet Google Sheets
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME);
}

/**
 * Mendapatkan semua data users dari sheet
 */
function getUsers(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const users = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) { // Jika username tidak kosong
      users.push({
        rowIndex: i + 1,
        username: row[0],
        password: row[1],
        nama_lengkap: row[2],
        role: row[3],
        status: row[4],
        last_login: row[5]
      });
    }
  }
  
  return users;
}

/**
 * Update last login timestamp
 */
function updateLastLogin(sheet, rowIndex) {
  const lastLoginColumn = 6; // Kolom F (last_login)
  sheet.getRange(rowIndex, lastLoginColumn).setValue(new Date());
}

/**
 * Generate session token sederhana
 */
function generateSessionToken() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const token = btoa(JSON.stringify({
    timestamp: timestamp,
    random: random,
    exp: timestamp + (24 * 60 * 60 * 1000) // 24 jam
  }));
  
  return token;
}

/**
 * Decode session token
 */
function decodeSessionToken(token) {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Membuat response JSON dengan header CORS
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600'
    });
}

/**
 * Fungsi untuk testing (opsional)
 */
function testLogin() {
  const testData = {
    action: 'login',
    username: 'admin_kelurahan',
    password: 'admin123'
  };
  
  const result = handleLogin(testData);
  console.log(result.getContent());
}

/**
 * Fungsi untuk menambahkan user admin baru
 */
function addAdminUser(username, password, namaLengkap, role = 'admin') {
  try {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    
    sheet.getRange(lastRow + 1, 1, 1, 6).setValues([[
      username,
      password,
      namaLengkap,
      role,
      'active',
      new Date()
    ]]);
    
    console.log('Admin user berhasil ditambahkan');
    return true;
  } catch (error) {
    console.error('Error menambahkan admin user:', error);
    return false;
  }
}

/**
 * Fungsi untuk mengubah password admin
 */
function changePassword(username, newPassword) {
  try {
    const sheet = getSheet();
    const users = getUsers(sheet);
    
    const user = users.find(u => u.username === username);
    if (!user) {
      console.error('User tidak ditemukan');
      return false;
    }
    
    sheet.getRange(user.rowIndex, 2).setValue(newPassword);
    console.log('Password berhasil diubah');
    return true;
  } catch (error) {
    console.error('Error mengubah password:', error);
    return false;
  }
}

/**
 * Fungsi untuk menonaktifkan akun admin
 */
function deactivateAdmin(username) {
  try {
    const sheet = getSheet();
    const users = getUsers(sheet);
    
    const user = users.find(u => u.username === username);
    if (!user) {
      console.error('User tidak ditemukan');
      return false;
    }
    
    sheet.getRange(user.rowIndex, 5).setValue('inactive');
    console.log('Akun admin berhasil dinonaktifkan');
    return true;
  } catch (error) {
    console.error('Error menonaktifkan akun:', error);
    return false;
  }
}
