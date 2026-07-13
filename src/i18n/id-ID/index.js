export default {
  // Navigation / Layout
  nav: {
    home: 'Beranda',
    features: 'Fitur',
    quickStart: 'Mulai Cepat',
    documentation: 'Dokumentasi',
    fullDocumentation: 'Dokumentasi Lengkap',
    github: 'GitHub',
    githubRepo: 'Repositori GitHub',
    builtWith: 'Dibuat dengan Cinta & Hasrat',
    navigation: 'Navigasi'
  },
  // Hero Section
  hero: {
    title: 'PADI REST API',
    subtitle: 'Framework REST API PHP Kelas Industri yang Ringan Tanpa Bloat untuk Web Modern',
    getStarted: 'Mulai Sekarang',
    documentation: 'Dokumentasi'
  },
  // Philosophy Section
  philosophy: {
    title1: 'Dibuat untuk',
    titleSpeed: 'Kecepatan',
    title2: 'Diskalakan untuk Pertumbuhan',
    titleIndustrial: 'Industri',
    desc: 'PADI bukan sekadar framework PHP biasa; ini adalah mesin generator REST API yang dirancang dengan cermat untuk mengubah skema database Anda menjadi layanan RESTful siap produksi secara instan.',
    readBtn: 'Baca filosofi →',
    items: {
      p: {
        t: 'Performa Tinggi (Performant)',
        d: 'Inti eksekusi yang sangat teroptimasi untuk memeras setiap tetes kecepatan dari arsitektur PHP modern.'
      },
      a: {
        t: 'Lincah (Agile)',
        d: 'Hasilkan endpoint CRUD lengkap, validasi, dan resource dalam hitungan detik menggunakan generator CLI kami.'
      },
      d: {
        t: 'Dapat Diandalkan (Dependable)',
        d: 'Arsitektur worker-safe yang tangguh yang berkembang di bawah beban kerja konkurensi tinggi.'
      },
      i: {
        t: 'Intuitif (Intuitive)',
        d: 'Desain API bergaya Yii2 yang bersih dan fasih yang terasa familier sekaligus menyegarkan.'
      }
    }
  },
  // Features Section
  features: {
    title: 'Sistem Inti Canggih',
    subtitle: 'Fitur Unggulan',
    performanceTag: 'Performa Tinggi',
    items: {
      routing: {
        t: 'Routing Berindeks Method',
        d: 'Mendukung middleware global/grup, parameter dinamis, dan pencarian cepat O(1) berdasarkan HTTP method.'
      },
      orm: {
        t: 'ActiveRecord ORM',
        d: 'Dilengkapi dengan relasi eager loading, joinWith otomatis, pencarian skema cerdas, dan hook daur hidup.'
      },
      middleware: {
        t: 'Pipeline Middleware',
        d: 'Intercept request dengan mudah. Dilengkapi dengan middleware bawaan untuk Auth, CORS, dan Rate Limiting.'
      },
      queue: {
        t: 'Sistem Antrean Terintegrasi',
        d: 'Jalankan pekerjaan latar belakang yang memakan waktu lama secara asinkron menggunakan driver database/redis bawaan.'
      },
      cache: {
        t: 'Caching Multi-Driver',
        d: 'Tingkatkan performa kueri dengan file/redis cache. Dilengkapi sistem pencarian static-sentinel minim alokasi memori.'
      },
      auth: {
        t: 'Autentikasi JWT Bawaan',
        d: 'Keamanan token stateless di luar kotak. Dilengkapi fungsi refresh token dan remember-me terintegrasi.'
      },
      cli: {
        t: 'CLI Generator Kuat',
        d: 'Generator kode interaktif untuk menghasilkan CRUD lengkap (Model, Controller, Resource, Route) secara instan.'
      },
      validation: {
        t: 'Validasi Input Ketat',
        d: 'Mesin validasi tangguh dengan 32 aturan, mendukung validasi bersyarat, tipe data, dan format khusus.'
      },
      response: {
        t: 'Resource & Respon Otomatis',
        d: 'Transformasikan data database Anda menjadi format JSON REST standar industri secara instan dan bersih.'
      }
    }
  },
  // Stats Section
  stats: {
    title: 'METRIK PERFORMA',
    subtitle: 'Teknik Presisi.',
    desc: 'Dioptimalkan untuk shared hosting dan klaster enterprise. Framework kami menghasilkan skor keamanan industri terbaik tanpa mengorbankan kecepatan eksekusi.',
    securityScore: 'Skor Keamanan',
    performance: 'Performa'
  },
  // Monitor Placeholder
  monitor: {
    title: 'Pemantauan Performa Real-time',
    desc: 'Menunggu Penyebaran Produksi...'
  },
  // Quick Start Section
  quickStart: {
    title1: 'Mulai Jalankan',
    title2: 'Secara Instan',
    desc: 'Tanpa wizard instalasi yang rumit. Cukup satu perintah untuk menarik engine dan mulai membangun arsitektur Anda.',
    steps: [
      'Unduh SDK melalui Composer',
      'Wizard Setup Otomatis',
      'Jalankan Lingkungan Dev'
    ]
  },
  // Learning Paths Section
  learning: {
    title: 'Panduan Pembelajaran',
    subtitle: 'Jalur khusus yang dirancang untuk mempercepat perilisan produk Anda',
    beginBtn: 'Mulai Jalur Ini',
    paths: {
      basics: {
        t: 'Konsep Dasar',
        d: 'Kuasai dasar-dasar PADI REST API dan bangun endpoint RESTful pertama Anda.',
        steps: [
          'Pengenalan & Instalasi',
          'Routing & Penanganan Request',
          'Database & Query Builder',
          'Validasi Input Dasar'
        ]
      },
      advanced: {
        t: 'Sistem Lanjutan',
        d: 'Gali fitur-fitur kelas industri untuk menangani beban kerja nyata.',
        steps: [
          'Autentikasi JWT & Otorisasi RBAC',
          'Sistem Antrean Latar Belakang (Queue)',
          'Caching Performa Tinggi',
          'Penyimpanan File & Upload'
        ]
      },
      production: {
        t: 'Penyebaran Produksi',
        d: 'Konfigurasikan dan optimalkan server Anda untuk kinerja maksimal di dunia nyata.',
        steps: [
          'Optimasi FrankenPHP Worker Mode',
          'Konfigurasi Cache Redis & MySQL',
          'Setup Docker & docker-compose',
          'Penyetelan Keamanan Produksi'
        ]
      }
    }
  },
  // CTA Section
  cta: {
    title1: 'Siap Merasakan',
    title2: 'Kekuatan Murni?',
    desc: 'Bergabunglah dengan ekosistem engineer yang membangun layanan REST industri tanpa boilerplate rumit. Berhenti bergelut, mulai rilis produk Anda.',
    installBtn: 'Instal Framework'
  }
}
