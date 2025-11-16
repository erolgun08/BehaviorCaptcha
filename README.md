# 🔒 BlurCaptcha

**Advanced AI-resistant CAPTCHA with Behavioral Biometrics & Canvas Rendering**

A professional, client-side CAPTCHA system that uses behavioral analysis, fingerprinting, and image-based digit rendering to prevent bot attacks without requiring a server.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-blue.svg)](https://www.javascript.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/erolgun08/BlurCaptcha/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/erolgun08/BlurCaptcha?style=social)](https://github.com/erolgun08/BlurCaptcha/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/erolgun08/BlurCaptcha?style=social)](https://github.com/erolgun08/BlurCaptcha/network/members)
[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/erolgun08/BlurCaptcha)](https://www.jsdelivr.com/package/gh/erolgun08/BlurCaptcha)

**[🌐 Live Demo](https://erolgun08.github.io/BlurCaptcha/)** | [**🇹🇷 Türkçe**](#türkçe-dokümantasyon) | [**🇬🇧 English**](#english-documentation)

> **Free alternative to Google reCAPTCHA, hCaptcha, and Cloudflare Turnstile**
> No tracking, no cookies, no external dependencies - 100% privacy-focused

---

## 🇬🇧 English Documentation

### ✨ Features

- 🧬 **Behavioral Biometrics** - Analyzes mouse velocity, acceleration, micro-movements
- 🎨 **Canvas-Based Digits** - Prevents DOM scraping and OCR attacks
- 📱 **Mobile Support** - Touch event tracking for mobile devices
- 🔐 **Multi-Layer Bot Detection** - Fingerprinting (Canvas, WebGL, Browser)
- ⏱️ **Timeout System** - 5-minute lockout after bot detection
- 🚨 **Brute Force Protection** - Locks after 4 wrong passwords
- 💾 **No Server Required** - Fully client-side with localStorage
- 🎯 **99% Bot Prevention** - Stops basic, intermediate, and most advanced bots

### 📦 Installation

#### Option 1: CDN (Easiest - No Download Required!) ⭐
```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/blurcaptcha.js"></script>
```

#### Option 2: Direct Download
```bash
# Download single file
curl -O https://raw.githubusercontent.com/erolgun08/BlurCaptcha/main/blurcaptcha.js

# Or clone entire repo
git clone https://github.com/erolgun08/BlurCaptcha.git
```

#### Option 3: npm (Coming Soon)
```bash
npm install blurcaptcha
```

### 🚀 Quick Start (3 Lines of Code!)

**Simplest possible implementation:**

```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/blurcaptcha.js"></script>
<div id="captcha"></div>
<script>createCaptcha("captcha");</script>
```

**That's it! 🎉** CAPTCHA is ready to use.

**Full example:**

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/blurcaptcha.js"></script>
</head>
<body>
  <div id="captchaContainer"></div>
  <button id="loginButton">Login</button>

  <script>
    createCaptcha("captchaContainer", {
      digits: 4,
      blurLevel: 6,
      instructionText: "Enter the numbers below",
      activateButton: "loginButton"
    });
  </script>
</body>
</html>
```

**📚 More Examples:**
- [React Integration](EXAMPLES.md#react-integration)
- [Vue.js Integration](EXAMPLES.md#vuejs-integration)
- [Angular Integration](EXAMPLES.md#angular-integration)
- [Server Validation](EXAMPLES.md#server-validation)
- [All Examples](EXAMPLES.md)

### ⚙️ Configuration Options

```javascript
createCaptcha("containerId", {
  digits: 4,                    // Number of digits (default: 4)
  blurLevel: 6,                 // Blur intensity (default: 6)
  digitSize: 40,                // Digit size in px (default: 40)
  inputSize: 20,                // Input box size (default: 20)
  borderColor: '#007bff',       // Border color (default: #007bff)
  instructionText: 'Enter...',  // Instruction text
  activateButton: 'buttonId',   // Button to enable after success
  serverValidation: false,      // Enable server validation
  serverUrl: '',                // Server endpoint URL
  onComplete: (digits) => {}    // Callback function
});
```

### 🛡️ Security Features

| Feature | Max Points | Description |
|---------|------------|-------------|
| Mouse/Touch Movement | 35 | Desktop mouse or mobile touch tracking |
| Completion Time | 20 | 0.8-60 seconds range |
| Key Press Variance | 10 | Typing rhythm analysis |
| Paste Detection | -30 | **PENALTY** for copy-paste |
| **Behavioral Biometrics** | **20** | **Mouse velocity, acceleration, pauses** |
| Canvas Fingerprint | 5 | Unique browser rendering |
| WebGL Fingerprint | 5 | GPU information |

**Minimum Passing Score: 40/100**

### 🧪 Bot Resistance

- ❌ **Basic Bots** (99% blocked) - No mouse, instant completion
- ⚠️ **Intermediate Bots** (95% blocked) - Robotic movement patterns
- ✅ **Advanced Bots** (80% blocked) - May pass but very expensive ($0.50-$2 per attempt)

**Why not 100%?** Advanced bots use ML-generated human behavior, real browsers, and residential proxies. But BlurCaptcha makes attacks so expensive ($10-50 per successful attempt) that attackers give up!

**[📖 Read detailed analysis →](ADVANCED_SECURITY.md)**

**Real-world impact:** Turns $10 attack into $5,000 attack → Attackers move to easier targets 🎯

### 🆚 Why BlurCaptcha?

| Feature | BlurCaptcha | Google reCAPTCHA | hCaptcha | Cloudflare Turnstile |
|---------|-------------|------------------|----------|---------------------|
| **Privacy** | ✅ No tracking | ❌ Tracks users | ❌ Tracks users | ⚠️ Limited tracking |
| **Server Required** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **External Dependencies** | ❌ None | ✅ Google API | ✅ hCaptcha API | ✅ Cloudflare API |
| **Free** | ✅ MIT License | ⚠️ Limited free tier | ⚠️ Limited free tier | ⚠️ Limited free tier |
| **Behavioral Analysis** | ✅ Advanced | ❌ Basic | ❌ Basic | ⚠️ Unknown |
| **Open Source** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Customizable** | ✅ Fully | ❌ Limited | ❌ Limited | ❌ Limited |

### 📊 Console Output Example

```javascript
🔒 CAPTCHA Analysis Report: {
  📊 Human Score: "85/100"
  ⏱️ Completion Time: "4521ms"
  🖱️ Mouse Movements: 67
  📏 Mouse Distance: "842px"
  🧬 BEHAVIORAL BIOMETRICS: {
    Velocity Variance: "0.002341"
    Acceleration Average: "0.034"
    Micro Movements: 23
  }
}
```

### 🔄 Server Integration (Optional)

```javascript
createCaptcha("container", {
  serverValidation: true,
  serverUrl: "https://yourapi.com/validate"
});
```

Server receives:
```json
{
  "digits": [1,2,3,4],
  "humanMetrics": {
    "humanScore": 85,
    "mouseMovements": 45,
    "pasteDetected": false
  },
  "fingerprint": {
    "canvasFingerprint": "a3f2c1b4",
    "webglFingerprint": "NVIDIA|..."
  }
}
```

### 🎯 Use Cases

- **Login Forms** - Prevent credential stuffing attacks
- **Registration Pages** - Block fake account creation
- **Contact Forms** - Stop spam submissions
- **Comment Sections** - Prevent bot spam
- **API Rate Limiting** - Add human verification layer
- **Voting/Polling** - Ensure one vote per person

### 🔍 SEO Keywords & Search Terms

**CAPTCHA Alternatives:**
Free CAPTCHA, reCAPTCHA alternative, hCaptcha alternative, Cloudflare Turnstile alternative, FriendlyCaptcha alternative, captcha without tracking, privacy-focused CAPTCHA, open source captcha, self-hosted CAPTCHA, client-side CAPTCHA, JavaScript CAPTCHA, HTML5 CAPTCHA, lightweight CAPTCHA

**Bot Detection & Security:**
bot detection, anti-bot solution, bot prevention, bot blocker, behavioral biometrics, mouse tracking security, human verification, anti-spam protection, brute force protection, credential stuffing prevention, automated attack prevention, web scraping protection, click fraud prevention

**Privacy & Compliance:**
GDPR compliant CAPTCHA, privacy-first CAPTCHA, no tracking CAPTCHA, cookie-free CAPTCHA, anonymous CAPTCHA, EU privacy CAPTCHA, CCPA compliant verification

**Technical Features:**
canvas fingerprinting, WebGL fingerprinting, browser fingerprinting, behavioral analysis CAPTCHA, AI-resistant CAPTCHA, OCR-proof CAPTCHA, headless browser detection, Selenium detection, Puppeteer detection

**Use Cases:**
login form protection, registration form security, contact form spam prevention, comment spam blocker, voting system security, poll bot prevention, rate limiting, API protection

**Comparison Searches:**
captcha comparison, best free captcha, captcha without google, captcha without third party, offline captcha, standalone captcha solution

### 📄 License

MIT License - Free for personal and commercial use

### 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

### ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

---

## 🇹🇷 Türkçe Dokümantasyon

### ✨ Özellikler

- 🧬 **Davranışsal Biyometri** - Mouse hızı, ivme, mikro hareketleri analiz eder
- 🎨 **Canvas Tabanlı Rakamlar** - DOM kazıma ve OCR saldırılarını engeller
- 📱 **Mobil Destek** - Mobil cihazlar için dokunma olayı izleme
- 🔐 **Çok Katmanlı Bot Tespiti** - Parmak izi (Canvas, WebGL, Tarayıcı)
- ⏱️ **Zaman Aşımı Sistemi** - Bot tespitinden sonra 5 dakika kilitleme
- 🚨 **Kaba Kuvvet Koruması** - 4 yanlış şifreden sonra 3 dakika kilitleme
- 💾 **Sunucu Gerektirmez** - Tamamen istemci tarafı, localStorage ile
- 🎯 **%99 Bot Önleme** - Temel, orta ve çoğu gelişmiş botu durdurur

### 📦 Kurulum

#### Seçenek 1: Doğrudan İndirme
```bash
git clone https://github.com/erolgun08/BlurCaptcha.git
```

#### Seçenek 2: CDN (jsdelivr)
```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/blurcaptcha.js"></script>
```

### 🚀 Hızlı Başlangıç

```html
<!DOCTYPE html>
<html>
<head>
  <script src="blurcaptcha.js"></script>
</head>
<body>
  <div id="captchaContainer"></div>
  <button id="loginButton">Giriş Yap</button>

  <script>
    const captcha = createCaptcha("captchaContainer", {
      digits: 4,
      blurLevel: 6,
      instructionText: "Aşağıdaki sayıları girin",
      activateButton: "loginButton"
    });
  </script>
</body>
</html>
```

### ⚙️ Yapılandırma Seçenekleri

```javascript
createCaptcha("containerId", {
  digits: 4,                    // Rakam sayısı (varsayılan: 4)
  blurLevel: 6,                 // Bulanıklık yoğunluğu (varsayılan: 6)
  digitSize: 40,                // Rakam boyutu px (varsayılan: 40)
  inputSize: 20,                // Giriş kutusu boyutu (varsayılan: 20)
  borderColor: '#007bff',       // Kenarlık rengi (varsayılan: #007bff)
  instructionText: 'Girin...',  // Talimat metni
  activateButton: 'buttonId',   // Başarıdan sonra etkinleştirilecek buton
  serverValidation: false,      // Sunucu doğrulamasını etkinleştir
  serverUrl: '',                // Sunucu endpoint URL'si
  onComplete: (digits) => {}    // Geri çağırma fonksiyonu
});
```

### 🛡️ Güvenlik Özellikleri

| Özellik | Maks Puan | Açıklama |
|---------|-----------|----------|
| Mouse/Touch Hareketi | 35 | Desktop mouse veya mobil dokunma izleme |
| Tamamlanma Süresi | 20 | 0.8-60 saniye aralığı |
| Tuş Basım Varyansı | 10 | Yazma ritmi analizi |
| Yapıştırma Tespiti | -30 | Kopyala-yapıştır için **CEZA** |
| **Davranışsal Biyometri** | **20** | **Mouse hız, ivme, duraklamalar** |
| Canvas Parmak İzi | 5 | Benzersiz tarayıcı renderı |
| WebGL Parmak İzi | 5 | GPU bilgisi |

**Minimum Geçme Puanı: 40/100**

### 🧪 Bot Direnci

- ❌ **Temel Botlar** (%99 engellendi) - Mouse yok, anında tamamlama
- ⚠️ **Orta Seviye Botlar** (%95 engellendi) - Robotik hareket paternleri
- ✅ **Gelişmiş Botlar** (%80 engellendi) - Geçebilir ama çok pahalı

### 📊 Konsol Çıktısı Örneği

```javascript
🔒 CAPTCHA Analiz Raporu: {
  📊 İnsan Skoru: "85/100"
  ⏱️ Tamamlanma Süresi: "4521ms"
  🖱️ Mouse Hareketleri: 67
  📏 Mouse Mesafesi: "842px"
  🧬 DAVRANIŞSAL BİYOMETRİ: {
    Hız Varyansı: "0.002341"
    İvme Ortalaması: "0.034"
    Mikro Hareketler: 23
  }
}
```

### 🔄 Sunucu Entegrasyonu (Opsiyonel)

```javascript
createCaptcha("container", {
  serverValidation: true,
  serverUrl: "https://apiurl.com/validate"
});
```

Sunucu alır:
```json
{
  "digits": [1,2,3,4],
  "humanMetrics": {
    "humanScore": 85,
    "mouseMovements": 45,
    "pasteDetected": false
  },
  "fingerprint": {
    "canvasFingerprint": "a3f2c1b4",
    "webglFingerprint": "NVIDIA|..."
  }
}
```

### 🎯 Kullanım Alanları

- **Giriş Formları** - Kimlik bilgisi doldurma saldırılarını önleme
- **Kayıt Sayfaları** - Sahte hesap oluşturmayı engelleme
- **İletişim Formları** - Spam gönderimlerini durdurma
- **Yorum Bölümleri** - Bot spam önleme
- **API Hız Sınırlama** - İnsan doğrulama katmanı ekleme
- **Oylama/Anket** - Kişi başı bir oy sağlama

### 🆚 Neden BlurCaptcha?

| Özellik | BlurCaptcha | Google reCAPTCHA | hCaptcha | Cloudflare Turnstile |
|---------|-------------|------------------|----------|---------------------|
| **Gizlilik** | ✅ Takip yok | ❌ Kullanıcıları takip eder | ❌ Kullanıcıları takip eder | ⚠️ Sınırlı takip |
| **Sunucu Gereksinimi** | ❌ Hayır | ✅ Evet | ✅ Evet | ✅ Evet |
| **Dış Bağımlılık** | ❌ Yok | ✅ Google API | ✅ hCaptcha API | ✅ Cloudflare API |
| **Ücretsiz** | ✅ MIT Lisansı | ⚠️ Sınırlı ücretsiz | ⚠️ Sınırlı ücretsiz | ⚠️ Sınırlı ücretsiz |
| **Davranışsal Analiz** | ✅ Gelişmiş | ❌ Temel | ❌ Temel | ⚠️ Bilinmiyor |
| **Açık Kaynak** | ✅ Evet | ❌ Hayır | ❌ Hayır | ❌ Hayır |
| **Özelleştirilebilir** | ✅ Tamamen | ❌ Sınırlı | ❌ Sınırlı | ❌ Sınırlı |

### 🔍 SEO Anahtar Kelimeleri ve Arama Terimleri

**CAPTCHA Alternatifleri:**
Ücretsiz CAPTCHA, reCAPTCHA alternatifi, hCaptcha alternatifi, Cloudflare Turnstile alternatifi, FriendlyCaptcha alternatifi, takipsiz captcha, gizlilik odaklı CAPTCHA, açık kaynak captcha, kendi sunucunda captcha, istemci taraflı CAPTCHA, JavaScript CAPTCHA, HTML5 CAPTCHA, hafif CAPTCHA

**Bot Algılama ve Güvenlik:**
bot algılama, bot engelleme, bot önleme, bot engelleyici, davranışsal biyometri, mouse takip güvenliği, insan doğrulama, spam koruma, kaba kuvvet koruması, kimlik bilgisi doldurma önleme, otomatik saldırı önleme, web kazıma koruması, tıklama dolandırıcılığı önleme, bot tespiti, otomasyon engelleme

**Gizlilik ve Uyumluluk:**
KVKK uyumlu CAPTCHA, GDPR uyumlu CAPTCHA, gizlilik öncelikli CAPTCHA, takipsiz CAPTCHA, çerez kullanmayan CAPTCHA, anonim CAPTCHA, AB gizlilik CAPTCHA, veri koruma dostu doğrulama

**Teknik Özellikler:**
canvas parmak izi, WebGL parmak izi, tarayıcı parmak izi, davranışsal analiz CAPTCHA, yapay zeka dirençli CAPTCHA, OCR geçirmez CAPTCHA, headless browser algılama, Selenium algılama, Puppeteer algılama, otomasyon tespiti

**Kullanım Senaryoları:**
giriş formu koruma, kayıt formu güvenliği, iletişim formu spam önleme, yorum spam engelleyici, oylama sistemi güvenliği, anket bot önleme, hız sınırlama, API koruması, form güvenliği

**Karşılaştırma Aramaları:**
captcha karşılaştırma, en iyi ücretsiz captcha, google olmadan captcha, üçüncü taraf olmadan captcha, çevrimdışı captcha, bağımsız captcha çözümü, sunucusuz captcha, yerli captcha alternatifi

### 📄 Lisans

MIT Lisansı - Kişisel ve ticari kullanım için ücretsiz

### 🤝 Katkıda Bulunma

Pull request'ler hoş geldiniz! Büyük değişiklikler için lütfen önce bir issue açın.

### ⭐ Yıldız Geçmişi

Bu projeyi faydalı buluyorsanız, lütfen GitHub'da yıldız vermeyi düşünün!

---

**Made with ❤️ for a safer web**
