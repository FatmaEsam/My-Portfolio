// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add animation effect
    themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
    }
});

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.padding = '0.75rem 0';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        navbar.style.padding = '1rem 0';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.skill-category, .timeline-item, .education-card, .project-card, .contact-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ============================================
// EMAILJS CONFIGURATION
// ============================================
// IMPORTANT: Before using the contact form, you need to:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (Gmail recommended)
// 3. Create an email template
// 4. Get your Public Key, Service ID, and Template ID
// 5. Replace the values below with your actual credentials
// See EMAILJS_SETUP.md for detailed instructions

// EmailJS Configuration - REPLACE THESE VALUES
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'fPWnhukKVUcBQfiok',      // Get from: https://dashboard.emailjs.com/admin
    SERVICE_ID: 'service_huxljhc',      // Get from: Email Services page
    TEMPLATE_ID: 'template_jtz73ee'     // Get from: Email Templates page
};

// Initialize EmailJS (only if EmailJS is loaded)
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
} else {
    console.warn('EmailJS not loaded. Make sure the EmailJS script is included in index.html');
}

// ============================================
// FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Disable submit button and show loading state
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || 
        EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' || 
        EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
        showNotification('Email service not configured. Please set up EmailJS. See EMAILJS_SETUP.md for instructions.', 'error');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        return;
    }
    
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        showNotification('Email service not available. Please check your internet connection.', 'error');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        return;
    }
    
    try {
        // Prepare template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'fatmaesam263@gmail.com'
        };
        
        // Send email using EmailJS
        await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID, 
            EMAILJS_CONFIG.TEMPLATE_ID, 
            templateParams
        );
        
        // Success notification
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        showNotification('Failed to send message. Please try again later or contact me directly at fatmaesam263@gmail.com', 'error');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ============================================
// TYPING EFFECT (Optional enhancement)
// ============================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// PARALLAX EFFECT FOR HERO SHAPES
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// ============================================
// PROJECT MODAL & LIGHTBOX
// ============================================
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalImagesGrid = document.getElementById('modalImagesGrid');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Project images configuration
const projectImages = {
    graphic: {
        title: 'Graphic Design Projects',
        type: 'graphic',
        images: [
            'images/graphic-1.jpg',
            'images/graphic-2.jpg',
            'images/graphic-3.jpg',
            'images/graphic-4.jpg',
            'images/graphic-5.jpg'
        ]
    }, 
    ux: {
        title: 'UI/UX Design Projects',
        type: 'ux',
        images: [
            { src: 'images/ui-ux-project-1.jpg', behance: 'https://www.behance.net/gallery/175196361/Ui-Design' },
            { src: 'images/ui-ux-project-2.jpg', behance: 'https://www.behance.net/gallery/239480243/Couply' },
            { src: 'images/ui-ux-project-3.jpg', behance: 'https://www.behance.net/gallery/239480383/Krypto' },
            { src: 'images/ui-ux-project-4.jpg', behance: 'https://www.behance.net/gallery/214701203/Friskay' },
            { src: 'images/ui-ux-project-5.jpg', behance: 'https://www.behance.net/gallery/172704195/App_DAH' },
            { src: 'images/ui-ux-project-6.jpg', behance: 'https://www.behance.net/gallery/239480575/Time-App' },
            { src: 'images/ui-ux-project-7.jpg', behance: 'https://www.behance.net/gallery/172816069/Website-Page-Design' },
            { src: 'images/ui-ux-project-8.jpg', behance: 'https://www.behance.net/gallery/172984981/Socially_Webpage' },
        ]
    },
    web: {
        title: 'Web Development Projects',
        type: 'web',
        images: [
            { src: 'images/web/web-1.jpg', github: 'https://github.com/FatmaEsam/Socially-webpage-Design', demo: 'https://fatmaesam.github.io/Socially-webpage-Design/' },
            { src: 'images/web/web-2.jpg', github: 'https://github.com/FatmaEsam/science-project-2', demo: 'https://fatmaesam.github.io/science-project-2/' },
            { src: 'images/web/web-3.jpg', github: 'https://github.com/FatmaEsam/project-3', demo: 'https://fatmaesam.github.io/project-3/' },
            { src: 'images/web/web-4.jpg', github: 'https://github.com/FatmaEsam/Rose-Project--One', demo: 'https://fatmaesam.github.io/Rose-Project--One/' }
        ]
    },
    // graduation: {
    //     title: 'Graduation Project',
    //     type: 'graduation',
    //     images: ['images/graduation-project-1.jpg', 'images/graduation-project-2.jpg']
    // }
};

let currentLightboxImages = [];
let currentLightboxIndex = 0;

// Open modal when project card is clicked
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const projectType = card.getAttribute('data-project');
        if (projectType && projectImages[projectType]) {
            openProjectModal(projectType);
        }
    });
});

