document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Smooth Scrolling & Active State Update ---
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }

            // Remove active from all
            navItems.forEach(item => item.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
        
        // Header scroll shadow
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '0'; // Will default to css padding
        }
    });


    // --- Typing Effect ---
    const typedElement = document.querySelector('.typed');
    if (typedElement) {
        const typedItems = typedElement.getAttribute('data-typed-items').split(',');
        let itemIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentItem = typedItems[itemIndex].trim();
            
            if (isDeleting) {
                typedElement.textContent = currentItem.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedElement.textContent = currentItem.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentItem.length) {
                // Pause at the end of word
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                itemIndex = (itemIndex + 1) % typedItems.length;
                typingSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(type, typingSpeed);
        }
        
        setTimeout(type, 1000);
    }


    // --- Scroll Animations (Custom AOS) ---
    const animateElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay if specified
                const delay = entry.target.getAttribute('data-aos-delay');
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                
                entry.target.classList.add('aos-animate');
                // Optional: unobserve if we only want it to animate once
                // observer.unobserve(entry.target); 
            } else {
                // Remove class when out of view so it animates again when scrolling back up
                entry.target.classList.remove('aos-animate');
                entry.target.style.transitionDelay = '0ms'; // reset delay
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        scrollObserver.observe(el);
    });

});
