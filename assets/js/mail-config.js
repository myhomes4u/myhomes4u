/**
 * Mail Service Configuration for Grandoria Hotel Website
 * No Third-Party Services Configuration
 */

const MAIL_CONFIG = {
    // Your receiving email address (change this to your actual email)
    RECIPIENT_EMAIL: 'myhome4uuu@gmail.com',
    
    // Default subject for contact form emails
    DEFAULT_SUBJECT: 'Contact Form Submission - Grandoria Hotel',
    
    // Form validation settings
    VALIDATION: {
        MIN_NAME_LENGTH: 2,
        MIN_SUBJECT_LENGTH: 3,
        MIN_MESSAGE_LENGTH: 10
    },
    
    // Email method preference: 'mailto' or 'download'
    PREFERRED_METHOD: 'mailto', // 'mailto' opens email client, 'download' creates .eml file
    
    // Email template settings
    EMAIL_TEMPLATE: {
        HEADER: 'Dear Grandoria Hotel Team,\n\nYou have received a new message from your website contact form.',
        FOOTER: '\n\n---\nThis email was sent from your Grandoria Hotel website contact form.'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MAIL_CONFIG;
} else if (typeof window !== 'undefined') {
    window.MAIL_CONFIG = MAIL_CONFIG;
}