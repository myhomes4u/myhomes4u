# Mail Service Setup Guide - No Third-Party Services

## Overview
This mail service allows your website to send emails without requiring any third-party services like EmailJS, PHP, or server-side code. It uses the browser's native mail functionality (mailto protocol) and provides a fallback option to download emails as .eml files.

## Features
- ✅ No third-party services required
- ✅ No PHP or server-side code needed
- ✅ Uses browser's native mail functionality
- ✅ Fallback option to download emails as files
- ✅ Form validation and error handling
- ✅ Loading states and user feedback
- ✅ Works on all modern browsers

## How It Works

### Method 1: Mailto Protocol (Default)
When a user submits the contact form:
1. The form data is validated
2. An email is formatted with the user's message
3. The user's default email client opens with a pre-filled email
4. The user clicks "Send" in their email client to complete the process

### Method 2: Download as EML File (Alternative)
If mailto doesn't work well on certain devices:
1. The form data is validated
2. An .eml email file is generated
3. The file is downloaded to the user's device
4. User can open the file in their email client and send it

## Setup Instructions

### Step 1: Update Configuration
Open the file `assets/js/mail-config.js` and update the email address:

```javascript
// Change this to your actual email address
RECIPIENT_EMAIL: 'your-email@example.com',
```

### Step 2: Test the Form
1. Open your contact page in a web browser
2. Fill out the contact form with test data
3. Click "SEND MESSAGE"
4. Your email client should open with a pre-filled email
5. Click "Send" in your email client to complete the process

### Step 3: Switch Methods (Optional)
If you prefer the download method, change the configuration:

```javascript
// Change from 'mailto' to 'download'
PREFERRED_METHOD: 'download',
```

## Configuration Options

### Email Settings
```javascript
const MAIL_CONFIG = {
    RECIPIENT_EMAIL: 'your-email@example.com',  // Your receiving email
    DEFAULT_SUBJECT: 'Contact Form Submission - Grandoria Hotel',  // Default subject
    PREFERRED_METHOD: 'mailto',  // 'mailto' or 'download'
    
    // Form validation settings
    VALIDATION: {
        MIN_NAME_LENGTH: 2,
        MIN_SUBJECT_LENGTH: 3,
        MIN_MESSAGE_LENGTH: 10
    }
};
```

### Form Validation Rules
- Name: Minimum 2 characters
- Email: Valid email format required
- Subject: Minimum 3 characters
- Message: Minimum 10 characters
- Phone: Optional, but must be valid format if provided

## Browser Compatibility

### Mailto Protocol Support
- ✅ **Desktop**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile**: Works on iOS Safari, Android Chrome
- ⚠️ **Limitations**: Some users may not have email clients configured

### Download Method Support
- ✅ **All modern browsers** that support file downloads
- ✅ **Mobile browsers** with file download capability
- ✅ **Works offline** (no internet required for download)

## User Experience

### What Users See
1. **Form**: Clean, responsive contact form
2. **Validation**: Real-time form validation with helpful error messages
3. **Loading**: "Opening email client..." message while processing
4. **Success**: "Email client opened successfully! Please send the email from your email client."
5. **Error**: Clear error messages if something goes wrong

### Email Format
The generated email will look like:
```
Subject: [User's Subject]

Dear Grandoria Hotel Team,

You have received a new message from your website contact form.

From: [User's Name]
Email: [User's Email]
Phone: [User's Phone] (if provided)

Subject: [User's Subject]

Message:
[User's Message]

---
This email was sent from your Grandoria Hotel website contact form.
```

## Troubleshooting

### Email Client Doesn't Open
**Common Causes:**
- No email client configured on the device
- Browser security settings blocking mailto links
- Pop-up blockers preventing new windows

**Solutions:**
1. **Switch to download method**: Change `PREFERRED_METHOD` to `'download'`
2. **Manual instructions**: Users can copy your email address and create email manually
3. **Alternative contact**: Provide phone number or alternative contact methods

### Form Validation Errors
**Common Issues:**
- Name too short (minimum 2 characters)
- Invalid email format
- Subject too short (minimum 3 characters)
- Message too short (minimum 10 characters)

### Browser-Specific Issues
**Safari/iOS:**
- May require user interaction to open mail client
- Works best with Apple Mail configured

**Android:**
- Works with Gmail or other email apps
- May show app selection dialog

**Windows:**
- Works with Outlook, Thunderbird, or other email clients
- May show app selection dialog if multiple email clients installed

## Security Considerations

### Advantages
- ✅ No server-side processing required
- ✅ No email credentials stored in code
- ✅ User's email client handles authentication
- ✅ No third-party data sharing
- ✅ Works completely offline (download method)

### Limitations
- ⚠️ Email address is visible in page source (spam risk)
- ⚠️ Relies on user's email client configuration
- ⚠️ No server-side validation or spam filtering
- ⚠️ User must manually send the email

## Best Practices

1. **Test thoroughly** on different devices and browsers
2. **Provide alternative contact methods** (phone, address, social media)
3. **Consider adding CAPTCHA** if you experience spam issues
4. **Monitor your email** for delivery issues
5. **Keep configuration updated** if your email address changes

## Alternative Solutions

If this approach doesn't meet your needs, consider:
- **Formspree**: Simple form-to-email service (free tier available)
- **Netlify Forms**: Built-in form handling (if using Netlify hosting)
- **Google Forms**: Embed a Google Form on your contact page
- **Simple PHP mailer**: If your hosting supports PHP (see forms/contact.php)