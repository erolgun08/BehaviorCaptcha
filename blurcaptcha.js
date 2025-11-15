class Captcha {
  constructor(containerId, options = {}) {
    const defaultSettings = {
      digits: 4,
      blurLevel: 6,
      digitSize: 40,
      inputSize: 20,
      borderColor: '#007bff',
      textColor: '#000',
      onComplete: () => {},
      activateButton: null,
      serverValidation: false,
      serverUrl: '',
      instructionText: 'Lütfen aşağıdaki sayıları girin',
    };

    this.settings = { ...defaultSettings, ...options };
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with ID "${containerId}" not found.`);
    }

    this.digits = Array.from({ length: this.settings.digits }, () => Math.floor(Math.random() * 10));
    this.firstInteractionComplete = false; // İlk mouse ve tıklama kontrolü yapılmamış
    this.botAttempts = parseInt(localStorage.getItem('captcha_bot_attempts') || '0', 10); // Bot denemelerini sakla

    // Timeout kontrolü
    this.checkTimeout();

    // Fingerprinting verileri
    this.fingerprint = this.generateFingerprint();

    // İnsan tespiti için metrikler
    this.humanMetrics = {
      mouseMovements: [],
      touchMovements: [], // Mobil touch hareketleri
      keyPressTimes: [],
      inputTimestamps: [],
      startTime: null,
      totalMouseDistance: 0,
      totalTouchDistance: 0,
      mouseEntered: false,
      touchUsed: false,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      pasteDetected: false,
      focusChanges: 0,

      // Behavioral Biometrics
      mouseVelocities: [],      // Hız değişimleri
      mouseAccelerations: [],   // İvme değişimleri
      mousePauses: 0,           // Durma sayısı
      mouseDirectionChanges: 0, // Yön değişimi
      microMovements: 0,        // Küçük titreşimler (<5px)
      angularChanges: [],       // Açı değişimleri
    };

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="captcha-container" style="position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <div class="instruction" style="font-size: 14px; color: #555; text-align: center;">${this.settings.instructionText}</div>
        <div class="captcha-wrapper" style="position: relative;">
          <canvas id="noiseCanvas" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 0;"></canvas>
          <div class="captcha" style="display: flex; gap: 5px; position: relative; z-index: 1;"></div>
        </div>
        <div class="input-row" style="display: flex; gap: 5px; margin-top: 5px;"></div>
        <div class="overlay" id="captchaOverlay" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); justify-content: center; align-items: center; z-index: 10;">
          <div class="checkmark" style="font-size: 50px; color: #28a745;">✔</div>
        </div>
      </div>
    `;

    const captcha = this.container.querySelector('.captcha');
    const inputRow = this.container.querySelector('.input-row');

    this.digits.forEach((digit, index) => {
      // Canvas ile rakam çiz (DOM'da metin olarak gösterme!)
      const digitCanvas = document.createElement('canvas');
      digitCanvas.width = this.settings.digitSize;
      digitCanvas.height = this.settings.digitSize;
      digitCanvas.style.border = `1px solid ${this.settings.borderColor}`;
      digitCanvas.style.borderRadius = '5px';
      digitCanvas.style.backgroundColor = '#f8f9fa';
      digitCanvas.style.filter = index === 0 ? 'none' : `blur(${this.settings.blurLevel}px)`;
      digitCanvas.style.position = 'relative';

      const ctx = digitCanvas.getContext('2d');

      // Rastgele transformasyon parametreleri
      const randomRotation = (Math.random() * 60 - 30) * Math.PI / 180; // -30 ile +30 derece (radyan)
      const randomSkewX = Math.random() * 0.4 - 0.2; // -0.2 ile +0.2
      const randomSkewY = Math.random() * 0.4 - 0.2;
      const randomOffsetX = Math.random() * 10 - 5;
      const randomOffsetY = Math.random() * 10 - 5;

      // Renk varyasyonları
      const randomHue = Math.floor(Math.random() * 360);
      const randomSaturation = Math.floor(Math.random() * 30) + 20;
      const randomLightness = Math.floor(Math.random() * 30) + 10;

      // Canvas'ı temizle ve transform uygula
      ctx.clearRect(0, 0, digitCanvas.width, digitCanvas.height);
      ctx.save();

      // Merkeze taşı
      ctx.translate(digitCanvas.width / 2, digitCanvas.height / 2);

      // Rotasyon ve skew
      ctx.rotate(randomRotation);
      ctx.transform(1, randomSkewY, randomSkewX, 1, randomOffsetX, randomOffsetY);

      // Rakamı çiz
      ctx.font = `bold ${this.settings.digitSize * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;

      // Text shadow
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = Math.random() * 2 - 1;
      ctx.shadowOffsetY = Math.random() * 2 - 1;

      ctx.fillText(digit.toString(), 0, 0);

      // Ekstra gürültü ekle (noise)
      for (let i = 0; i < 20; i++) {
        const nx = Math.random() * digitCanvas.width;
        const ny = Math.random() * digitCanvas.height;
        ctx.fillStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.2)`;
        ctx.fillRect(nx, ny, 1, 1);
      }

      ctx.restore();

      // Wrapper div oluştur (Canvas'ı içerecek)
      const digitElement = document.createElement('div');
      digitElement.style.display = 'inline-block';
      digitElement.style.position = 'relative';
      digitElement.appendChild(digitCanvas);

      // Input wrapper oluştur (disabled input tıklanamadığı için)
      const inputWrapper = document.createElement('div');
      inputWrapper.style.display = 'inline-block';
      inputWrapper.style.position = 'relative';
      inputWrapper.style.cursor = 'pointer';

      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.maxLength = 1;
      inputElement.disabled = true; // Başlangıçta devre dışı
      inputElement.style.width = `${this.settings.inputSize}px`;
      inputElement.style.height = `${this.settings.inputSize}px`;
      inputElement.style.fontSize = `${this.settings.inputSize * 0.6}px`;
      inputElement.style.textAlign = 'center';
      inputElement.style.border = `1px solid ${this.settings.borderColor}`;
      inputElement.style.borderRadius = '5px';
      inputElement.style.backgroundColor = index === 0 ? '#fff' : '#f8f9fa';
      inputElement.style.pointerEvents = index === 0 ? 'none' : 'auto'; // İlk input için pointer eventi wrapper'a

      // İlk input için görsel ipucu
      if (index === 0) {
        inputWrapper.style.boxShadow = '0 0 8px rgba(0, 123, 255, 0.5)'; // Mavi glow efekti - wrapper'a
        inputElement.placeholder = '?'; // Placeholder ekle
      }

      // Tuş basım süresi izleme
      let keyDownTime = 0;
      inputElement.addEventListener('keydown', () => {
        keyDownTime = Date.now();
      });

      inputElement.addEventListener('keyup', () => {
        if (keyDownTime > 0) {
          const pressDuration = Date.now() - keyDownTime;
          this.humanMetrics.keyPressTimes.push(pressDuration);
          keyDownTime = 0;
        }
      });

      // Paste tespiti
      inputElement.addEventListener('paste', (e) => {
        e.preventDefault(); // Paste'i engelle
        this.humanMetrics.pasteDetected = true;
        console.warn('⚠️ PASTE TESPİT EDİLDİ! Bot olabilir.');
      });

      // Focus/Blur tracking
      inputElement.addEventListener('focus', () => {
        this.humanMetrics.focusChanges++;
      });

      inputElement.addEventListener('input', () => {
        // Input zamanını kaydet
        this.humanMetrics.inputTimestamps.push(Date.now());

        // Girilen değer doğru rakam mı kontrol et
        if (inputElement.value === digit.toString()) {
          // Canvas'ın blur'unu kaldır
          const currentCanvas = digitElement.querySelector('canvas');
          if (currentCanvas) {
            currentCanvas.style.filter = 'none';
          }
          inputElement.disabled = true;

          if (index < this.digits.length - 1) {
            const nextWrapper = inputRow.children[index + 1]; // Wrapper'ı al
            const nextInput = nextWrapper.querySelector('input'); // Wrapper içindeki input'u al
            const nextDigit = captcha.children[index + 1];
            const nextCanvas = nextDigit.querySelector('canvas');
            nextInput.disabled = false;
            nextInput.style.backgroundColor = '#fff'; // Arka planı beyaz yap
            nextInput.focus(); // Sonraki input'a odaklan
            if (nextCanvas) {
              nextCanvas.style.filter = 'none'; // Blur'u kaldır
            }
          } else {
            // Son rakam - insan tespiti kontrolü yap
            if (this.settings.serverValidation) {
              this.validateWithServer();
            } else {
              this.validateHumanBehavior();
            }
          }

          if (this.settings.activateButton) {
            const button = document.getElementById(this.settings.activateButton);
            if (button) button.disabled = false;
          }
        } else {
          inputElement.value = '';
        }
      });

      // Wrapper'a tıklama eventi ekle
      inputWrapper.addEventListener('click', () => {
        if (!inputElement.disabled) return; // Zaten aktifse işlem yapma

        if (index === 0) {
          // İlk input - sadece tıklama ile aktif olur
          inputElement.disabled = false;
          inputElement.style.pointerEvents = 'auto'; // Pointer eventi geri aç
          inputElement.focus();
          inputWrapper.style.boxShadow = 'none'; // Glow efektini kaldır (wrapper'dan)
          inputElement.placeholder = ''; // Placeholder'ı kaldır
          this.firstInteractionComplete = true;

          // Başlangıç zamanını kaydet
          if (!this.humanMetrics.startTime) {
            this.humanMetrics.startTime = Date.now();
          }
        }
      });

      // Touch event desteği (Mobil)
      inputWrapper.addEventListener('touchstart', (e) => {
        if (!inputElement.disabled) return;

        if (index === 0) {
          inputElement.disabled = false;
          inputElement.style.pointerEvents = 'auto';
          inputElement.focus();
          inputWrapper.style.boxShadow = 'none';
          inputElement.placeholder = '';
          this.firstInteractionComplete = true;
          this.humanMetrics.touchUsed = true;

          if (!this.humanMetrics.startTime) {
            this.humanMetrics.startTime = Date.now();
          }
        }
      }, { passive: true });

      captcha.appendChild(digitElement);
      inputWrapper.appendChild(inputElement); // Input'u wrapper'a ekle
      inputRow.appendChild(inputWrapper); // Wrapper'ı row'a ekle
    });

    // Canvas gürültüsü ekleme
    this.addNoiseCanvas(captcha);

    // Mouse ile CAPTCHA alanına giriş kontrolü - SADECE KAYIT AMAÇLI
    this.container.addEventListener('mouseenter', () => {
      // İnsan tespiti: mouse girişini kaydet
      this.humanMetrics.mouseEntered = true;
    });

    // Mouse hareketi izleme - Behavioral Biometrics
    let lastMousePos = { x: 0, y: 0, time: 0 };
    let lastVelocity = 0;
    let lastAngle = 0;

    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const currentTime = Date.now();

      if (lastMousePos.x !== 0 || lastMousePos.y !== 0) {
        const distance = Math.sqrt(
          Math.pow(x - lastMousePos.x, 2) + Math.pow(y - lastMousePos.y, 2)
        );
        const timeDiff = currentTime - lastMousePos.time;

        // Hız hesaplama (px/ms)
        const velocity = timeDiff > 0 ? distance / timeDiff : 0;
        this.humanMetrics.mouseVelocities.push(velocity);

        // İvme hesaplama (velocity değişimi)
        if (lastVelocity !== 0) {
          const acceleration = Math.abs(velocity - lastVelocity);
          this.humanMetrics.mouseAccelerations.push(acceleration);
        }
        lastVelocity = velocity;

        // Durma tespiti (çok yavaş hareket)
        if (velocity < 0.05) {
          this.humanMetrics.mousePauses++;
        }

        // Mikro hareket tespiti (insan eli titrer)
        if (distance > 0 && distance < 5) {
          this.humanMetrics.microMovements++;
        }

        // Açı değişimi (yön değişimi)
        if (distance > 0) {
          const angle = Math.atan2(y - lastMousePos.y, x - lastMousePos.x);
          if (lastAngle !== 0) {
            let angleDiff = Math.abs(angle - lastAngle);
            // Normalize to 0-180 degrees
            if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
            this.humanMetrics.angularChanges.push(angleDiff);

            // Keskin yön değişimi (>45 derece)
            if (angleDiff > Math.PI / 4) {
              this.humanMetrics.mouseDirectionChanges++;
            }
          }
          lastAngle = angle;
        }

        this.humanMetrics.totalMouseDistance += distance;

        // Son 100 hız/ivme değerini tut
        if (this.humanMetrics.mouseVelocities.length > 100) {
          this.humanMetrics.mouseVelocities.shift();
        }
        if (this.humanMetrics.mouseAccelerations.length > 100) {
          this.humanMetrics.mouseAccelerations.shift();
        }
        if (this.humanMetrics.angularChanges.length > 100) {
          this.humanMetrics.angularChanges.shift();
        }
      }

      this.humanMetrics.mouseMovements.push({ x, y, time: currentTime });

      // Son 50 hareketi tut
      if (this.humanMetrics.mouseMovements.length > 50) {
        this.humanMetrics.mouseMovements.shift();
      }

      lastMousePos = { x, y, time: currentTime };
    });

    // Touch hareketi izleme (Mobil)
    let lastTouchPos = { x: 0, y: 0 };
    this.container.addEventListener('touchmove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (lastTouchPos.x !== 0 || lastTouchPos.y !== 0) {
        const distance = Math.sqrt(
          Math.pow(x - lastTouchPos.x, 2) + Math.pow(y - lastTouchPos.y, 2)
        );
        this.humanMetrics.totalTouchDistance += distance;
      }

      this.humanMetrics.touchMovements.push({ x, y, time: Date.now() });

      // Son 50 hareketi tut
      if (this.humanMetrics.touchMovements.length > 50) {
        this.humanMetrics.touchMovements.shift();
      }

      lastTouchPos = { x, y };
    }, { passive: true });
  }

  addNoiseCanvas(captcha) {
    const canvas = this.container.querySelector('#noiseCanvas');
    const wrapper = this.container.querySelector('.captcha-wrapper');
    if (!canvas || !wrapper) return;

    // Wrapper'ın boyutlarını al
    const width = wrapper.offsetWidth;
    const height = wrapper.offsetHeight;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');

    // Rastgele çizgiler ekle
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Rastgele noktalar ekle
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  validateHumanBehavior() {
    const metrics = this.humanMetrics;
    const score = this.calculateHumanScore(metrics);

    console.log('🔒 CAPTCHA Analiz Raporu:', {
      '📊 İnsan Skoru': `${score}/100`,
      '⏱️ Tamamlanma Süresi': `${Date.now() - metrics.startTime}ms`,
      '🖱️ Mouse Hareketleri': metrics.mouseMovements.length,
      '📱 Touch Hareketleri': metrics.touchMovements.length,
      '📏 Mouse Mesafesi': `${Math.round(metrics.totalMouseDistance)}px`,
      '📏 Touch Mesafesi': `${Math.round(metrics.totalTouchDistance)}px`,
      '⌨️ Tuş Basım Ortalaması': metrics.keyPressTimes.length > 0 ? `${Math.round(metrics.keyPressTimes.reduce((a,b)=>a+b,0)/metrics.keyPressTimes.length)}ms` : 'N/A',
      '📋 Paste Tespit': metrics.pasteDetected ? '⚠️ EVET' : '✅ Hayır',
      '👁️ Focus Değişimleri': metrics.focusChanges,
      '📱 Mobil Cihaz': metrics.isMobile ? 'Evet' : 'Hayır',
      '🎨 Canvas Fingerprint': this.fingerprint.canvasFingerprint,
      '🎮 WebGL Fingerprint': this.fingerprint.webglFingerprint.substring(0, 50) + '...',
      '🔄 Bot Denemeleri': this.botAttempts,
      '🧬 BEHAVIORAL BIOMETRICS': {
        'Hız Ortalaması': metrics.mouseVelocities.length > 0 ? (metrics.mouseVelocities.reduce((a,b)=>a+b,0)/metrics.mouseVelocities.length).toFixed(3) + ' px/ms' : 'N/A',
        'Hız Varyansı': metrics.mouseVelocities.length > 0 ? (metrics.mouseVelocities.reduce((sum,v)=>sum+Math.pow(v-(metrics.mouseVelocities.reduce((a,b)=>a+b,0)/metrics.mouseVelocities.length),2),0)/metrics.mouseVelocities.length).toFixed(6) : 'N/A',
        'İvme Ortalaması': metrics.mouseAccelerations.length > 0 ? (metrics.mouseAccelerations.reduce((a,b)=>a+b,0)/metrics.mouseAccelerations.length).toFixed(3) : 'N/A',
        'Durma Sayısı': metrics.mousePauses,
        'Mikro Hareketler': metrics.microMovements,
        'Yön Değişimleri': metrics.mouseDirectionChanges,
      }
    });

    // Minimum skor: 40/100 (daha toleranslı)
    if (score >= 40) {
      // İnsan olarak kabul edildi
      localStorage.removeItem('captcha_bot_attempts'); // Bot sayacını sıfırla

      // Başarılı CAPTCHA çözümünü kaydet (şifre kontrolü için)
      localStorage.setItem('captcha_last_success', Date.now().toString());

      this.showSuccessOverlay();
    } else {
      // Bot olarak tespit edildi
      this.botAttempts++;
      localStorage.setItem('captcha_bot_attempts', this.botAttempts.toString());

      this.handleBotDetection(score);
    }
  }

  handleBotDetection(score) {
    // Bot tespit edildiğinde yapılacaklar
    console.warn(`⚠️ BOT TESPİT EDİLDİ! Skor: ${score}/100, Deneme: ${this.botAttempts}`);

    if (this.botAttempts >= 5) {
      // 5 denemeden sonra IP engelleme veya bekleme süresi
      this.showBotBlockedOverlay();

      // Sunucuya bot raporu gönder (opsiyonel)
      if (this.settings.serverUrl) {
        fetch(this.settings.serverUrl + '/report-bot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score: score,
            attempts: this.botAttempts,
            timestamp: Date.now(),
            metrics: this.humanMetrics,
          }),
        }).catch(err => console.error('Bot raporu gönderilemedi:', err));
      }
    } else if (this.botAttempts >= 3) {
      // 3 denemeden sonra uyarı ve zorluk arttır
      alert(`⚠️ Bot davranışı tespit edildi!\n\nDeneme ${this.botAttempts}/5\nSkor: ${score}/100 (Minimum: 40)\n\nLütfen mouse kullanın ve normal hızda yazın.`);
      this.increaseDifficulty();
      this.resetCaptcha();
    } else {
      // İlk 2 denemede sadece uyarı
      alert(`Bot davranışı tespit edildi!\n\nDeneme ${this.botAttempts}/5\nSkor: ${score}/100 (Minimum: 40)\n\nİpucu: Mouse'u hareket ettirin ve normal hızda yazın.`);
      this.resetCaptcha();
    }
  }

  checkTimeout() {
    const timeoutEnd = localStorage.getItem('captcha_timeout_end');
    if (timeoutEnd) {
      const remainingTime = parseInt(timeoutEnd, 10) - Date.now();
      if (remainingTime > 0) {
        // Hala timeout süresi devam ediyor
        this.showTimeoutScreen(remainingTime);
        return true;
      } else {
        // Timeout süresi dolmuş, temizle
        localStorage.removeItem('captcha_timeout_end');
        localStorage.removeItem('captcha_bot_attempts');
      }
    }
    return false;
  }

  showTimeoutScreen(remainingTime) {
    // CAPTCHA'yı gizle
    this.container.style.display = 'none';

    // Login butonunu disable yap
    if (this.settings.activateButton) {
      const button = document.getElementById(this.settings.activateButton);
      if (button) {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
      }
    }

    // Timeout ekranını göster
    const timeoutDiv = document.createElement('div');
    timeoutDiv.id = 'captchaTimeoutScreen';
    timeoutDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: #fff;
      padding: 30px 40px;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(220, 53, 69, 0.4);
      text-align: center;
      z-index: 10000;
      min-width: 350px;
    `;

    const remainingMinutes = Math.ceil(remainingTime / 60000);
    const remainingSeconds = Math.ceil(remainingTime / 1000);

    timeoutDiv.innerHTML = `
      <div style="font-size: 70px; margin-bottom: 15px; animation: pulse 2s infinite;">🚫</div>
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Erişim Geçici Olarak Engellendi</div>
      <div style="font-size: 14px; opacity: 0.95; margin-bottom: 20px;">Bot davranışı tespit edildi</div>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
        <div style="font-size: 16px; margin-bottom: 5px;">Kalan Süre:</div>
        <div id="timeoutCountdown" style="font-size: 32px; font-weight: bold; font-family: monospace;">${this.formatTime(remainingSeconds)}</div>
      </div>
      <div style="font-size: 12px; opacity: 0.8;">Lütfen ${remainingMinutes} dakika sonra tekrar deneyin</div>
    `;

    document.body.appendChild(timeoutDiv);

    // CSS animasyon ekle
    if (!document.getElementById('captchaTimeoutStyles')) {
      const style = document.createElement('style');
      style.id = 'captchaTimeoutStyles';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }

    // Countdown başlat
    this.startCountdown(remainingTime);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  startCountdown(remainingTime) {
    const countdownElement = document.getElementById('timeoutCountdown');
    if (!countdownElement) return;

    let timeLeft = Math.ceil(remainingTime / 1000);

    const interval = setInterval(() => {
      timeLeft--;

      if (timeLeft <= 0) {
        clearInterval(interval);
        localStorage.removeItem('captcha_timeout_end');
        localStorage.removeItem('captcha_bot_attempts');
        location.reload();
      } else {
        countdownElement.textContent = this.formatTime(timeLeft);
      }
    }, 1000);
  }

  showBotBlockedOverlay() {
    // 5 dakika timeout ayarla
    const timeoutDuration = 5 * 60 * 1000; // 5 dakika
    const timeoutEnd = Date.now() + timeoutDuration;
    localStorage.setItem('captcha_timeout_end', timeoutEnd.toString());

    const overlay = document.getElementById('captchaOverlay');
    overlay.innerHTML = `
      <div style="text-align: center; color: #fff; padding: 20px;">
        <div style="font-size: 60px; margin-bottom: 10px;">🚫</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Erişim Engellendi</div>
        <div style="font-size: 14px;">Çok fazla bot denemesi yapıldı.</div>
        <div style="font-size: 14px; margin-top: 5px;">5 dakika süreyle erişim engellenmiştir.</div>
        <div style="font-size: 12px; margin-top: 15px; opacity: 0.8;">Sayfa yenileniyor...</div>
      </div>
    `;
    overlay.style.display = 'flex';
    overlay.style.background = 'rgba(220, 53, 69, 0.9)';

    // Login butonunu disable yap
    if (this.settings.activateButton) {
      const button = document.getElementById(this.settings.activateButton);
      if (button) {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
      }
    }

    // 2 saniye sonra sayfayı yenile (timeout ekranı gösterilsin)
    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  increaseDifficulty() {
    // Zorluk seviyesini arttır
    this.settings.blurLevel = Math.min(10, this.settings.blurLevel + 2);
    this.settings.digits = Math.min(6, this.settings.digits + 1);
    console.log(`Zorluk arttırıldı: Blur=${this.settings.blurLevel}, Digits=${this.settings.digits}`);
  }

  resetCaptcha() {
    // CAPTCHA'yı sıfırla (yeni sayılar oluştur)
    this.digits = Array.from({ length: this.settings.digits }, () => Math.floor(Math.random() * 10));
    this.firstInteractionComplete = false;
    this.humanMetrics = {
      mouseMovements: [],
      keyPressTimes: [],
      inputTimestamps: [],
      startTime: null,
      totalMouseDistance: 0,
      mouseEntered: false,
    };
    this.init();
  }

  calculateHumanScore(metrics) {
    let score = 0;
    const completionTime = Date.now() - metrics.startTime;

    // 1. Mouse/Touch hareketi kontrolü (max 35 puan) - EN ÖNEMLİ
    const isMobile = metrics.isMobile;
    if (isMobile) {
      // Mobil cihaz - touch kontrolü
      if (metrics.touchMovements.length > 2) {
        score += 20; // Touch hareket var
      }
      if (metrics.totalTouchDistance > 30) {
        score += 15; // Touch mesafesi yeterli
      }
    } else {
      // Desktop - mouse kontrolü
      if (metrics.mouseMovements.length > 3) {
        score += 20; // Mouse hareket etti
      }
      if (metrics.totalMouseDistance > 50) {
        score += 15; // Mouse mesafesi yeterli
      }
    }

    // 2. Tamamlanma süresi kontrolü (max 20 puan)
    if (completionTime > 800 && completionTime < 60000) {
      score += 20; // Normal süre
    } else if (completionTime < 500) {
      score -= 15; // Çok hızlı - şüpheli
    }

    // 3. Tuş basım varyasyonu (max 10 puan)
    if (metrics.keyPressTimes.length > 0) {
      const avgKeyPress = metrics.keyPressTimes.reduce((a, b) => a + b, 0) / metrics.keyPressTimes.length;
      if (avgKeyPress > 20 && avgKeyPress < 500) {
        score += 5;
      }
      if (metrics.keyPressTimes.length > 2) {
        const variance = metrics.keyPressTimes.reduce((sum, time) => sum + Math.pow(time - avgKeyPress, 2), 0) / metrics.keyPressTimes.length;
        if (variance > 50) {
          score += 5;
        }
      }
    }

    // 4. Input arası süre (max 10 puan)
    if (metrics.inputTimestamps.length > 1) {
      const intervals = [];
      for (let i = 1; i < metrics.inputTimestamps.length; i++) {
        intervals.push(metrics.inputTimestamps[i] - metrics.inputTimestamps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 100 && avgInterval < 5000) {
        score += 5;
      }
      if (intervals.length > 2) {
        const intervalVariance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
        if (intervalVariance > 5000) {
          score += 5;
        }
      }
    }

    // 5. Paste tespiti (BÜYÜK CEZA)
    if (metrics.pasteDetected) {
      score -= 30; // Paste kullandı = BOT olabilir
    }

    // 6. Focus değişimleri (max 5 puan)
    if (metrics.focusChanges >= this.digits.length) {
      score += 5; // Her input'a focus oldu - doğal davranış
    }

    // 7. Mouse/Touch giriş bonusu (10 puan)
    if (metrics.mouseEntered || metrics.touchUsed) {
      score += 10;
    }

    // 8. Fingerprint kontrolü (max 10 puan)
    if (this.fingerprint) {
      // Canvas fingerprint varsa bonus
      if (this.fingerprint.canvasFingerprint && this.fingerprint.canvasFingerprint !== 'canvas-error') {
        score += 5;
      }
      // WebGL fingerprint varsa bonus
      if (this.fingerprint.webglFingerprint && this.fingerprint.webglFingerprint !== 'webgl-not-supported') {
        score += 5;
      }
    }

    // 9. BEHAVIORAL BIOMETRICS (max 20 puan) - EN GÜÇ LÜ!
    if (!isMobile && metrics.mouseVelocities.length > 5) {
      // Hız varyasyonu (botlar sabit hız kullanır)
      const velocities = metrics.mouseVelocities;
      const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
      const velocityVariance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVelocity, 2), 0) / velocities.length;

      if (velocityVariance > 0.001) {
        score += 5; // Hız değişiyor = İNSAN
      }

      // İvme varyasyonu (botlar düz hareket eder, ivme yok)
      if (metrics.mouseAccelerations.length > 3) {
        const avgAccel = metrics.mouseAccelerations.reduce((a, b) => a + b, 0) / metrics.mouseAccelerations.length;
        if (avgAccel > 0.01) {
          score += 5; // İvme var = İNSAN
        }
      }

      // Durma paternleri (insanlar düşünürken duraklıyor)
      if (metrics.mousePauses > 1) {
        score += 3; // Duraklama var = İNSAN
      }

      // Mikro hareketler (el titremesi)
      if (metrics.microMovements > 5) {
        score += 4; // El titriyor = İNSAN
      }

      // Yön değişimleri (insanlar düz çizgide hareket etmez)
      if (metrics.mouseDirectionChanges > 2) {
        score += 3; // Yön değişimi var = İNSAN
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  validateWithServer() {
    if (!this.settings.serverUrl) {
      throw new Error('Server URL is not defined for CAPTCHA validation.');
    }

    const metrics = this.humanMetrics;

    fetch(this.settings.serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        digits: this.digits,
        humanMetrics: {
          mouseMovements: metrics.mouseMovements.length,
          touchMovements: metrics.touchMovements.length,
          totalMouseDistance: metrics.totalMouseDistance,
          totalTouchDistance: metrics.totalTouchDistance,
          avgKeyPressTime: metrics.keyPressTimes.length > 0 ? metrics.keyPressTimes.reduce((a, b) => a + b, 0) / metrics.keyPressTimes.length : 0,
          completionTime: Date.now() - metrics.startTime,
          humanScore: this.calculateHumanScore(metrics),
          pasteDetected: metrics.pasteDetected,
          focusChanges: metrics.focusChanges,
          isMobile: metrics.isMobile,
        },
        fingerprint: this.fingerprint,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('CAPTCHA validation failed.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          this.showSuccessOverlay();
        } else {
          alert('CAPTCHA doğrulama başarısız. Tekrar deneyin.');
        }
      })
      .catch((error) => {
        console.error('CAPTCHA doğrulama hatası:', error);
        alert('Bir hata oluştu. Tekrar deneyin.');
      });
  }

  generateFingerprint() {
    const fingerprint = {
      canvasFingerprint: this.getCanvasFingerprint(),
      webglFingerprint: this.getWebGLFingerprint(),
      screenInfo: this.getScreenInfo(),
      browserInfo: this.getBrowserInfo(),
      timestamp: Date.now(),
    };
    return fingerprint;
  }

  getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 50;

      // Metin çiz
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Canvas Fingerprint 🔒', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Canvas Fingerprint 🔒', 4, 17);

      // Canvas'ı hash'e dönüştür
      const dataURL = canvas.toDataURL();
      let hash = 0;
      for (let i = 0; i < dataURL.length; i++) {
        const char = dataURL.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString(16);
    } catch (e) {
      return 'canvas-error';
    }
  }

  getWebGLFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) return 'webgl-not-supported';

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';

      return `${vendor}|${renderer}`;
    } catch (e) {
      return 'webgl-error';
    }
  }

  getScreenInfo() {
    return {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  }

  getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages ? navigator.languages.join(',') : '',
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      plugins: Array.from(navigator.plugins || []).map(p => p.name).join(','),
    };
  }

  showSuccessOverlay() {
    const overlay = document.getElementById('captchaOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.style.display = 'none';
      this.container.style.display = 'none';
    }, 1500);
  }
}

function createCaptcha(containerId, options) {
  return new Captcha(containerId, options);
}
