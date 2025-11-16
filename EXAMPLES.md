# BlurCaptcha Usage Examples

## 📚 Table of Contents

- [Basic Usage](#basic-usage)
- [With Login Form](#with-login-form)
- [With Contact Form](#with-contact-form)
- [React Integration](#react-integration)
- [Vue.js Integration](#vuejs-integration)
- [Angular Integration](#angular-integration)
- [Server Validation](#server-validation)
- [Custom Styling](#custom-styling)

---

## 🚀 Basic Usage

### Simple Implementation (3 lines)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js"></script>
</head>
<body>
  <div id="captcha"></div>

  <script>
    createCaptcha("captcha");
  </script>
</body>
</html>
```

---

## 🔐 With Login Form

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js"></script>
</head>
<body>
  <form id="loginForm">
    <input type="text" id="username" placeholder="Username" required>
    <input type="password" id="password" placeholder="Password" required>

    <div id="captcha"></div>

    <button type="submit" id="loginBtn" disabled>Login</button>
  </form>

  <script>
    let failedAttempts = 0;

    createCaptcha("captcha", {
      digits: 4,
      instructionText: "Verify you're human",
      activateButton: "loginBtn"
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Your login logic here
      if (username === 'admin' && password === 'password') {
        alert('Login successful!');
      } else {
        failedAttempts++;
        if (failedAttempts >= 2) {
          // Show CAPTCHA after 2 failed attempts
          document.getElementById('captcha').style.display = 'block';
        }
      }
    });
  </script>
</body>
</html>
```

---

## 📧 With Contact Form

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js"></script>
</head>
<body>
  <form id="contactForm">
    <input type="text" name="name" placeholder="Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <textarea name="message" placeholder="Message" required></textarea>

    <div id="captcha"></div>

    <button type="submit" id="submitBtn" disabled>Send Message</button>
  </form>

  <script>
    createCaptcha("captcha", {
      digits: 4,
      blurLevel: 6,
      instructionText: "Prove you're not a robot",
      activateButton: "submitBtn",
      onComplete: (digits) => {
        console.log('CAPTCHA solved!');
        document.getElementById('submitBtn').disabled = false;
      }
    });

    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();

      // Submit form data
      const formData = new FormData(e.target);

      fetch('/api/contact', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => alert('Message sent!'))
      .catch(error => console.error('Error:', error));
    });
  </script>
</body>
</html>
```

---

## ⚛️ React Integration

```jsx
import { useEffect, useRef, useState } from 'react';

function LoginForm() {
  const captchaRef = useRef(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Load BlurCaptcha script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js';
    script.async = true;
    script.onload = () => {
      // Initialize CAPTCHA
      window.createCaptcha(captchaRef.current.id, {
        digits: 4,
        instructionText: "Verify you're human",
        onComplete: (digits) => {
          setIsVerified(true);
          console.log('CAPTCHA completed!');
        }
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please complete CAPTCHA');
      return;
    }
    // Handle login
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" required />
      <input type="password" placeholder="Password" required />

      <div id="captcha" ref={captchaRef}></div>

      <button type="submit" disabled={!isVerified}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;
```

---

## 🟢 Vue.js Integration

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="username" type="text" placeholder="Username" required>
    <input v-model="password" type="password" placeholder="Password" required>

    <div id="captcha" ref="captchaContainer"></div>

    <button type="submit" :disabled="!isVerified">Login</button>
  </form>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      isVerified: false
    };
  },
  mounted() {
    // Load BlurCaptcha script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js';
    script.async = true;
    script.onload = () => {
      window.createCaptcha('captcha', {
        digits: 4,
        instructionText: "Verify you're human",
        onComplete: (digits) => {
          this.isVerified = true;
          console.log('CAPTCHA completed!');
        }
      });
    };
    document.body.appendChild(script);
  },
  methods: {
    handleSubmit() {
      if (!this.isVerified) {
        alert('Please complete CAPTCHA');
        return;
      }
      // Handle login
      console.log('Login:', this.username);
    }
  }
};
</script>
```

---

## 🅰️ Angular Integration

```typescript
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="username" name="username" type="text" placeholder="Username" required>
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required>

      <div #captchaContainer id="captcha"></div>

      <button type="submit" [disabled]="!isVerified">Login</button>
    </form>
  `
})
export class LoginComponent implements OnInit {
  @ViewChild('captchaContainer', { static: true }) captchaContainer!: ElementRef;

  username = '';
  password = '';
  isVerified = false;

  ngOnInit() {
    // Load BlurCaptcha script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js';
    script.async = true;
    script.onload = () => {
      (window as any).createCaptcha('captcha', {
        digits: 4,
        instructionText: "Verify you're human",
        onComplete: (digits: number[]) => {
          this.isVerified = true;
          console.log('CAPTCHA completed!');
        }
      });
    };
    document.body.appendChild(script);
  }

  onSubmit() {
    if (!this.isVerified) {
      alert('Please complete CAPTCHA');
      return;
    }
    // Handle login
    console.log('Login:', this.username);
  }
}
```

---

## 🌐 Server Validation

```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js"></script>

<div id="captcha"></div>

<script>
  createCaptcha("captcha", {
    digits: 4,
    serverValidation: true,
    serverUrl: "https://yourapi.com/verify-captcha",
    onComplete: (digits) => {
      // Send to server for verification
      fetch('https://yourapi.com/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          digits: digits,
          timestamp: Date.now()
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Server verification passed!');
        }
      });
    }
  });
</script>
```

### Server-side Example (Node.js/Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/verify-captcha', (req, res) => {
  const { digits, humanMetrics, fingerprint } = req.body;

  // Check human score
  if (humanMetrics.humanScore < 40) {
    return res.json({ success: false, reason: 'Bot detected' });
  }

  // Additional server-side checks
  if (humanMetrics.pasteDetected) {
    return res.json({ success: false, reason: 'Copy-paste detected' });
  }

  res.json({ success: true });
});

app.listen(3000);
```

---

## 🎨 Custom Styling

```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js"></script>

<div id="captcha"></div>

<script>
  createCaptcha("captcha", {
    digits: 6,
    blurLevel: 8,
    digitSize: 50,
    inputSize: 25,
    borderColor: '#ff6b6b',
    instructionText: "Enter the colorful numbers",
    onComplete: (digits) => {
      console.log('Solved:', digits);
    }
  });
</script>

<style>
  #captcha {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }

  #captcha input {
    font-size: 20px;
    font-weight: bold;
    border: 2px solid #ff6b6b;
    border-radius: 8px;
  }
</style>
```

---

## 📱 Mobile-Optimized

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js"></script>

<div id="captcha"></div>

<script>
  createCaptcha("captcha", {
    digits: 4,
    digitSize: 35,
    inputSize: 18,
    instructionText: "Tap and enter numbers",
    // Mobile touch events are automatically supported!
  });
</script>

<style>
  @media (max-width: 600px) {
    #captcha {
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
    }
  }
</style>
```

---

## 🔗 Multiple CAPTCHAs on Same Page

```html
<script src="https://cdn.jsdelivr.net/gh/erolgun08/BlurCaptcha@main/behaviorcaptcha.js"></script>

<h3>Login Form</h3>
<div id="captcha1"></div>

<h3>Contact Form</h3>
<div id="captcha2"></div>

<script>
  // First CAPTCHA
  const captcha1 = createCaptcha("captcha1", {
    digits: 4,
    instructionText: "Login verification",
    activateButton: "loginBtn"
  });

  // Second CAPTCHA
  const captcha2 = createCaptcha("captcha2", {
    digits: 6,
    instructionText: "Contact form verification",
    activateButton: "sendBtn"
  });
</script>
```

---

## 🎯 Advanced Configuration

```javascript
createCaptcha("captcha", {
  // Basic Settings
  digits: 4,                    // Number of digits (3-8)
  blurLevel: 6,                 // Blur intensity (0-10)
  digitSize: 40,                // Digit size in pixels
  inputSize: 20,                // Input box size

  // Appearance
  borderColor: '#007bff',       // Border and accent color
  instructionText: 'Verify',    // Custom instruction text

  // Behavior
  activateButton: 'submitBtn',  // Button ID to enable on success

  // Server Integration
  serverValidation: false,      // Enable server-side validation
  serverUrl: '',                // Server endpoint for validation

  // Callbacks
  onComplete: (digits) => {
    console.log('CAPTCHA solved:', digits);
  },

  onFail: () => {
    console.log('CAPTCHA failed');
  }
});
```

---

## 💡 Tips & Best Practices

### ✅ DO:
- Show CAPTCHA after 2-3 failed login attempts
- Use `onComplete` callback for form submission
- Test on mobile devices (touch events)
- Customize colors to match your brand

### ❌ DON'T:
- Don't show CAPTCHA on first visit (bad UX)
- Don't make digits too many (>6 is annoying)
- Don't set blur too high (illegible for humans)
- Don't forget to disable submit button initially

---

## 🆘 Troubleshooting

**CAPTCHA not appearing?**
```javascript
// Check if script loaded
console.log(typeof createCaptcha); // Should be 'function'

// Check container exists
console.log(document.getElementById('captcha')); // Should not be null
```

**Button not activating?**
```javascript
// Ensure button ID matches
activateButton: "loginBtn"  // Must match <button id="loginBtn">
```

**Mobile not working?**
```html
<!-- Add viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

**For more examples, visit: https://github.com/erolgun08/BlurCaptcha**