function openProjectModal(projectType) {
    const project = projectImages[projectType];
    if (!project) return;
    
    modalTitle.textContent = project.title;
    modalImagesGrid.innerHTML = '';
    
    // Add type class to modal for different styling
    modalImagesGrid.className = `modal-images-grid ${project.type || 'default'}`;
    
    // Get image sources array for lightbox
    const imageSources = project.images.map(img => 
        typeof img === 'string' ? img : img.src
    );
    
    // Create image items
    project.images.forEach((imageData, index) => {
        const imageSrc = typeof imageData === 'string' ? imageData : imageData.src;
        const behanceLink = typeof imageData === 'object' ? imageData.behance : null;
        const githubLink = typeof imageData === 'object' ? imageData.github : null;
        const demoLink = typeof imageData === 'object' ? imageData.demo : null;
        
        const imageItem = document.createElement('div');
        imageItem.className = `modal-image-item ${project.type || 'default'}`;
        
        // Create image wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `${project.title} ${index + 1}`;
        
        imageWrapper.appendChild(img);
        
        // Add Behance link button for UI/UX projects
        if (behanceLink && project.type === 'ux') {
            const behanceBtn = document.createElement('a');
            behanceBtn.href = behanceLink;
            behanceBtn.target = '_blank';
            behanceBtn.rel = 'noopener noreferrer';
            behanceBtn.className = 'project-link behance-link';
            behanceBtn.innerHTML = '<i class="fab fa-behance"></i> View on Behance';
            behanceBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent lightbox from opening
            });
            imageWrapper.appendChild(behanceBtn);
        }
        
        // Add GitHub and Demo links for Web projects
        if (project.type === 'web') {
            const linksContainer = document.createElement('div');
            linksContainer.className = 'project-links-container';
            
            if (githubLink) {
                const githubBtn = document.createElement('a');
                githubBtn.href = githubLink;
                githubBtn.target = '_blank';
                githubBtn.rel = 'noopener noreferrer';
                githubBtn.className = 'project-link github-link';
                githubBtn.innerHTML = '<i class="fab fa-github"></i> GitHub';
                githubBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                linksContainer.appendChild(githubBtn);
            }
            
            if (demoLink) {
                const demoBtn = document.createElement('a');
                demoBtn.href = demoLink;
                demoBtn.target = '_blank';
                demoBtn.rel = 'noopener noreferrer';
                demoBtn.className = 'project-link demo-link';
                demoBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Live Demo';
                demoBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                linksContainer.appendChild(demoBtn);
            }
            
            imageWrapper.appendChild(linksContainer);
        }
        
        imageItem.appendChild(imageWrapper);
        
        // Click to open lightbox
        imageItem.addEventListener('click', (e) => {
            // Don't open lightbox if clicking on any link button
            if (!e.target.closest('.project-link') && !e.target.closest('.project-links-container')) {
                openLightbox(imageSources, index);
            }
        });
        
        modalImagesGrid.appendChild(imageItem);
    });
    
    // Show modal
    projectModal.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeProjectModal() {
    projectModal.classList.remove('active');
    body.style.overflow = '';
}

function openLightbox(images, startIndex = 0) {
    currentLightboxImages = images;
    currentLightboxIndex = startIndex;
    updateLightboxImage();
    lightbox.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    body.style.overflow = '';
}

function updateLightboxImage() {
    if (currentLightboxImages.length === 0) return;
    lightboxImage.src = currentLightboxImages[currentLightboxIndex];
    lightboxImage.alt = `Image ${currentLightboxIndex + 1} of ${currentLightboxImages.length}`;
    
    // Show/hide navigation buttons
    lightboxPrev.style.display = currentLightboxIndex > 0 ? 'flex' : 'none';
    lightboxNext.style.display = currentLightboxIndex < currentLightboxImages.length - 1 ? 'flex' : 'none';
}

function nextLightboxImage() {
    if (currentLightboxIndex < currentLightboxImages.length - 1) {
        currentLightboxIndex++;
        updateLightboxImage();
    }
}

function prevLightboxImage() {
    if (currentLightboxIndex > 0) {
        currentLightboxIndex--;
        updateLightboxImage();
    }
}

// Event listeners
modalClose.addEventListener('click', closeProjectModal);
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevLightboxImage);
lightboxNext.addEventListener('click', nextLightboxImage);

// Close modal/lightbox when clicking overlay
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal || e.target.classList.contains('modal-overlay')) {
        closeProjectModal();
    }
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevLightboxImage();
        } else if (e.key === 'ArrowRight') {
            nextLightboxImage();
        }
    } else if (projectModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    }
});

// ============================================
// INITIALIZE ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to body
    body.style.opacity = '0';
    setTimeout(() => {
        body.style.transition = 'opacity 0.5s ease';
        body.style.opacity = '1';
    }, 100);
    
    // Initialize tooltips or other features here if needed
    console.log('Portfolio loaded successfully!');
});
