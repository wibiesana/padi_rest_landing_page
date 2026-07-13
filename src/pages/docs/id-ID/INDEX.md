# 🌾 Dokumentasi Framework Padi REST API

> **Versi {{APP_VERSION}}** | Siap Produksi

Selamat datang di dokumentasi resmi **Padi REST API Framework** - framework PHP berkinerja tinggi, ringan, dan tanpa *bloatware* yang dirancang untuk membangun REST API tingkat industri dengan kecepatan maksimal dan konsumsi memori minimal.

> **"PADI: Fondasi Utama untuk Aplikasi Modern."**

> _"Stateless untuk worker mode, namun tetap terhubung untuk performa optimal."_

## ✨ Filosofi P.A.D.I.

- **P**erformant: Cepat dan sangat efisien dalam penggunaan sumber daya.
- **A**daptable: Mudah diintegrasikan ke berbagai database dan kerangka kerja frontend.
- **D**istributed: Dirancang khusus untuk sistem terdistribusi dan arsitektur microservices.
- **I**nterface: Konektor data standar yang handal untuk aplikasi modern.

---

## 📋 Daftar Isi

- [✨ Filosofi P.A.D.I.](#filosofi-padi)
- [📖 Navigasi Cepat](#navigasi-cepat)
- [🚀 Memulai](#memulai)
- [📚 Konsep Inti](#konsep-inti)
- [🎯 Topik Lanjutan](#topik-lanjutan)
- [🚀 Penyebaran & Performa](#penyebaran-performa)
- [💡 Contoh Kode](#contoh-kode)
- [📋 Referensi Lengkap](#referensi-lengkap)
- [🎓 Jalur Pembelajaran](#jalur-pembelajaran)
- [🔍 Referensi Cepat](#referensi-cepat)
- [📁 Struktur Dokumentasi](#struktur-dokumentasi)
- [🌟 Fitur Utama](#fitur-utama)
- [💬 Butuh Bantuan?](#butuh-bantuan)
- [🚀 Tautan Cepat](#tautan-cepat)

---

## 📖 Navigasi Cepat

| Bagian                                     | Deskripsi                                          | Paling Cocok Untuk |
| ------------------------------------------ | -------------------------------------------------- | ------------------ |
| [🚀 Memulai](#-memulai)                    | Instalasi, konfigurasi awal, dan langkah pertama    | Pengguna Baru      |
| [📚 Konsep Inti](#-konsep-inti)            | Model, controller, resource, dan query builder     | Semua Developer    |
| [🎯 Topik Lanjutan](#-topik-lanjutan)      | Konfigurasi multi-database dan integrasi frontend  | Pengguna Berpengalaman |
| [🚀 Penyebaran](#-penyebaran-performa)     | Panduan rilis produksi dan optimasi kecepatan      | Tim DevOps         |
| [💡 Contoh](#-contoh-kode)                 | Sampel kode siap pakai                             | Referensi Praktis  |

---

## 🚀 Memulai

Sangat cocok bagi developer yang baru mengenal Padi REST API atau ingin membuat proyek baru.

### Mulai Cepat (5 Menit)

**[📄 QUICK_START.md](01-getting-started/QUICK_START.md)**

- Instalasi hanya dengan 3 perintah
- Endpoint API pertama Anda
- Menguji instalasi Anda

### Panduan Instalasi

**[📄 INSTALLATION.md](01-getting-started/INSTALLATION.md)**

- Langkah-langkah instalasi terperinci
- Persyaratan server & ekstensi PHP
- Setup otomatis vs manual

### Panduan Konfigurasi

**[📄 CONFIGURATION.md](01-getting-started/CONFIGURATION.md)**

- Mengatur variabel lingkungan (.env)
- Perbedaan mode Development vs Production
- Pengaturan keamanan dan CORS

### Langkah Pertama

**[📄 FIRST_STEPS.md](01-getting-started/FIRST_STEPS.md)**

- Mendaftarkan user pertama
- Menguji sistem autentikasi
- Membuat kode CRUD otomatis
- Tugas-tugas umum developer

---

## 📚 Konsep Inti

Pengetahuan wajib untuk membangun API menggunakan Padi REST API.

### Padi CLI & Pembuat Kode (Generator)

**[📄 CLI_INTERFACE.md](02-core-concepts/CLI_INTERFACE.md)**

- Mesin kendali terpadu & pembuatan CRUD tingkat industri
- Daftar perintah lengkap (App, Make, Migrate, Generate)
- Opsi & flag global (`--write`, `--overwrite`, dll.)
- Kupas tuntas arsitektur Base vs. Concrete
- Deteksi relasi database otomatis & pembuatan Postman collection

### Autentikasi & Keamanan

**[📄 AUTHENTICATION.md](02-core-concepts/AUTHENTICATION.md)**

- Alur kerja autentikasi menggunakan token JWT
- Kebijakan keamanan password hash
- Fitur pembatasan akses (Rate limiting)
- Pengaturan CORS terintegrasi

### Role-Based Access Control (RBAC)

**[📄 RBAC.md](02-core-concepts/RBAC.md)**

- Penggunaan RoleMiddleware pada routing
- Helper untuk controller
- Studi kasus nyata (Mahasiswa, Guru, Admin)
- Praktik terbaik keamanan otorisasi

### Panduan Model

**[📄 MODELS.md](02-core-concepts/MODELS.md)**

- Struktur model database (Base/Concrete)
- Operasi CRUD dasar
- Menentukan relasi antar tabel (ORM)
- Validasi data di tingkat model

### Panduan Controller

**[📄 CONTROLLERS.md](02-core-concepts/CONTROLLERS.md)**

- Struktur Controller modern
- Menangani request client
- Menentukan endpoint kustom
- Format standarisasi response & penanganan error

### Panduan Routing

**[📄 ROUTING.md](02-core-concepts/ROUTING.md)**

- Pemetaan route & parameter dinamis
- Penerapan API Versioning (v1, v2)
- Pengelompokan route (Route groups)

### Panduan Middleware

**[📄 MIDDLEWARE.md](02-core-concepts/MIDDLEWARE.md)**

- Mengenal arsitektur middleware
- Membuat middleware kustom
- Registrasi middleware global maupun spesifik route
- Kompatibilitas tinggi dengan FrankenPHP Worker Mode

### Struktur Respon & Format Fleksibel

**[📄 RESPONSE_STRUCTURE.md](02-core-concepts/RESPONSE_STRUCTURE.md)**

- Format respon fleksibel (Full, Simple, Raw)
- Pengalihan format berbasis header request
- Transformasi data otomatis
- Pola Direct Return (Tidak memerlukan pemanggilan fungsi pembungkus respon seperti `success()`)

### Panduan API Resources

**[📄 RESOURCES.md](02-core-concepts/RESOURCES.md)**

- Lapisan transformasi data API
- Memformat respon JSON secara terstruktur
- Memuat relasi data secara opsional (Conditional relationships)

### Panduan Email

**[📄 EMAIL.md](02-core-concepts/EMAIL.md)**

- Konfigurasi server SMTP
- Mengirim email berbasis template HTML
- Mengirim lampiran (attachments)
- Pengiriman email latar belakang (queued emails)

### Sistem Antrean (Queue)

**[📄 QUEUE.md](02-core-concepts/QUEUE.md)**

- Pemrosesan tugas latar belakang (Background jobs)
- Membuat kelas Job kustom
- Menjalankan queue worker

### Sistem Cache

**[📄 CACHE.md](02-core-concepts/CACHE.md)**

- Driver cache berbasis file & Redis
- Operasi dasar (Get/Set)
- Pola caching "Remember"
- Membersihkan cache data

### Panduan Upload File

**[📄 FILE_UPLOAD.md](02-core-concepts/FILE_UPLOAD.md)**

- Penanganan upload file yang aman
- Validasi ukuran & tipe file
- Pembuatan URL publik dan penghapusan file otomatis

### Database & Transaksi

**[📄 DATABASE.md](02-core-concepts/DATABASE.md)**

- Konfigurasi multi-database (MySQL, PostgreSQL, SQLite)
- Manajemen transaksi database otomatis & manual
- Integritas atomik lintas database

### Query Builder

**[📄 QUERY_BUILDER.md](02-core-concepts/QUERY_BUILDER.md)**

- Antarmuka query database yang fleksibel & aman (Fluent Interface)
- Kueri kompleks, joins, dan agregasi data

### Active Record ORM

**[📄 ACTIVE_RECORD.md](02-core-concepts/ACTIVE_RECORD.md)**

- Operasi CRUD berbasis objek
- Meminimalisir N+1 query melalui eager loading (`with`)
- Pelacakan audit kolom (`created_by`/`updated_by`)
- Event hook siklus hidup data (`beforeSave`, `afterLoad`)

---

## 🎯 Topik Lanjutan

Tingkatkan fungsionalitas API Anda menggunakan fitur lanjutan.

### Penanganan Error & Kode Respon

**[📄 ERROR_HANDLING.md](03-advanced/ERROR_HANDLING.md)**

- Referensi lengkap kode pesan respon
- Standardisasi struktur error API
- Penanganan error database & debugging aman
- Contoh integrasi frontend (Vue/React)

### Praktik Terbaik Keamanan

**[📄 SECURITY.md](03-advanced/SECURITY.md)**

- Daftar periksa keamanan sebelum rilis
- Proteksi SQL Injection & XSS secara built-in
- Keamanan token JWT & penyimpanan hash password
- Pemaksaan koneksi aman HTTPS

### Panduan Multi-Database

**[📄 MULTI_DATABASE.md](03-advanced/MULTI_DATABASE.md)**

- Koneksi simultan ke beberapa jenis database berbeda
- Pengalihan koneksi dinamis saat runtime

### Panduan CORS

**[📄 CORS.md](03-advanced/CORS.md)**

- Pengaturan Cross-Origin Resource Sharing yang aman
- Mengizinkan domain (origins) terpercaya

---

## 🚀 Penyebaran & Performa

Panduan rilis produksi dan optimasi kecepatan aplikasi.

### Penyebaran Produksi (Deployment)

**[📄 PRODUCTION.md](04-deployment/PRODUCTION.md)**

- Daftar periksa rilis produksi secara komprehensif
- Konfigurasi web server (Apache, Nginx, FrankenPHP)
- Hardening SSL/TLS dan setup backup database otomatis

### Docker Deployment

**[📄 DOCKER.md](04-deployment/DOCKER.md)**

- Panduan lengkap menggunakan container Docker
- 3 Mode deployment (Standard, Worker, Nginx)
- Integrasi Redis cache & Caddyfile SSL otomatis

### FrankenPHP Worker Mode (3x - 10x Lebih Cepat!)

**[📄 FRANKENPHP_SETUP.md](04-deployment/FRANKENPHP_SETUP.md)**

- Panduan setup lengkap & performa benchmark
- FrankenPHP Worker vs Standard PHP-FPM
- Peralihan mode kerja secara cepat (`mode-switching`)

---

## 🎓 Jalur Pembelajaran

### Jalur 1: Pemula (Developer Baru Padi)

1. [QUICK_START.md](01-getting-started/QUICK_START.md) - 5 Menit
2. [FIRST_STEPS.md](01-getting-started/FIRST_STEPS.md) - 15 Menit
3. [AUTHENTICATION.md](02-core-concepts/AUTHENTICATION.md) - 20 Menit
4. [MODELS.md](02-core-concepts/MODELS.md) - 20 Menit

**Estimasi Waktu: ~1 Jam**

### Jalur 2: Menengah (Membangun Aplikasi Siap Rilis)

1. [INSTALLATION.md](01-getting-started/INSTALLATION.md) - 15 Menit
2. [CONFIGURATION.md](01-getting-started/CONFIGURATION.md) - 10 Menit
3. [CLI_INTERFACE.md](02-core-concepts/CLI_INTERFACE.md) - 20 Menit
4. [CONTROLLERS.md](02-core-concepts/CONTROLLERS.md) - 20 Menit
5. [ROUTING.md](02-core-concepts/ROUTING.md) - 10 Menit

**Estimasi Waktu: ~1.5 Jam**

---

### Mengapa Skor Audit Padi Sangat Tinggi?

#### 🛡️ Arsitektur Keamanan (Skor: 9.8/10)
* **Validasi Ketat 32 Aturan**: Validasi input komprehensif mencakup keamanan tipe data (`string`, `integer`, `boolean`), format khusus (`uuid`, `json`, `date_format`), serta validasi kondisional (`required_if`, `required_with`) mencegah bypass input.
* **Concurrency Cache yang Aman**: Menggunakan mekanisme penguncian file eksklusif (`LOCK_EX`) pada berkas rate limiter mencegah terjadinya race conditions dan korupsi cache pada beban tinggi (seperti FrankenPHP worker mode).
* **Generator Kode Cerdas**: Secara otomatis memetakan skema tabel database ke aturan validasi optimal (misalnya `tinyint(1)` → `boolean`, nullable → `nullable`), serta menerapkan aturan `sometimes` pada aksi pembaruan untuk mendukung partial updates (PUT/PATCH).

#### ⚡ Optimasi Performa Kerja (Skor: 9.5/10)
* **Router Berbasis Indeks Metode HTTP**: Route dipartisi berdasarkan metode HTTP (GET, POST, dll.) sejak awal alih-alih dicocokkan berurutan dalam satu daftar datar. Hal ini membuat pencocokan route menjadi operasi berkecepatan $O(1)$.
* **Bebas Ketergantungan Eksternal (Zero Dependencies)**: Dependensi berat eksternal seperti Monolog, Predis, dan PHPMailer telah dieliminasi dari sistem inti. Ini memangkas ukuran vendor hingga **~6.3MB**, yang secara dramatis mempercepat proses autoloader dan cold start.
* **Static Sentinel pada Subsistem Cache**: Menggunakan objek statis sentinel khusus untuk meminimalkan alokasi memori runtime pada proses hit/miss cache, sehingga pemrosesan lebih hemat CPU.
* **Optimasi Query Join (`joinWith`)**: Eager loading relasi database menggunakan subset kolom yang spesifik mengurangi database roundtrips secara drastis (mitigasi N+1 queries).

---

**Framework:** Padi REST API v{{APP_VERSION}}  
**Status:** Siap Produksi ✅  
**Skor Keamanan:** 9.8/10 🛡️ (Audit internal berdasarkan OWASP API Security Checklist)  
**Skor Performa:** 9.5/10 ⚡ (Hasil uji wrk/ApacheBench di bawah FrankenPHP Worker Mode)  
**Lisensi:** MIT
