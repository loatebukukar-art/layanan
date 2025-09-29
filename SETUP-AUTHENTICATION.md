# 🔐 Sistem Autentikasi Admin - Panduan Setup Lengkap

## 📋 **Ringkasan Sistem**

Sistem autentikasi admin telah dibuat untuk membatasi akses ke halaman admin hanya untuk admin kelurahan yang telah terdaftar. Sistem menggunakan Google Apps Script dan Google Sheets untuk menyimpan data admin.

## 🗂️ **File yang Dibuat**

1. **`google-apps-script-auth.js`** - Kode Google Apps Script untuk autentikasi
2. **`auth-config.js`** - Konfigurasi dan struktur data
3. **`admin-login.html`** - Halaman login untuk admin
4. **`admin.html`** - Dimodifikasi dengan sistem autentikasi

## 📊 **Struktur Google Sheets**

### **Langkah 1: Buat Google Sheets**

1. Buka [sheets.google.com](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama **"Admin_Users"**
3. Buat header di baris pertama:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **username** | **password** | **nama_lengkap** | **role** | **status** | **last_login** |

### **Langkah 2: Tambahkan Data Admin**

Tambahkan data admin di baris berikutnya:

| username | password | nama_lengkap | role | status | last_login |
|----------|----------|--------------|------|--------|------------|
| admin_kelurahan | admin123 | Admin Kelurahan | admin | active | (kosong) |
| kepala_kelurahan | kepala123 | Kepala Kelurahan | admin | active | (kosong) |
| sekretaris | sekret123 | Sekretaris Kelurahan | admin | active | (kosong) |
| staff_admin | staff123 | Staff Admin | admin | active | (kosong) |

### **Langkah 3: Dapatkan Sheet ID**

Dari URL Google Sheets:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```
Copy **SHEET_ID_HERE** untuk digunakan di Apps Script.

## 🔧 **Setup Google Apps Script**

### **Langkah 1: Buat Project Apps Script**

1. Buka [script.google.com](https://script.google.com)
2. Klik **"New Project"**
3. Ganti nama project menjadi **"Admin Authentication"**

### **Langkah 2: Paste Kode**

1. Hapus semua kode default
2. Copy seluruh isi file **`google-apps-script-auth.js`**
3. Paste ke editor Apps Script
4. **PENTING**: Ganti `YOUR_SHEET_ID_HERE` dengan Sheet ID yang Anda dapatkan

### **Langkah 3: Deploy Web App**

1. Klik **"Deploy"** > **"New Deployment"**
2. **Type**: Web App
3. **Execute as**: Me
4. **Who has access**: Anyone
5. Klik **"Deploy"**
6. **PENTING**: Copy **Web App URL** yang muncul

## 🔗 **Update Konfigurasi**

### **Update admin-login.html**

Buka file `admin-login.html` dan ganti:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    // Ganti YOUR_SCRIPT_ID dengan URL Web App yang Anda dapatkan
};
```

### **Update admin.html**

Buka file `admin.html` dan ganti:

```javascript
const AUTH_CONFIG = {
    AUTH_URL: 'https://script.google.com/macros/s/YOUR_AUTH_SCRIPT_ID/exec',
    // Ganti YOUR_AUTH_SCRIPT_ID dengan URL Web App yang Anda dapatkan
};
```

## 🚀 **Cara Menggunakan**

### **Untuk Admin:**

1. Buka halaman admin: `admin.html`
2. Sistem akan otomatis redirect ke halaman login
3. Masukkan username dan password yang ada di Google Sheets
4. Setelah login berhasil, akan redirect ke halaman admin
5. Klik tombol **"Logout"** untuk keluar

### **Untuk Developer:**

1. **Menambah Admin Baru**: Edit Google Sheets langsung
2. **Mengubah Password**: Edit kolom password di Google Sheets
3. **Menonaktifkan Admin**: Ubah status dari "active" ke "inactive"

## 🔒 **Fitur Keamanan**

- ✅ **Session Management**: Token dengan expiry 24 jam
- ✅ **Password Protection**: Form login dengan validasi
- ✅ **Access Control**: Hanya admin terdaftar yang bisa akses
- ✅ **Auto Logout**: Session expired otomatis logout
- ✅ **Secure Storage**: Token disimpan di localStorage
- ✅ **Token Verification**: Verifikasi token setiap kali akses

## 📱 **Responsive Design**

- ✅ **Mobile Friendly**: Tampilan responsif di semua device
- ✅ **Touch Optimized**: Tombol dan form mudah digunakan di mobile
- ✅ **Modern UI**: Desain modern dengan animasi halus

## 🛠️ **Troubleshooting**

### **Error "Sheet ID tidak valid"**
- Pastikan Sheet ID sudah benar
- Pastikan spreadsheet sudah di-share dengan akun Google yang menjalankan Apps Script

### **Error "Login gagal"**
- Periksa username dan password di Google Sheets
- Pastikan status admin adalah "active"
- Periksa URL Web App sudah benar

### **Error "Token tidak valid"**
- Clear localStorage browser
- Login ulang dengan username dan password

### **Halaman tidak redirect**
- Periksa URL Web App di konfigurasi
- Pastikan Apps Script sudah di-deploy sebagai Web App

## 📞 **Support**

Jika mengalami masalah:

1. **Periksa Console Browser**: Tekan F12 untuk melihat error
2. **Periksa Apps Script Logs**: Buka Apps Script > Executions
3. **Periksa Google Sheets**: Pastikan data admin sudah benar
4. **Test API**: Gunakan Postman untuk test endpoint

## 🔄 **Update dan Maintenance**

### **Menambah Admin Baru:**
```javascript
// Jalankan di Apps Script Console
addAdminUser('username_baru', 'password_baru', 'Nama Lengkap', 'admin');
```

### **Mengubah Password:**
```javascript
// Jalankan di Apps Script Console
changePassword('username', 'password_baru');
```

### **Menonaktifkan Admin:**
```javascript
// Jalankan di Apps Script Console
deactivateAdmin('username');
```

## 📈 **Monitoring**

- **Login Activity**: Lihat kolom `last_login` di Google Sheets
- **Active Sessions**: Monitor melalui Apps Script logs
- **Error Tracking**: Periksa browser console dan Apps Script logs

---

## ✅ **Checklist Setup**

- [ ] Google Sheets dibuat dengan struktur yang benar
- [ ] Data admin ditambahkan ke Google Sheets
- [ ] Sheet ID didapatkan dari URL
- [ ] Google Apps Script dibuat dan kode di-paste
- [ ] Sheet ID di-update di Apps Script
- [ ] Web App di-deploy dengan akses "Anyone"
- [ ] Web App URL di-copy
- [ ] URL di-update di admin-login.html
- [ ] URL di-update di admin.html
- [ ] Test login dengan data admin
- [ ] Test logout functionality
- [ ] Test responsive design di mobile

**Sistem autentikasi admin siap digunakan! 🎉**
