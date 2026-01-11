// Function to handle section switching
function switchSection(targetId) {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');

    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update Navigation Lines
    // Consider 'ui-ux-projects' and 'graphic-projects' as part of 'projects' for navigation state
    let navTarget = targetId;
    if (targetId === 'ui-ux-projects' || targetId === 'graphic-projects') {
        navTarget = 'projects';
    }

    navItems.forEach(item => {
        if (item.dataset.target === navTarget) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Scroll to top of the section/body just in case
    window.scrollTo(0, 0);
}

// Make it global
window.switchSection = switchSection;

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const logo = document.querySelector('.logo');

    // Event Listeners for Nav Items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.dataset.target;
            switchSection(target);
        });
    });

    // Logo Click -> Return to Hero
    if (logo) {
        logo.addEventListener('click', () => {
            switchSection('hero');
        });
    }

    // Optional: Micro-interaction for hover on projects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', () => {
            setTimeout(() => {
                card.style.zIndex = '1';
            }, 300);
        });
    });

    // Background Music Toggle
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    if (musicToggle && bgMusic) {
        // Set initial volume
        bgMusic.volume = 0.3;

        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                // Fade out and pause
                let volume = bgMusic.volume;
                const fadeOut = setInterval(() => {
                    if (volume > 0.05) {
                        volume -= 0.05;
                        bgMusic.volume = volume;
                    } else {
                        bgMusic.pause();
                        bgMusic.volume = 0.3;
                        clearInterval(fadeOut);
                    }
                }, 50);

                musicToggle.classList.remove('playing');
                musicToggle.querySelector('i').className = 'fas fa-volume-mute';
                isPlaying = false;
            } else {
                // Play and fade in
                bgMusic.volume = 0;
                bgMusic.play().then(() => {
                    let volume = 0;
                    const fadeIn = setInterval(() => {
                        if (volume < 0.3) {
                            volume += 0.05;
                            bgMusic.volume = Math.min(volume, 0.3);
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 50);

                    musicToggle.classList.add('playing');
                    musicToggle.querySelector('i').className = 'fas fa-volume-up';
                    isPlaying = true;
                }).catch(err => {
                    console.log('Audio playback failed:', err);
                });
            }
        });
    }

    // Contact Form Submission with EmailJS
    // Initialize EmailJS with your Public Key
    emailjs.init('fPWnhukKVUcBQfiok'); // Replace with your actual public key from EmailJS dashboard

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Send email using EmailJS
            const serviceID = 'service_huxljhc'; // Replace with your Service ID
            const templateID = 'template_jtz73ee'; // Replace with your Template ID

            const templateParams = {
                from_name: contactForm.name.value,
                from_email: contactForm.email.value,
                message: contactForm.message.value,
                to_email: 'fatmaesam263@gmail.com'
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);

                    // Show success message
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = 'var(--accent)';
                    submitBtn.style.color = 'var(--bg-color)';

                    // Reset form
                    contactForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                    }, 3000);

                }, function (error) {
                    console.log('FAILED...', error);

                    // Show error message
                    submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed. Try again';
                    submitBtn.style.background = '#ff4444';
                    submitBtn.style.color = '#fff';

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                    }, 3000);
                });
        });
    }
});
