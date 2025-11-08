/**
 * Contact Form Handler for MyHome4u Website
 * No Third-Party Services Version
 * Uses browser's native mail functionality
 */

(function() {
    'use strict';

    /**
     * Initialize contact form handling
     */
    function initContactForm() {
        const contactForm = document.querySelector('.php-email-form');
        if (!contactForm) return;

        // Remove the original PHP action and method
        contactForm.removeAttribute('action');
        contactForm.removeAttribute('method');

        // Add submit event listener
        contactForm.addEventListener('submit', handleFormSubmit);
        
        console.log('Contact form initialized (no third-party services)');
    }

    /**
     * Handle form submission
     * @param {Event} e - The submit event
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const loadingDiv = form.querySelector('.loading');
        const errorDiv = form.querySelector('.error-message');
        const successDiv = form.querySelector('.sent-message');

        // Hide previous messages
        hideMessages([errorDiv, successDiv]);

        // Get form data
        const formData = {
            name: form.querySelector('input[name="name"]').value,
            email: form.querySelector('input[name="email"]').value,
            subject: form.querySelector('input[name="subject"]').value,
            message: form.querySelector('textarea[name="message"]').value,
            phone: form.querySelector('input[name="phone"]')?.value || ''
        };

        // Validate form data
        const validation = window.mailService.validateForm(formData);
        if (!validation.isValid) {
            showError(errorDiv, Object.values(validation.errors).join('<br>'));
            return;
        }

        // Show loading state
        showLoading(loadingDiv, submitButton);

        try {
            // Check preferred method from config
            const config = window.MAIL_CONFIG || {};
            const method = config.PREFERRED_METHOD || 'mailto';
            
            let result;
            if (method === 'download') {
                // Download as .eml file
                result = await window.mailService.downloadEmailAsFile(formData);
            } else {
                // Use mailto protocol (default)
                result = await window.mailService.sendEmail(formData);
            }
            
            // Show success message
            showSuccess(successDiv, result.message);
            
            // Reset form after successful submission
            setTimeout(() => {
                form.reset();
            }, 2000);
            
        } catch (error) {
            // Show error message
            showError(errorDiv, error.message);
            console.error('Form submission error:', error);
        } finally {
            // Hide loading state
            hideLoading(loadingDiv, submitButton);
        }
    }

    /**
     * Show loading state
     * @param {HTMLElement} loadingDiv - Loading div element
     * @param {HTMLElement} submitButton - Submit button element
     */
    function showLoading(loadingDiv, submitButton) {
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Opening Email Client...';
        }
    }

    /**
     * Hide loading state
     * @param {HTMLElement} loadingDiv - Loading div element
     * @param {HTMLElement} submitButton - Submit button element
     */
    function hideLoading(loadingDiv, submitButton) {
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'SEND MESSAGE';
        }
    }

    /**
     * Show error message
     * @param {HTMLElement} errorDiv - Error div element
     * @param {string} message - Error message
     */
    function showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.innerHTML = message;
            errorDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Show success message
     * @param {HTMLElement} successDiv - Success div element
     * @param {string} message - Success message
     */
    function showSuccess(successDiv, message) {
        if (successDiv) {
            successDiv.innerHTML = message;
            successDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Hide all message divs
     * @param {Array} messageDivs - Array of message div elements
     */
    function hideMessages(messageDivs) {
        messageDivs.forEach(div => {
            if (div) div.style.display = 'none';
        });
    }

    /**
     * Check mail service status
     */
    function checkMailService() {
        if (window.mailService) {
            const status = window.mailService.getStatus();
            console.log('Mail service status:', status);
            
            if (!status.mailtoSupported) {
                console.warn('Mailto protocol may not be fully supported on this device/browser.');
            }
        } else {
            console.error('Mail service not available');
        }
    }

    /**
     * Provide alternative instructions if mailto doesn't work
     */
    function showAlternativeInstructions() {
        const config = window.MAIL_CONFIG || {};
        const recipient = config.RECIPIENT_EMAIL || 'myhome4uuu@gmail.com';
        
        return `
            <div class="alert alert-info mt-3">
                <h5>Alternative Method</h5>
                <p>If the email client doesn't open automatically, you can:</p>
                <ol>
                    <li>Copy this email address: <strong>${recipient}</strong></li>
                    <li>Open your email client manually</li>
                    <li>Create a new email and paste the address</li>
                </ol>
            </div>
        `;
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initContactForm();
            checkMailService();
        });
    } else {
        initContactForm();
        checkMailService();
    }

})();