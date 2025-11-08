/**
 * Mail Service for MyHome4u Website
 * Uses browser's native mail functionality (mailto) as fallback
 * and provides a simple serverless approach
 * 
 * No third-party services required!
 */

class MailService {
    constructor() {
        this.isInitialized = true;
        this.recipientEmail = 'myhome4uuu@gmail.com'; // Change this to your email
        this.defaultSubject = 'Contact Form Submission - MyHome4u';
        
        console.log('Mail service initialized (no third-party services required)');
    }

    /**
     * Send email using mailto protocol (works in all browsers)
     * @param {Object} formData - The form data to send
     * @param {string} formData.name - Sender's name
     * @param {string} formData.email - Sender's email
     * @param {string} formData.subject - Email subject
     * @param {string} formData.message - Message content
     * @param {string} formData.phone - Optional phone number
     * @returns {Promise} - Promise that resolves when email client opens
     */
    async sendEmail(formData) {
        try {
            // Validate form data first
            const validation = this.validateForm(formData);
            if (!validation.isValid) {
                throw new Error(Object.values(validation.errors).join(', '));
            }

            // Create email body
            const emailBody = this.createEmailBody(formData);
            
            // Create mailto link
            const mailtoLink = this.createMailtoLink(formData, emailBody);
            
            // Open mail client
            this.openMailClient(mailtoLink);
            
            return {
                success: true,
                message: 'Email client opened successfully! Please send the email from your email client.',
                method: 'mailto'
            };
            
        } catch (error) {
            console.error('Failed to create email:', error);
            throw new Error(`Failed to create email: ${error.message}`);
        }
    }

    /**
     * Create email body from form data
     * @param {Object} formData - The form data
     * @returns {string} - Formatted email body
     */
    createEmailBody(formData) {
        let body = `Dear MyHome4u Team,

You have received a new message from your website contact form.

**From:** ${formData.name}
**Email:** ${formData.email}
`;

        if (formData.phone) {
            body += `**Phone:** ${formData.phone}\n`;
        }

        body += `
**Subject:** ${formData.subject}

**Message:**
${formData.message}

---
This email was sent from your MyHome4u website contact form.
`;

        return encodeURIComponent(body);
    }

    /**
     * Create mailto link
     * @param {Object} formData - The form data
     * @param {string} emailBody - The email body
     * @returns {string} - Mailto link
     */
    createMailtoLink(formData, emailBody) {
        const subject = encodeURIComponent(formData.subject || this.defaultSubject);
        const cc = encodeURIComponent(formData.email); // Send copy to sender
        
        return `mailto:${this.recipientEmail}?subject=${subject}&body=${emailBody}&cc=${cc}`;
    }

    /**
     * Open mail client
     * @param {string} mailtoLink - The mailto link
     */
    openMailClient(mailtoLink) {
        // Create a temporary link element
        const tempLink = document.createElement('a');
        tempLink.href = mailtoLink;
        tempLink.style.display = 'none';
        
        // Add to document and click
        document.body.appendChild(tempLink);
        tempLink.click();
        
        // Remove temporary element
        setTimeout(() => {
            document.body.removeChild(tempLink);
        }, 100);
    }

    /**
     * Alternative method: Download email as .eml file
     * @param {Object} formData - The form data
     * @returns {Promise} - Promise that resolves when file is created
     */
    async downloadEmailAsFile(formData) {
        try {
            const validation = this.validateForm(formData);
            if (!validation.isValid) {
                throw new Error(Object.values(validation.errors).join(', '));
            }

            const emlContent = this.createEMLFile(formData);
            const blob = new Blob([emlContent], { type: 'message/rfc822' });
            const url = URL.createObjectURL(blob);
            
            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.download = `contact-form-${formData.name.replace(/\s+/g, '-')}.eml`;
            tempLink.style.display = 'none';
            
            document.body.appendChild(tempLink);
            tempLink.click();
            
            setTimeout(() => {
                document.body.removeChild(tempLink);
                URL.revokeObjectURL(url);
            }, 100);

            return {
                success: true,
                message: 'Email file downloaded successfully! You can open it in your email client.',
                method: 'file'
            };
            
        } catch (error) {
            console.error('Failed to create email file:', error);
            throw new Error(`Failed to create email file: ${error.message}`);
        }
    }

    /**
     * Create EML file content
     * @param {Object} formData - The form data
     * @returns {string} - EML file content
     */
    createEMLFile(formData) {
        const now = new Date();
        const dateStr = now.toUTCString();
        
        let eml = `From: ${formData.name} <${formData.email}>
To: ${this.recipientEmail}
Subject: ${formData.subject || this.defaultSubject}
Date: ${dateStr}
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

`;

        eml += this.createPlainTextBody(formData);
        
        return eml;
    }

    /**
     * Create plain text email body
     * @param {Object} formData - The form data
     * @returns {string} - Plain text email body
     */
    createPlainTextBody(formData) {
        let body = `Dear MyHome4u Team,

You have received a new message from your website contact form.

From: ${formData.name}
Email: ${formData.email}
`;

        if (formData.phone) {
            body += `Phone: ${formData.phone}\n`;
        }

        body += `
Subject: ${formData.subject}

Message:
${formData.message}

---
This email was sent from your MyHome4u website contact form.
`;

        return body;
    }

    /**
     * Validate form data
     * @param {Object} formData - The form data to validate
     * @returns {Object} - Validation result
     */
    validateForm(formData) {
        const errors = {};

        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = 'Please enter a valid email address';
            }
        }

        if (!formData.subject || formData.subject.trim().length < 3) {
            errors.subject = 'Subject must be at least 3 characters long';
        }

        if (!formData.message || formData.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long';
        }

        if (formData.phone && formData.phone.trim() !== '') {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{7,}$/;
            if (!phoneRegex.test(formData.phone)) {
                errors.phone = 'Please enter a valid phone number';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    /**
     * Check if mailto protocol is supported
     * @returns {boolean} - Whether mailto is supported
     */
    isMailtoSupported() {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return false;
        
        // Check if it's a mobile device (mailto works better on mobile)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check if it's a modern browser
        const isModernBrowser = !!(window.chrome || window.firefox || window.safari || window.opera);
        
        return isMobile || isModernBrowser;
    }

    /**
     * Get mail service status
     * @returns {Object} - Status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            recipientEmail: this.recipientEmail,
            defaultSubject: this.defaultSubject,
            mailtoSupported: this.isMailtoSupported(),
            method: 'mailto (no third-party services)'
        };
    }

    /**
     * Update configuration
     * @param {Object} config - New configuration
     */
    updateConfig(config) {
        if (config.recipientEmail) this.recipientEmail = config.recipientEmail;
        if (config.defaultSubject) this.defaultSubject = config.defaultSubject;
    }
}

// Create global instance
window.mailService = new MailService();