# BlurCaptcha

**BlurCaptcha**, botlara karşı koruma sağlamak için dinamik bulanıklaştırma ve kullanıcı dostu doğrulama süreçleri içeren modern bir CAPTCHA çözümüdür.

## ✨ Özellikler

- **🚀 Bağımsız**: Dış sunucuya bağımlılık yok, tamamen client-side çalışır
- **🔒 Güvenli**: Opsiyonel sunucu taraflı doğrulama desteği
- **🤖 Bot Koruması**: Mouse hareketleri ve tıklama kontrolü ile bot tespiti
- **📊 Akıllı Tracking**: Otomatik hatalı giriş izleme ve adaptif gösterim
- **♿ Erişilebilir**: ARIA etiketleri ve tam klavye navigasyonu
- **🎨 Özelleştirilebilir**: Kolay tema ve boyut ayarları
- **⚡ Performanslı**: Hafif ve hızlı (küçük dosya boyutu)
- **📱 Responsive**: Mobil uyumlu tasarım

## 🚀 Kurulum

### CDN ile Kullanım
```html
<script src="https://cdn.jsdelivr.net/npm/blurcaptcha"></script>
```

### NPM ile Kurulum
```bash
npm install blurcaptcha
```

## 📖 Kullanım

### Temel Kullanım

```html
<div id="captchaContainer"></div>
<button id="submitButton" disabled>Gönder</button>

<script>
const captcha = createCaptcha("captchaContainer", {
  digits: 4,
  blurLevel: 6,
  activateButton: "submitButton",
  onComplete: (digits) => {
    console.log('CAPTCHA tamamlandı:', digits.join(''));
  }
});
</script>
```

### Otomatik Hatalı Giriş Tracking

CAPTCHA, belirli sayıda hatalı girişten sonra otomatik olarak devreye girer:

```javascript
const captcha = createCaptcha("captchaContainer", {
  // Temel ayarlar
  digits: 4,
  autoShow: false, // Başlangıçta gizli

  // Hatalı giriş tracking
  trackFailedAttempts: true,
  failureThreshold: 2, // 2 hatalı girişten sonra göster

  // Callbacks
  onFailureThresholdReached: () => {
    alert('Çok fazla hatalı giriş! CAPTCHA zorunludur.');
  },

  onValidationSuccess: () => {
    document.getElementById('loginButton').disabled = false;
  }
});

// Login butonuna tıklandığında
function handleLogin() {
  if (username === 'admin' && password === 'correct') {
    captcha.recordSuccess(); // Başarılı giriş
  } else {
    captcha.recordFailure(); // Hatalı giriş
  }
}
```

### Her Zaman Aktif CAPTCHA

```javascript
const captcha = createCaptcha("captchaContainer", {
  autoShow: true, // Her zaman görünür
  digits: 5,

  onValidationSuccess: () => {
    // CAPTCHA çözüldüğünde
    submitForm();
  }
});
```

### Sunucu Taraflı Doğrulama (Opsiyonel)

İleri seviye güvenlik için sunucu taraflı doğrulama kullanabilirsiniz:

```javascript
const captcha = createCaptcha("captchaContainer", {
  securityMode: 'server', // Sunucu taraflı doğrulama (opsiyonel)
  serverUrl: '/api/captcha', // API endpoint

  onValidationSuccess: () => {
    console.log('Sunucu doğrulaması başarılı');
  },

  onValidationFailed: () => {
    console.log('Sunucu doğrulaması başarısız');
  }
});
```

**Not:** Varsayılan olarak client-side çalışır ve dış sunucuya bağımlı değildir.

## ⚙️ Yapılandırma Seçenekleri

### Temel Ayarlar

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `digits` | number | `4` | CAPTCHA'daki rakam sayısı |
| `blurLevel` | number | `6` | Bulanıklık seviyesi (0-10) |
| `digitSize` | number | `40` | Rakam boyutu (px) |
| `inputSize` | number | `20` | Giriş alanı boyutu (px) |
| `borderColor` | string | `'#007bff'` | Kenarlık rengi |
| `textColor` | string | `'#000'` | Rakam rengi |
| `instructionText` | string | `'Lütfen aşağıdaki sayıları girin'` | Talimat metni |

### Güvenlik Ayarları

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `securityMode` | string | `'client'` | `'client'` (varsayılan) veya `'server'` (opsiyonel) |
| `serverUrl` | string | `'/api/captcha'` | Sunucu API URL'si (securityMode: 'server' için) |

### Hatalı Giriş Tracking

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `trackFailedAttempts` | boolean | `true` | Hatalı giriş takibi |
| `failureThreshold` | number | `2` | Kaç hata sonrası CAPTCHA gösterilir |
| `autoShow` | boolean | `false` | Başlangıçta görünür mü |

