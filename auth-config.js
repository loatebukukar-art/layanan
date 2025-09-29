/**
 * KONFIGURASI SETUP GOOGLE APPS SCRIPT
 * 
 * LANGKAH-LANGKAH SETUP:
 * 
 * 1. BUAT GOOGLE SHEETS:
 *    - Buka sheets.google.com
 *    - Buat spreadsheet baru dengan nama "Admin_Users"
 *    - Buat header di baris pertama:
 *      A1: username
 *      B1: password  
 *      C1: nama_lengkap
 *      D1: role
 *      E1: status
 *      F1: last_login
 * 
 * 2. TAMBAHKAN DATA ADMIN:
 *    - Baris 2: admin_kelurahan | admin123 | Admin Kelurahan | admin | active | (kosong)
 *    - Baris 3: kepala_kelurahan | kepala123 | Kepala Kelurahan | admin | active | (kosong)
 * 
 * 3. DAPATKAN SHEET ID:
 *    - Dari URL Google Sheets: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
 *    - Copy SHEET_ID_HERE dan ganti di kode Apps Script
 * 
 * 4. SETUP GOOGLE APPS SCRIPT:
 *    - Buka script.google.com
 *    - Buat project baru
 *    - Paste kode dari google-apps-script-auth.js
 *    - Ganti SHEET_ID dengan ID spreadsheet Anda
 * 
 * 5. DEPLOY WEB APP:
 *    - Klik Deploy > New Deployment
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Klik Deploy
 *    - Copy Web App URL
 * 
 * 6. UPDATE HALAMAN ADMIN:
 *    - Ganti API_URL di admin.html dengan Web App URL
 * 
 * STRUKTUR DATA ADMIN DI GOOGLE SHEETS:
 * 
 * | username          | password   | nama_lengkap      | role  | status | last_login |
 * |-------------------|------------|-------------------|-------|--------|------------|
 * | admin_kelurahan   | admin123   | Admin Kelurahan   | admin | active |            |
 * | kepala_kelurahan   | kepala123  | Kepala Kelurahan  | admin | active |            |
 * | sekretaris        | sekret123  | Sekretaris        | admin | active |            |
 * | staff_admin       | staff123   | Staff Admin       | admin | active |            |
 * 
 * CATATAN KEAMANAN:
 * - Password sebaiknya di-hash menggunakan bcrypt atau SHA-256
 * - Gunakan HTTPS untuk semua komunikasi
 * - Implementasi rate limiting untuk mencegah brute force
 * - Log semua aktivitas login untuk audit
 * - Gunakan session timeout yang wajar
 * 
 * CONTOH PENGGUNAAN API:
 * 
 * Login:
 * POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 * Content-Type: application/json
 * 
 * {
 *   "action": "login",
 *   "username": "admin_kelurahan",
 *   "password": "admin123"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Login berhasil",
 *   "data": {
 *     "token": "eyJ0aW1lc3RhbXAiOjE2...",
 *     "user": {
 *       "username": "admin_kelurahan",
 *       "nama": "Admin Kelurahan",
 *       "role": "admin"
 *     }
 *   }
 * }
 * 
 * Verifikasi Session:
 * POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 * Content-Type: application/json
 * 
 * {
 *   "action": "verify",
 *   "token": "eyJ0aW1lc3RhbXAiOjE2..."
 * }
 * 
 * Logout:
 * POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 * Content-Type: application/json
 * 
 * {
 *   "action": "logout",
 *   "token": "eyJ0aW1lc3RhbXAiOjE2..."
 * }
 */

// Konfigurasi yang perlu disesuaikan
const CONFIG = {
  // Ganti dengan ID Google Sheets Anda
  SHEET_ID: 'YOUR_SHEET_ID_HERE',
  
  // Nama sheet yang berisi data admin
  SHEET_NAME: 'Admin_Users',
  
  // URL Web App Google Apps Script (akan didapat setelah deploy)
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxSIdAZv65KAGIU_-6mblEpaK4YjRtUOfRfVbNkNyUUEqjoKumx_IaNq8XimmfTu8JP/exec',
  
  // Konfigurasi session
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 jam dalam milliseconds
  
  // Konfigurasi keamanan
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 menit dalam milliseconds
};

// Data admin default yang bisa ditambahkan ke Google Sheets
const DEFAULT_ADMIN_USERS = [
  {
    username: 'admin_kelurahan',
    password: 'admin123',
    nama_lengkap: 'Admin Kelurahan',
    role: 'admin',
    status: 'active'
  },
  {
    username: 'kepala_kelurahan',
    password: 'kepala123',
    nama_lengkap: 'Kepala Kelurahan',
    role: 'admin',
    status: 'active'
  },
  {
    username: 'sekretaris',
    password: 'sekret123',
    nama_lengkap: 'Sekretaris Kelurahan',
    role: 'admin',
    status: 'active'
  },
  {
    username: 'staff_admin',
    password: 'staff123',
    nama_lengkap: 'Staff Admin',
    role: 'admin',
    status: 'active'
  }
];

// Export konfigurasi untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG,
    DEFAULT_ADMIN_USERS
  };
}
