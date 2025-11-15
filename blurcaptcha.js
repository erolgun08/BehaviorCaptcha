class Captcha {
  constructor(containerId, options = {}) {
    const defaultSettings = {
      // Temel ayarlar
      digits: 4,
      blurLevel: 6,
      digitSize: 40,
      inputSize: 20,
      borderColor: '#007bff',
      textColor: '#000',
      instructionText: 'Lütfen aşağıdaki sayıları girin',

      // Güvenlik ayarları
      securityMode: 'client', // 'client' (varsayılan) veya 'server' (opsiyonel sunucu doğrulaması)
      serverUrl: '/api/captcha',

      // Hatalı giriş tracking
      trackFailedAttempts: true,
      failureThreshold: 2, // Kaç hata sonrası CAPTCHA gösterilecek
      triggerElement: null, // Hangi element'e attach edilecek (örn: login button)
      autoShow: false, // Başlangıçta göster/gizle

      // Erişilebilirlik
      ariaLabel: 'CAPTCHA Doğrulaması',
      enableKeyboardNav: true,

      // Callbacks
      onComplete: () => {},
      onFailureThresholdReached: () => {},
      onValidationSuccess: () => {},
      onValidationFailed: () => {},

      // Diğer
      activateButton: null,
      debugMode: false,
    };

    this.settings = { ...defaultSettings, ...options };
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with ID "${containerId}" not found.`);
    }

    this.digits = [];
    this.captchaToken = null;
    this.failedAttempts = 0;
    this.firstInteractionComplete = false;
    this.isVisible = this.settings.autoShow;
    this.currentInputIndex = 0;

    // Container'ı başlangıçta gizle
    if (!this.settings.autoShow) {
      this.container.style.display = 'none';
    }

    this.init();

    // Hatalı giriş tracking ayarla
    if (this.settings.trackFailedAttempts && this.settings.triggerElement) {
      this.setupFailureTracking();
    }
  }

  log(message, data = null) {
    if (this.settings.debugMode) {
      console.log(`[BlurCaptcha] ${message}`, data || '');
    }
  }

  async init() {
    if (this.settings.securityMode === 'server') {
      await this.fetchCaptchaFromServer();
    } else {
      // Client-side (güvenli değil, sadece demo için)
      this.digits = Array.from({ length: this.settings.digits }, () => Math.floor(Math.random() * 10));
      this.log('Client-side CAPTCHA oluşturuldu', this.digits);
    }

    this.renderCaptcha();
  }

  async fetchCaptchaFromServer() {
    try {
      this.log('Sunucudan CAPTCHA alınıyor...');
      const response = await fetch(`${this.settings.serverUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Cookie bazlı session için
      });

      if (!response.ok) {
        throw new Error('CAPTCHA oluşturulamadı');
      }

      const data = await response.json();
      this.captchaToken = data.token;
      this.digits = data.digits || [];
      this.log('Sunucudan CAPTCHA alındı', { token: this.captchaToken });
    } catch (error) {
      this.log('Sunucu hatası, client-side CAPTCHA kullanılıyor', error);
      // Fallback to client-side
      this.digits = Array.from({ length: this.settings.digits }, () => Math.floor(Math.random() * 10));
    }
  }

  renderCaptcha() {
    this.container.innerHTML = `
      <div class="captcha-container"
           role="region"
           aria-label="${this.settings.ariaLabel}"
           style="position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <div class="instruction"
             id="captcha-instruction-${this.container.id}"
             style="font-size: 14px; color: #555; text-align: center;"
             aria-live="polite">
          ${this.settings.instructionText}
        </div>
        <div class="captcha"
             role="presentation"
             style="display: flex; gap: 5px;"></div>
        <div class="input-row"
             role="group"
             aria-labelledby="captcha-instruction-${this.container.id}"
             style="display: flex; gap: 5px; margin-top: 5px;"></div>
        <div class="overlay"
             id="captchaOverlay-${this.container.id}"
             aria-live="assertive"
             style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); justify-content: center; align-items: center; z-index: 10;">
          <div class="checkmark" style="font-size: 50px; color: #28a745;" role="img" aria-label="Başarılı">✔</div>
        </div>
      </div>
    `;

    const captcha = this.container.querySelector('.captcha');
    const inputRow = this.container.querySelector('.input-row');

    this.digits.forEach((digit, index) => {
      const randomRotation = Math.floor(Math.random() * 41 - 20);
      const digitElement = document.createElement('div');
      digitElement.textContent = digit;
      digitElement.setAttribute('aria-hidden', 'true');
      digitElement.style.width = `${this.settings.digitSize}px`;
      digitElement.style.height = `${this.settings.digitSize}px`;
      digitElement.style.fontSize = `${this.settings.digitSize * 0.6}px`;
      digitElement.style.textAlign = 'center';
      digitElement.style.lineHeight = `${this.settings.digitSize}px`;
      digitElement.style.border = `1px solid ${this.settings.borderColor}`;
      digitElement.style.borderRadius = '5px';
      digitElement.style.backgroundColor = '#f8f9fa';
      digitElement.style.color = this.settings.textColor;
      digitElement.style.filter = index === 0 ? 'none' : `blur(${this.settings.blurLevel}px)`;
      digitElement.style.transform = `rotate(${randomRotation}deg)`;
      digitElement.style.transition = 'all 0.3s ease';

      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.inputMode = 'numeric';
      inputElement.pattern = '[0-9]';
      inputElement.maxLength = 1;
      inputElement.disabled = true;
      inputElement.setAttribute('aria-label', `Rakam ${index + 1}`);
      inputElement.setAttribute('aria-describedby', `captcha-instruction-${this.container.id}`);
      inputElement.style.width = `${this.settings.inputSize}px`;
      inputElement.style.height = `${this.settings.inputSize}px`;
      inputElement.style.fontSize = `${this.settings.inputSize * 0.6}px`;
      inputElement.style.textAlign = 'center';
      inputElement.style.border = `1px solid ${this.settings.borderColor}`;
      inputElement.style.borderRadius = '5px';
      inputElement.style.backgroundColor = index === 0 ? '#fff' : '#f8f9fa';

      // Input event
      inputElement.addEventListener('input', (e) => this.handleInput(e, index, digitElement, inputRow, captcha));

      // Click event
      inputElement.addEventListener('click', () => this.handleClick(inputRow));

      // Keyboard navigation
      if (this.settings.enableKeyboardNav) {
        inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e, index, inputRow));
      }

      captcha.appendChild(digitElement);
      inputRow.appendChild(inputElement);
    });

    // Mouse enter event
    this.container.addEventListener('mouseenter', () => {
      if (!this.firstInteractionComplete) {
        const firstInput = inputRow.querySelector('input');
        if (firstInput) {
          firstInput.disabled = false;
          this.firstInteractionComplete = true;
          this.log('İlk etkileşim tamamlandı');
        }
      }
    });
  }

  handleInput(event, index, digitElement, inputRow, captcha) {
    const inputElement = event.target;
    const inputValue = inputElement.value;

    // Sadece rakam girişine izin ver
    if (!/^[0-9]$/.test(inputValue)) {
      inputElement.value = '';
      return;
    }

    if (inputValue === digitElement.textContent) {
      this.log(`Doğru rakam girişi: ${index + 1}/${this.digits.length}`);

      digitElement.style.filter = 'none';
      digitElement.style.transform = 'rotate(0deg)';
      inputElement.disabled = true;
      inputElement.setAttribute('aria-label', `Rakam ${index + 1} - Doğru`);

      if (index < this.digits.length - 1) {
        const nextInput = inputRow.children[index + 1];
        const nextDigit = captcha.children[index + 1];
        nextInput.disabled = false;
        nextInput.focus();
        nextDigit.style.filter = 'none';
        this.currentInputIndex = index + 1;
      } else {
        // Tüm rakamlar doğru girildi
        this.validateCaptcha();
      }

      // Activate button (eski özellik için backward compatibility)
      if (this.settings.activateButton && index === this.digits.length - 1) {
        const button = document.getElementById(this.settings.activateButton);
        if (button) {
          button.disabled = false;
          this.log('Buton aktifleştirildi');
        }
      }
    } else {
      inputElement.value = '';
      inputElement.setAttribute('aria-label', `Rakam ${index + 1} - Hatalı giriş`);
    }
  }

  handleClick(inputRow) {
    if (!this.firstInteractionComplete) {
      this.firstInteractionComplete = true;
      const firstInput = inputRow.querySelector('input');
      if (firstInput) {
        firstInput.disabled = false;
        this.log('İlk tıklama ile aktifleştirildi');
      }
    }
  }

  handleKeyDown(event, index, inputRow) {
    const key = event.key;

    // Backspace - önceki input'a git
    if (key === 'Backspace' && index > 0 && !event.target.value) {
      event.preventDefault();
      const prevInput = inputRow.children[index - 1];
      if (prevInput && !prevInput.disabled) {
        prevInput.focus();
        prevInput.value = '';
      }
    }

    // Arrow keys
    if (key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = inputRow.children[index - 1];
      if (prevInput && !prevInput.disabled) {
        prevInput.focus();
      }
    }

    if (key === 'ArrowRight' && index < this.digits.length - 1) {
      event.preventDefault();
      const nextInput = inputRow.children[index + 1];
      if (nextInput && !nextInput.disabled) {
        nextInput.focus();
      }
    }
  }

  async validateCaptcha() {
    this.log('CAPTCHA doğrulanıyor...');

    if (this.settings.securityMode === 'server') {
      await this.validateWithServer();
    } else {
      // Client-side validation (güvenli değil)
      this.showSuccessOverlay();
      this.settings.onComplete(this.digits);
      this.settings.onValidationSuccess();
    }
  }

  async validateWithServer() {
    try {
      this.log('Sunucu doğrulaması yapılıyor...', { token: this.captchaToken });

      const response = await fetch(`${this.settings.serverUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          token: this.captchaToken,
          digits: this.digits
        }),
      });

      if (!response.ok) {
        throw new Error('CAPTCHA validation failed.');
      }

      const data = await response.json();

      if (data.success) {
        this.log('Sunucu doğrulaması başarılı');
        this.showSuccessOverlay();
        this.settings.onComplete(this.digits);
        this.settings.onValidationSuccess();

        // Reset failed attempts on success
        if (this.settings.trackFailedAttempts) {
          this.failedAttempts = 0;
        }
      } else {
        this.log('Sunucu doğrulaması başarısız');
        this.settings.onValidationFailed();
        alert('CAPTCHA doğrulama başarısız. Tekrar deneyin.');
        this.reset();
      }
    } catch (error) {
      this.log('Sunucu doğrulama hatası', error);
      this.settings.onValidationFailed();
      alert('Bir hata oluştu. Tekrar deneyin.');
      this.reset();
    }
  }

  showSuccessOverlay() {
    const overlay = document.getElementById(`captchaOverlay-${this.container.id}`);
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-label', 'CAPTCHA doğrulaması başarılı');

    setTimeout(() => {
      overlay.style.display = 'none';
      this.hide();
    }, 1500);
  }

  setupFailureTracking() {
    const triggerEl = document.getElementById(this.settings.triggerElement);

    if (!triggerEl) {
      console.warn(`[BlurCaptcha] Trigger element "${this.settings.triggerElement}" not found.`);
      return;
    }

    this.log('Hatalı giriş tracking kuruldu', {
      threshold: this.settings.failureThreshold,
      trigger: this.settings.triggerElement
    });

    // Store original click handler
    this.originalTriggerHandler = null;
  }

  // Hatalı giriş kaydı
  recordFailure() {
    if (!this.settings.trackFailedAttempts) return;

    this.failedAttempts++;
    this.log(`Hatalı giriş kaydedildi: ${this.failedAttempts}/${this.settings.failureThreshold}`);

    if (this.failedAttempts >= this.settings.failureThreshold) {
      this.log('Threshold aşıldı, CAPTCHA gösteriliyor');
      this.show();
      this.settings.onFailureThresholdReached();
    }
  }

  // Başarılı giriş kaydı
  recordSuccess() {
    if (!this.settings.trackFailedAttempts) return;

    this.failedAttempts = 0;
    this.log('Başarılı giriş, sayaç sıfırlandı');
  }

  show() {
    this.isVisible = true;
    this.container.style.display = 'block';
    this.log('CAPTCHA gösterildi');

    // Focus first input
    setTimeout(() => {
      const firstInput = this.container.querySelector('input');
      if (firstInput && !firstInput.disabled) {
        firstInput.focus();
      }
    }, 100);
  }

  hide() {
    this.isVisible = false;
    this.container.style.display = 'none';
    this.log('CAPTCHA gizlendi');
  }

  reset() {
    this.log('CAPTCHA sıfırlanıyor...');
    this.currentInputIndex = 0;
    this.firstInteractionComplete = false;
    this.init();
  }

  // Public API
  isCompleted() {
    const inputs = this.container.querySelectorAll('input');
    return Array.from(inputs).every(input => input.disabled && input.value);
  }

  getFailedAttempts() {
    return this.failedAttempts;
  }

  destroy() {
    this.log('CAPTCHA destroy ediliyor');
    this.container.innerHTML = '';
    this.container.style.display = 'none';
  }
}

// Factory function
function createCaptcha(containerId, options) {
  return new Captcha(containerId, options);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Captcha, createCaptcha };
}