### Erişilebilirlik

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `ariaLabel` | string | `'CAPTCHA Doğrulaması'` | ARIA label |
| `enableKeyboardNav` | boolean | `true` | Klavye navigasyonu |

### Callbacks

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| `onComplete` | function | CAPTCHA tamamlandığında çağrılır |
| `onFailureThresholdReached` | function | Hata eşiğine ulaşıldığında |
| `onValidationSuccess` | function | Doğrulama başarılı olduğunda |
| `onValidationFailed` | function | Doğrulama başarısız olduğunda |

### Diğer

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `debugMode` | boolean | `false` | Console'da log göster |
| `activateButton` | string | `null` | Aktifleşecek buton ID (eski API) |

## 🎮 Public API

```javascript
const captcha = createCaptcha("container", options);

// CAPTCHA tamamlandı mı?
captcha.isCompleted(); // true/false

// Hatalı giriş kaydet
captcha.recordFailure();

// Başarılı giriş kaydet
captcha.recordSuccess();

// Hatalı giriş sayısını al
captcha.getFailedAttempts(); // number

// CAPTCHA'yı göster
captcha.show();

// CAPTCHA'yı gizle
captcha.hide();

// CAPTCHA'yı sıfırla
captcha.reset();

// CAPTCHA'yı yok et
captcha.destroy();

// CAPTCHA görünür mü?
captcha.isVisible; // true/false
```

## 🔐 Sunucu Taraflı Entegrasyon

BlurCaptcha, sunucu taraflı doğrulama için aşağıdaki endpoint'leri bekler:

### POST `/api/captcha/generate`

CAPTCHA oluşturur ve token döner.

**Response:**
```json
{
  "token": "unique-session-token",
  "digits": [1, 2, 3, 4]
}
```

### POST `/api/captcha/validate`

CAPTCHA doğrulaması yapar.

**Request:**
```json
{
  "token": "unique-session-token",
  "digits": [1, 2, 3, 4]
}
```

**Response:**
```json
{
  "success": true
}
```

### Node.js (Express) Örnek Backend

```javascript
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());

// CAPTCHA oluştur
app.post('/api/captcha/generate', (req, res) => {
  const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
  const token = Math.random().toString(36).substring(7);

  req.session.captcha = {
    token,
    digits,
    expires: Date.now() + 5 * 60 * 1000 // 5 dakika
  };

  res.json({ token, digits });
});

// CAPTCHA doğrula
app.post('/api/captcha/validate', (req, res) => {
  const { token, digits } = req.body;
  const sessionCaptcha = req.session.captcha;

  if (!sessionCaptcha || sessionCaptcha.token !== token) {
    return res.status(400).json({ success: false, error: 'Invalid token' });
  }

  if (Date.now() > sessionCaptcha.expires) {
    return res.status(400).json({ success: false, error: 'CAPTCHA expired' });
  }

  const isValid = JSON.stringify(sessionCaptcha.digits) === JSON.stringify(digits);

  if (isValid) {
    delete req.session.captcha; // Tek kullanımlık
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid CAPTCHA' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## ♿ Erişilebilirlik Özellikleri

BlurCaptcha, WCAG 2.1 standartlarına uygun olarak tasarlanmıştır:

- **ARIA Labels**: Tüm input'lar uygun aria-label'lara sahip
- **ARIA Live Regions**: Durum değişiklikleri ekran okuyucular tarafından anons edilir
- **Klavye Navigasyonu**:
  - `Tab` - Sonraki input
  - `Shift+Tab` - Önceki input
  - `Arrow Left/Right` - Input'lar arası geçiş
  - `Backspace` - Önceki input'a dön ve temizle
- **Focus Management**: Otomatik focus yönetimi
- **Semantic HTML**: Uygun rol ve etiketler

## 🎨 Özelleştirme Örnekleri

### Koyu Tema

```javascript
createCaptcha("captchaContainer", {
  borderColor: '#bb86fc',
  textColor: '#ffffff',
  // CSS ile container'ı özelleştirin
});
```

### Büyük CAPTCHA

```javascript
createCaptcha("captchaContainer", {
  digitSize: 60,
  inputSize: 30,
  digits: 6,
  blurLevel: 8
});
```

## 🌐 Tarayıcı Desteği

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Opera 47+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Lisans

MIT

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 🔗 Bağlantılar

- [Demo](./demo.html)
- [GitHub](https://github.com/yourusername/blurcaptcha)
- [NPM](https://www.npmjs.com/package/blurcaptcha)

## 📞 Destek

Sorunlar için [GitHub Issues](https://github.com/yourusername/blurcaptcha/issues) kullanın.

---

**BlurCaptcha** ile web uygulamalarınızı botlara karşı güvenli hale getirin! 🛡️
