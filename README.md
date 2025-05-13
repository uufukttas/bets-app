# Bet App - Spor Bahis Uygulaması

Next.js ve TypeScript ile geliştirilmiş modern bir spor bahis uygulaması. Kullanıcılar için spor bahis oranları, etkinlikler ve gerçek zamanlı güncellemeler sunar.
Uygulamayı kullanabilmek için [burayı](https://bets-app.netlify.app) ziyaret edebilirsiniz.

## Özellikler

- Çeşitli sporlar için bahis oranlarını görüntüleme
- Yaklaşan ve canlı etkinlikleri tarama
- Firebase yapılandırılması

## Kullanılan Teknolojiler

- **Frontend Framework**: Next.js ve TypeScript
- **Durum Yönetimi**: Redux (Redux Toolkit)
- **Stil**: Tailwind CSS
- **UI Bileşenleri**: Framer Motion animasyonları ile özel bileşen kütüphanesi
- **API İletişimi**: Veri çekme için Axios
- **Kod Kalitesi**: ESLint ve TypeScript ile tip güvenliği

## API Anahtarı Gerekliliği

> **ÖNEMLİ**: Bu uygulama düzgün çalışabilmesi için [The Odds API](https://the-odds-api.com)'den bir API anahtarı gerektirir.

### The Odds API Anahtarı Kurulumu

1. [The Odds API](https://the-odds-api.com/signup.html) üzerinde ücretsiz bir hesap oluşturun
2. Hesap panelinizden API anahtarını kopyalayın
3. Projenin kök dizininde `.env.local` dosyası oluşturun
4. `.env.local` dosyasına aşağıdaki satırı ekleyin:
   ```
   NEXT_PUBLIC_BASE_API_URL=baseUr
   NEXT_PUBLIC_BET_APP_API_KEY=betapp-api-key
   NEXT_PUBLIC_FIREBASE_API_KEY=firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=firebase-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=firebase-measurement-id
   ```
5. Eğer geliştirme sunucusu zaten çalışıyorsa, yeniden başlatın

### API Anahtarı Kullanım Notları

- API anahtarı, The Odds API'ye yapılan TÜM istekler için gereklidir
- Her API isteği, API anahtarını otomatik olarak sorgu parametresi olarak ekler
- Ücretsiz paket aylık 500 istek içerir
- Yetkilendirme hataları (401 veya 403) alıyorsanız, API anahtarınızın `.env.local` dosyasında doğru ayarlandığından emin olun

## Mimari

Uygulama, belirgin bir endişe ayrımı ile bileşen tabanlı bir mimariyi takip eder:

### Dizin Yapısı

```
bet-app/
├── app/              # Next.js app dizini ile sayfalar ve rotalar
├── components/       # Yeniden kullanılabilir UI bileşenleri
│   ├── ui/           # Temel UI bileşenleri (Button, Card, Toast vb.)
│   └── ...           # Özelliğe özgü bileşenler
├── hooks/            # Özel React kancaları
├── lib/              # Yardımcı işlevler ve paylaşılan mantık
├── public/           # Statik varlıklar
├── services/         # API servisleri ve veri çekme
├── store/            # Redux store konfigürasyonu
│   ├── slices/       # Durum yönetimi için Redux dilimleri
│   └── index.ts      # Store kurulumu ve yapılandırması
├── styles/           # Global stiller
└── types/            # TypeScript tip tanımları
```

### Önkoşullar

- Node.js 18 veya daha yüksek
- pnpm
- The Odds API'den API anahtarı (gerekli)

### Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/kullaniciadi/bet-app.git
   cd bet-app
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   pnpm install
   ```

3. API anahtarlarınız ile bir `.env.local` dosyası oluşturun:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=firebase_api_anahtariniz
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=firebase_auth_domaininiz
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=firebase_proje_id'niz
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firebase_storage_bucket'iniz
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=firebase_messaging_sender_id'niz
   NEXT_PUBLIC_FIREBASE_APP_ID=firebase_app_id'niz
   NEXT_PUBLIC_BET_APP_API_KEY=the_odds_api_anahtariniz
   ```

4. Geliştirme sunucusunu başlatın:
   ```bash
   pnpm dev
   ```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## UI Bileşenleri

Uygulama, Framer Motion animasyonları ile bir dizi yeniden kullanılabilir UI bileşeni içerir:
- **Badge**: Durum göstergeleri
- **Button**: Yükleme durumları ve hover animasyonları ile özelleştirilebilir buton
- **Card**: Hover efektleri ile kapsayıcı bileşen
- **Input**: Input bileşenleri
- **PageTransition**: Sayfa geçişleri
- **Skeleton**: Yükleme durumu yer tutucuları
- **Spinner**: Yükleme durumu yer tutucuları

## Durum Yönetimi

Uygulama, durum yönetimi için Redux kullanır:

### Redux (Global Durum)
- Spor verileri
- Etkinlik verileri
- Sepet verileri

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için LICENSE dosyasına bakın.
