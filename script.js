// ==============================
// Portfolio JavaScript for GitHub Pages
// ==============================

// DOM Elements Cache
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.level-bar');

// Configuration
const CONFIG = {
    EMAIL: 'saiyedatibali@gmail.com',
    // Use direct raw GitHub link for resume
    RESUME_URL: 'https://github.com/Atibali/atibali.github.io/raw/main/Atibali_Saiyed_Resume.pdf',
    RESUME_FILENAME: 'Atibali_Saiyed_Resume.pdf',
    GITHUB_USERNAME: 'atibali',
    LINKEDIN_URL: 'https://www.linkedin.com/in/atibali-saiyed/'
};

/* -----------------------------
   MOBILE NAVIGATION TOGGLE
------------------------------ */
const toggleMenu = () => {
    navLinks.classList.toggle('active');
    const isActive = navLinks.classList.contains('active');
    menuToggle.innerHTML = isActive 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    
    document.body.style.overflow = isActive ? 'hidden' : '';
};

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

// Close menu when clicking on nav links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    });
});

/* -----------------------------
   ENHANCED SMOOTH SCROLLING
------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        
        // Close mobile menu
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }

        // Smooth scroll to target
        window.scrollTo({
            top: target.offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

/* -----------------------------
   WORKING RESUME DOWNLOAD FUNCTIONALITY
------------------------------ */
function downloadResume() {
    try {
        // Show loading state on all resume buttons
        const resumeBtns = document.querySelectorAll('.btn-resume, .btn-resume-small');
        
        resumeBtns.forEach(btn => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            btn.disabled = true;
            
            // Reset button after 3 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 3000);
        });

        // Method 1: Direct anchor download (works with raw GitHub URL)
        const a = document.createElement('a');
        a.href = CONFIG.RESUME_URL;
        a.download = CONFIG.RESUME_FILENAME;
        a.target = '_blank'; // Open in new tab if direct download doesn't work
        
        // Append to body, click, and remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show success notification
        setTimeout(() => {
            showNotification('Resume download started! ✅', 'success');
        }, 1000);
            
    } catch (error) {
        console.error('Resume download failed:', error);
        
        // Fallback: Open in new tab
        window.open(CONFIG.RESUME_URL, '_blank');
        showNotification('Opening resume in new tab...', 'info');
    }
}

// Add event listeners to all resume buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add to existing resume buttons
    document.querySelectorAll('.btn-resume, .btn-resume-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadResume();
        });
    });
    
    // Add resume button to navbar dynamically
    const navContainer = document.querySelector('.nav-links');
    if (navContainer && !document.querySelector('.nav-resume-btn')) {
        const resumeBtn = document.createElement('a');
        resumeBtn.href = '#';
        resumeBtn.className = 'btn-resume nav-resume-btn';
        resumeBtn.innerHTML = '<i class="fas fa-download"></i> Resume';
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadResume();
        });
        navContainer.appendChild(resumeBtn);
    }
});

/* -----------------------------
   WORKING EMAIL COPY FUNCTIONALITY
------------------------------ */
function copyEmail() {
    // Method 1: Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(CONFIG.EMAIL)
            .then(() => {
                showNotification('Email copied to clipboard! 📧', 'success');
                
                // Update button text temporarily
                document.querySelectorAll('.btn-email').forEach(btn => {
                    const originalText = btn.textContent;
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            })
            .catch(err => {
                console.error('Clipboard API failed:', err);
                fallbackCopyEmail();
            });
    } else {
        // Method 2: Fallback for older browsers
        fallbackCopyEmail();
    }
}

function fallbackCopyEmail() {
    const textArea = document.createElement('textarea');
    textArea.value = CONFIG.EMAIL;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Email copied to clipboard! 📧', 'success');
        } else {
            throw new Error('Copy command failed');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showNotification('Failed to copy. Email: ' + CONFIG.EMAIL, 'info');
    } finally {
        document.body.removeChild(textArea);
    }
}

// Add click event to all email buttons
document.querySelectorAll('.btn-email').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        copyEmail();
    });
});

/* -----------------------------
   CONTACT FORM HANDLER FOR GITHUB PAGES
------------------------------ */
if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        const btn = contactForm.querySelector('button[type="submit"]');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            // Simulate sending
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For GitHub Pages, open mail client with pre-filled details
            const subject = encodeURIComponent(data.subject);
            const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage: ${data.message}`);
            const mailtoLink = `mailto:${CONFIG.EMAIL}?subject=${subject}&body=${body}`;
            
            // Open mail client
            window.open(mailtoLink, '_blank');
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            showNotification('Opening email client... Please send the message.', 'info');
            
        } catch (err) {
            console.error('Form submission error:', err);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
    });
}

/* -----------------------------
   NOTIFICATION SYSTEM
------------------------------ */
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'error' ? 'exclamation-circle' : 
                          type === 'info' ? 'info-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

/* -----------------------------
   SKILL BAR ANIMATION
------------------------------ */
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.dataset.width;
            
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
            
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => {
    bar.style.width = '0';
    bar.style.transition = 'width 1s ease-out';
    skillObserver.observe(bar);
});

/* -----------------------------
   NAVBAR SCROLL EFFECT
------------------------------ */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
});

/* -----------------------------
   UTILITY FUNCTIONS
------------------------------ */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* -----------------------------
   INITIALIZE ON LOAD
------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    skillBars.forEach(bar => {
        bar.style.width = '0';
    });
    
    // Add notification styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                background: #10b981;
                color: white;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                transition: all 0.3s ease;
            }
            .notification.error { background: #ef4444; }
            .notification.info { background: #3b82f6; }
            .notification i { font-size: 1.2rem; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
});
