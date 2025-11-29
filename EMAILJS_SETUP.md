# EmailJS Setup Guide

This guide will help you set up EmailJS so your contact form can send emails to **fatmaesam263@gmail.com**.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. Go to [Email Services](https://dashboard.emailjs.com/admin/integration)
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions
5. **Copy your Service ID** (you'll need this)

## Step 3: Create Email Template

1. Go to [Email Templates](https://dashboard.emailjs.com/admin/template)
2. Click "Create New Template"
3. Use the following template:

**Template Name:** Contact Form

**Subject:** New Contact Form Message: {{subject}}

**Content:**
```
From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. **Copy your Template ID** (you'll need this)

## Step 4: Get Your Public Key

1. Go to [Account > General](https://dashboard.emailjs.com/admin)
2. Find your **Public Key**
3. **Copy your Public Key** (you'll need this)

## Step 5: Update main.js

Open `main.js` and replace these values:

1. Line 143: Replace `'YOUR_PUBLIC_KEY'` with your Public Key
2. Line 160: Replace `'YOUR_SERVICE_ID'` with your Service ID
3. Line 161: Replace `'YOUR_TEMPLATE_ID'` with your Template ID

Example:
```javascript
emailjs.init('abc123xyz');  // Your Public Key
const serviceID = 'service_abc123';  // Your Service ID
const templateID = 'template_xyz789';  // Your Template ID
```

## Step 6: Test Your Form

1. Open your portfolio in a browser
2. Fill out the contact form
3. Submit and check your email at **fatmaesam263@gmail.com**

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Perfect for portfolio websites

## Troubleshooting

- **Emails not sending?** Check browser console for errors
- **Service ID/Template ID wrong?** Double-check you copied them correctly
- **Public Key issues?** Make sure you're using the Public Key, not Private Key

## Alternative: Using Formspree (Simpler Option)

If you prefer a simpler setup without EmailJS, you can use Formspree:

1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for free
3. Create a new form
4. Get your form endpoint URL
5. Update the form action in `index.html`:

```html
<form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Then remove the EmailJS code from `main.js` and use Formspree's native form submission.

