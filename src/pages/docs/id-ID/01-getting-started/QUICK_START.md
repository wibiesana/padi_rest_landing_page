# 🚀 Mulai Cepat - Jalankan Ini!

## ⚡ Kecepatan Rilis: Dari Nol Hingga Jadi API dalam Hitungan Detik

Nikmati jalur cepat pengembangan aplikasi terbaik. Padi REST API dirancang untuk **Produktivitas Instan**, memungkinkan Anda beralih dari proyek kosong hingga menjadi REST API yang berfungsi penuh, aman, dan berkelas industri dalam waktu kurang dari 60 detik. Wizard setup interaktif kami akan menangani seluruh pekerjaan berat, sehingga Anda dapat fokus membangun fitur-fitur utama yang penting.

---

## 📋 Daftar Isi

- [⚡ Kecepatan Rilis: Dari Nol Hingga Jadi API dalam Hitungan Detik](#kecepatan-rilis-dari-nol-hingga-jadi-api-dalam-hitungan-detik)
- [📝 Persyaratan Sistem](#persyaratan-sistem)
- [🤖 Setup Otomatis](#setup-otomatis)
- [📦 Apa yang Anda Dapatkan](#apa-yang-anda-dapatkan)
- [🗄️ Dukungan Database](#dukungan-database)
- [💻 Perintah CLI Padi](#perintah-cli-padi)
- [👣 Langkah Selanjutnya](#langkah-selanjutnya)

---

## 📝 Persyaratan Sistem

- **PHP 8.4+**
- **Ekstensi PHP:** `pdo`, `mbstring`, `openssl`, `zlib`, `json`
- **Database:** MySQL / MariaDB / PostgreSQL / SQLite

---

## Setup Otomatis

Jalankan perintah ini untuk membuat proyek baru:

```bash
composer create-project wibiesana/padi-rest-api aplikasi-saya
cd aplikasi-saya
```

Kemudian inisialisasi proyek Anda menggunakan **Padi Console**:

```bash
php padi init
```

Script interaktif tersebut akan memandu Anda untuk:

1. ✅ **Setup file konfigurasi .env**
2. ✅ **Memilih database** (MySQL/MariaDB/PostgreSQL/SQLite)
3. ✅ **Konfigurasi koneksi database** (host, port, username, password)
4. ✅ **Membuat Kunci Rahasia JWT** (secure 64-character hex)
5. ✅ **Menjalankan migrasi database** (tabel dasar saja atau beserta sampel data)
6. ✅ **Membuat CRUD kode otomatis** (opsional)

---

## Apa yang Anda Dapatkan

### Tabel Basis (Base Migration):

- ✅ Tabel **users** - Teroptimasi dengan peran (roles), status akun, verifikasi email, dll.

### Sampel Migrasi Database (Opsional):

- ✅ Tabel **posts** - Artikel blog dengan foreign key terhubung ke users
- ✅ Tabel **tags** - Untuk kategorisasi artikel
- ✅ Tabel **post_tags** - Tabel pivot hubungan Many-to-Many
- ✅ Tabel **comments** - Dukungan komentar bersarang (nested comments)

---

## Dukungan Database

- ✅ **MySQL**
- ✅ **MariaDB**
- ✅ **PostgreSQL**
- ✅ **SQLite**

---

## Perintah CLI Padi

### Migrasi Database

```bash
# Jalankan seluruh migrasi database
php padi migrate

# Periksa status migrasi
php padi migrate:status

# Kembalikan migrasi (Rollback)
php padi migrate:rollback
```

### Membuat CRUD Otomatis

```bash
# Membuat model & controller satu per satu
php padi make:controller UserController
php padi make:model User users

# Pembuatan scaffolding CRUD lengkap
php padi generate:crud users
php padi ga
```

### Menjalankan Server Lokal

```bash
php padi serve
```

Akses situs lokal di: `http://localhost:8085`

---

## Langkah Selanjutnya

1. Jalankan perintah `php padi init`
2. Ikuti panduan wizard interaktif
3. Jalankan server lokal dengan `php padi serve`
4. Mulai uji endpoint API Anda menggunakan aplikasi penguji API (Postman / Thunder Client)
