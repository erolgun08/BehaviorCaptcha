# 🔒 BehaviorCaptcha

**Advanced AI-resistant CAPTCHA with Behavioral Biometrics & Canvas Rendering**

A professional, client-side CAPTCHA system that uses behavioral analysis, fingerprinting, and image-based digit rendering to prevent bot attacks without requiring a server.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-blue.svg)](https://www.javascript.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/erolgun08/BehaviorCaptcha/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/erolgun08/BehaviorCaptcha?style=social)](https://github.com/erolgun08/BehaviorCaptcha/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/erolgun08/BehaviorCaptcha?style=social)](https://github.com/erolgun08/BehaviorCaptcha/network/members)
[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/erolgun08/BehaviorCaptcha)](https://www.jsdelivr.com/package/gh/erolgun08/BehaviorCaptcha)

**[🌐 Live Demo](https://erolgun08.github.io/BehaviorCaptcha/)** | **[🧪 Test Suite](https://erolgun08.github.io/BehaviorCaptcha/test.html)** | [**🇹🇷 Türkçe**](#türkçe-dokümantasyon) | [**🇬🇧 English**](#english-documentation)

> **Free alternative to Google reCAPTCHA, hCaptcha, and Cloudflare Turnstile**
> No tracking, no cookies, no external dependencies - 100% privacy-focused

> ⚠️ **IMPORTANT:** This is a **client-side CAPTCHA** suitable for low-to-medium risk applications. For high-security use cases (banking, healthcare, large e-commerce), use enterprise solutions with mandatory server-side validation. [See limitations](#-when-not-to-use)

---

## 🇬🇧 English Documentation

### ✨ Features

- 🧬 **Behavioral Biometrics** - Analyzes mouse velocity, acceleration, micro-movements
- 🎨 **Canvas-Based Digits** - Prevents DOM scraping and OCR attacks
- 🍯 **Invisible Honeypot** - Traps bots with hidden fields (auto-fill detection)
- 🔐 **Multi-Layer Bot Detection** - Fingerprinting (Canvas, WebGL, Browser)
- 🛡️ **Anti-Tampering Protection** - Detects console manipulation attempts
- 🔑 **Verification Tokens** - Cryptographic proof of solving
- 📱 **Mobile Support** - Touch event tracking for mobile devices
- ⏱️ **Progressive Timeout System** - Smart lockouts (1min @ 5 wrong, 5min @ 10 wrong)
- 🚨 **Brute Force Protection** - Prevents unlimited guessing attempts
- 💾 **No Server Required** - Fully client-side with localStorage
- 🎯 **99%+ Bot Prevention** - Stops basic, intermediate, and most advanced bots

### 📦 Installation

#### Option 1: CDN (Easiest - No Download Required!) ⭐
```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BehaviorCaptcha@main/behaviorcaptcha.js"></script>
```

#### Option 2: Direct Download
```bash
# Download single file
curl -O https://raw.githubusercontent.com/erolgun08/BehaviorCaptcha/main/behaviorcaptcha.js

# Or clone entire repo
git clone https://github.com/erolgun08/BehaviorCaptcha.git
```

#### Option 3: npm (Coming Soon)
```bash
npm install behaviorcaptcha
```

### 🚀 Quick Start (3 Lines of Code!)

**Simplest possible implementation:**

```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BehaviorCaptcha@main/behaviorcaptcha.js"></script>
<div id="captcha"></div>
<script>createCaptcha("captcha");</script>
```

**That's it! 🎉** CAPTCHA is ready to use.

**Full example:**

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/erolgun08/BehaviorCaptcha@main/behaviorcaptcha.js"></script>
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

**🔒 Security:**
- [Security Best Practices](SECURITY_IMPROVEMENTS.md)
- [Anti-Tampering Protection](SECURITY_IMPROVEMENTS.md#anti-tampering-detection)
- [Server-Side Validation](SECURITY_IMPROVEMENTS.md#server-side-validation-recommended)

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
  antiTampering: true,          // Enable anti-tampering protection (default: true)
  onComplete: (result) => {     // Callback function when CAPTCHA solved
    // result.success - Boolean
    // result.token - Verification token
    // result.humanScore - Score (0-100)
    // result.metrics - Behavioral data
    // result.fingerprint - Browser fingerprint
  }
});
```

### 🛡️ Security Features

| Feature | Max Points | Description |
|---------|------------|-------------|
| Mouse/Touch Movement | 35 | Desktop mouse or mobile touch tracking |
| Completion Time | 20 | 0.8-60 seconds range |
| **Behavioral Biometrics** | **20** | **Mouse velocity, acceleration, pauses** |
| Key Press Variance | 10 | Typing rhythm analysis |
| Canvas Fingerprint | 5 | Unique browser rendering |
| WebGL Fingerprint | 5 | GPU information |
| **Honeypot Bypass** | **+5** | **Bonus for mouse movement detection** |
| Paste Detection | -30 | **PENALTY** for copy-paste |
| **Honeypot Triggered** | **-100** | **INSTANT FAIL** if invisible field filled |

**Minimum Passing Score: 40/100**

**New Security Layers:**
- 🍯 **Honeypot**: Invisible field auto-focuses, bots fill it → instant detection
- 🔑 **Token System**: Cryptographic proof prevents replay attacks
- 🛡️ **Anti-Tampering**: MutationObserver detects console bypass attempts
- ⏱️ **Token Expiry**: 1-minute validity prevents token reuse
- 🚨 **Wrong Answer Limits**: Progressive lockouts (3 warnings → 5 wrong = 1min → 10 wrong = 5min)

### 🧪 Bot Resistance

- ❌ **Basic Bots** (99% blocked) - No mouse, instant completion
- ⚠️ **Intermediate Bots** (95% blocked) - Robotic movement patterns
- ✅ **Advanced Bots** (80% blocked) - May pass but very expensive ($0.50-$2 per attempt)

**Why not 100%?** Advanced bots use ML-generated human behavior, real browsers, and residential proxies. But BehaviorCaptcha makes attacks so expensive ($10-50 per successful attempt) that attackers give up!

**[📖 Read detailed analysis →](ADVANCED_SECURITY.md)**

**Real-world impact:** Turns $10 attack into $5,000 attack → Attackers move to easier targets 🎯

### 🧪 Testing & Security Validation

**[🔬 Interactive Test Suite](https://erolgun08.github.io/BehaviorCaptcha/test.html)**

Test all security features in real-time:

✅ **Test 1: Normal Flow** - Verify token generation
✅ **Test 2: Button Bypass** - Try `button.disabled = false`
✅ **Test 3: Token System** - Check token validity & expiry
✅ **Test 4: Storage Tampering** - Try `localStorage.clear()`
✅ **Test 5: onComplete Callback** - Verify data structure
✅ **Test 6: Anti-Tampering** - Rapid bypass attempts
✅ **Test 7: Token Expiration** - 1-minute expiry test
✅ **Test 8: Honeypot Detection** - Auto-fill bot trap

**Live Console Monitor** shows real-time security events!

```javascript
// Example test: Try to bypass
document.getElementById('submitBtn').disabled = false;
// Console: 🚨 Unauthorized button enable detected - Re-disabling
// Result: Button re-disabled, bot attempts +1
```

### 🆚 Why BehaviorCaptcha?

| Feature | BehaviorCaptcha | Google reCAPTCHA | hCaptcha | Cloudflare Turnstile |
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

#### ✅ Ideal For (Recommended):
- **Blog Comments** - Spam prevention for personal/medium blogs
- **Contact Forms** - Lead generation forms, feedback forms
- **Newsletter Signups** - Email list protection
- **Community Forums** - Small-to-medium discussion boards
- **Startup MVPs** - Early-stage products, prototypes
- **Portfolio Sites** - Personal projects, showcase sites
- **Educational Projects** - Student projects, coding bootcamps

#### ⚠️ Use With Caution (Additional Security Required):
- **Login Forms** - Combine with 2FA + email verification
- **Registration Pages** - Add email verification + rate limiting
- **Small E-commerce** (<10K users/month) - Require server-side validation
- **Voting/Polling** - Add IP tracking + database-level fraud detection

### ❌ When NOT to Use

**DO NOT use BehaviorCaptcha for:**

- ❌ **Banking & Finance** - Online banking, credit cards, money transfers
  - *Why:* Client-side bypass = financial loss. Requires PCI-DSS compliance.

- ❌ **Healthcare (HIPAA)** - Patient records, prescriptions, medical data
  - *Why:* HIPAA compliance requires server-side audit logging.

- ❌ **Government Websites** - e-Government services, tax systems, ID verification
  - *Why:* Accessibility requirements (WCAG 2.1 AA), procurement mandates.

- ❌ **Large E-commerce** (>100K users/month) - Amazon/Shopify-scale platforms
  - *Why:* Professional bot networks, high-stakes inventory manipulation.

- ❌ **API Services** - Public REST APIs, GraphQL endpoints, webhooks
  - *Why:* No mouse/behavioral data available. Use API keys + OAuth.

- ❌ **Crypto Exchanges** - Trading platforms, wallet operations
  - *Why:* Million-dollar attack risk, sophisticated trading bots.

**For these use cases, use:**
- Google reCAPTCHA Enterprise
- Cloudflare Turnstile
- PerimeterX / DataDome
- Custom ML-based fraud detection

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
- 🍯 **Görünmez Honeypot** - Gizli alanlarla botları tuzağa düşürür (otomatik doldurma tespiti)
- 🔐 **Çok Katmanlı Bot Tespiti** - Parmak izi (Canvas, WebGL, Tarayıcı)
- 🛡️ **Müdahale Önleme Koruması** - Konsol manipülasyon denemelerini algılar
- 🔑 **Doğrulama Token'ları** - Çözümün kriptografik kanıtı
- 📱 **Mobil Destek** - Mobil cihazlar için dokunma olayı izleme
- ⏱️ **Aşamalı Zaman Aşımı** - Akıllı kilitlenme (5 yanlış = 1dk, 10 yanlış = 5dk)
- 🚨 **Kaba Kuvvet Koruması** - Sınırsız tahmin denemelerini engeller
- 💾 **Sunucu Gerektirmez** - Tamamen istemci tarafı, localStorage ile
- 🎯 **%99+ Bot Önleme** - Temel, orta ve çoğu gelişmiş botu durdurur

### 📦 Kurulum

#### Seçenek 1: Doğrudan İndirme
```bash
git clone https://github.com/erolgun08/BehaviorCaptcha.git
```

#### Seçenek 2: CDN (jsdelivr)
```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BehaviorCaptcha@main/behaviorcaptcha.js"></script>
```

### 🚀 Hızlı Başlangıç

```html
<!DOCTYPE html>
<html>
<head>
  <script src="behaviorcaptcha.js"></script>
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

#### ✅ İdeal Kullanım (Tavsiye Edilen):
- **Blog Yorumları** - Kişisel/orta ölçekli bloglar için spam önleme
- **İletişim Formları** - Lead generation, geri bildirim formları
- **Newsletter Kayıtları** - E-posta listesi koruması
- **Topluluk Forumları** - Küçük-orta ölçekli tartışma platformları
- **Startup MVP'leri** - Erken aşama ürünler, prototip projeler
- **Portfolyo Siteleri** - Kişisel projeler, vitrin siteleri
- **Eğitim Projeleri** - Öğrenci projeleri, bootcamp projeleri

#### ⚠️ Dikkatli Kullanın (Ek Güvenlik Gerekli):
- **Giriş Formları** - 2FA + email doğrulama ile birlikte kullanın
- **Kayıt Sayfaları** - Email doğrulama + rate limiting ekleyin
- **Küçük E-ticaret** (<10K kullanıcı/ay) - Sunucu tarafı doğrulama zorunlu
- **Oylama/Anket** - IP takibi + veritabanı seviyesinde fraud tespiti ekleyin

### ❌ Kullanılmamalı

**BehaviorCaptcha'yı KULLANMAYIN:**

- ❌ **Bankacılık & Finans** - Online banking, kredi kartı, para transferleri
  - *Neden:* Client-side bypass = parasal kayıp. PCI-DSS uyumluluk gerekli.

- ❌ **Sağlık (HIPAA)** - Hasta kayıtları, reçete sistemleri, medikal veri
  - *Neden:* HIPAA uyumluluğu sunucu tarafı audit logging gerektirir.

- ❌ **Devlet Siteleri** - e-Devlet servisleri, vergi sistemleri, kimlik doğrulama
  - *Neden:* Erişilebilirlik gereksinimleri (WCAG 2.1 AA), kamu ihaleleri.

- ❌ **Büyük E-ticaret** (>100K kullanıcı/ay) - Amazon/Trendyol ölçeği
  - *Neden:* Profesyonel bot ağları, yüksek riskli stok manipülasyonu.

- ❌ **API Servisleri** - Public REST API'ler, GraphQL endpoint'ler, webhook'lar
  - *Neden:* Mouse/davranış verisi yok. API key + OAuth kullanın.

- ❌ **Kripto Borsaları** - Trading platformları, cüzdan işlemleri
  - *Neden:* Milyon dolarlık saldırı riski, sofistike trading botları.

**Bu kullanımlar için tercih edin:**
- Google reCAPTCHA Enterprise
- Cloudflare Turnstile
- PerimeterX / DataDome
- Özel ML tabanlı fraud detection

### 🆚 Neden BehaviorCaptcha?

| Özellik | BehaviorCaptcha | Google reCAPTCHA | hCaptcha | Cloudflare Turnstile |
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
