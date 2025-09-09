document.addEventListener('DOMContentLoaded', function() {
    // Daftar section yang akan dimuat - SESUAIKAN DENGAN NAMA FILE
    const sections = [
        { id: 'navbar', file: 'sections/navbar.html' },
        { id: 'hero', file: 'sections/hero.html' },
        { id: 'trusted-by', file: 'sections/trusted-by.html' },
        { id: 'services', file: 'sections/services.html' },
        { id: 'about', file: 'sections/about.html' },
        { id: 'work', file: 'sections/work.html' },
        { id: 'testimonial', file: 'sections/testimonials.html' },
        { id: 'cta', file: 'sections/cta.html' },
        { id: 'footer', file: 'sections/footer.html' } 
    ];
    
    let loadedSections = 0;
    const totalSections = sections.length;
    
    // Memuat setiap section
    sections.forEach(section => {
        fetch(section.file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${section.file}: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(section.id + '-container').innerHTML = data;
                
                console.log(`Loaded: ${section.file}`);
                loadedSections++;
                
                // Jika ini adalah navbar, jalankan script untuk navbar
                if (section.id === 'navbar') {
                    setTimeout(initNavbar, 50);
                }
                
                // Jika ini adalah work section, init toggle projects
                if (section.id === 'work') {
                    setTimeout(initProjectsToggle, 100);
                }
                
                // Jika semua section telah dimuat, jalankan script utama
                if (loadedSections === totalSections) {
                    setTimeout(initMainScript, 300);
                }
            })
            .catch(error => {
                console.error(`Error loading ${section.file}:`, error);
                document.getElementById(section.id + '-container').innerHTML = `
                    <div style="color: red; padding: 20px; border: 1px solid red;">
                        Error loading ${section.file}: ${error.message}
                    </div>
                `;
                loadedSections++;
            });
    });
});

function initNavbar() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        let menuOpen = false;

        mobileMenuBtn.addEventListener('click', () => {
            if (!menuOpen) {
                mobileMenu.classList.add('show');
                mobileMenu.classList.remove('pointer-events-none');
            } else {
                mobileMenu.classList.remove('show');
                mobileMenu.classList.add('pointer-events-none');
            }
            menuOpen = !menuOpen;
        });
    }
    
    console.log('Navbar initialized');
}

// Fungsi untuk inisialisasi toggle projects - INI YANG DIPERBAIKI
function initProjectsToggle() {
    console.log('Initializing projects toggle...');
    
    // Tunggu sebentar untuk memastikan DOM siap
    const checkAndInit = () => {
        const toggleBtn = document.getElementById('toggleProjectsBtn');
        const hiddenProjects = document.querySelectorAll('.project-hidden');
        
        console.log('Toggle button found:', toggleBtn);
        console.log('Hidden projects found:', hiddenProjects.length);
        
        if (toggleBtn && hiddenProjects.length > 0) {
            let isExpanded = false;

            // Hapus event listener yang mungkin sudah ada sebelumnya
            const newToggleBtn = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

            newToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Toggle button clicked, isExpanded:', isExpanded);
                
                hiddenProjects.forEach((project, index) => {
                    console.log(`Processing project ${index}:`, project);
                    
                    if (!isExpanded) {
                        project.classList.remove('hidden');
                        // Trigger reflow untuk memastikan animasi berjalan
                        void project.offsetWidth;
                        project.classList.add('show');
                        project.classList.remove('hide');
                    } else {
                        project.classList.add('hide');
                        project.classList.remove('show');
                        setTimeout(() => {
                            project.classList.add('hidden');
                        }, 400);
                    }
                });

                // Mengubah teks dan ikon tombol
                if (isExpanded) {
                    newToggleBtn.innerHTML = `
                        <span>See More</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    `;
                } else {
                    newToggleBtn.innerHTML = `
                        <span>Show Less</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                    `;
                }
                
                isExpanded = !isExpanded;
            });
            
            console.log('Projects toggle initialized successfully!');
            return true;
        } else {
            console.log('Toggle button or hidden projects not found, retrying...');
            return false;
        }
    };
    
    // Coba inisialisasi dengan delay bertingkat
    if (!checkAndInit()) {
        setTimeout(() => {
            if (!checkAndInit()) {
                setTimeout(() => {
                    checkAndInit();
                }, 500);
            }
        }, 200);
    }
}

function initMainScript() {
    console.log('All sections loaded, initializing main script...');
    
    // Smooth scrolling for navigation links
    const OFFSET = 45;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);

            if (target) {
                e.preventDefault();
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - OFFSET;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('nav');
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('backdrop-blur-xl');
        } else if (navbar) {
            navbar.classList.remove('backdrop-blur-xl');
        }
    });

    // Intersection Observer untuk animasi
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe all service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // Scroll reveal observer
    const scrollRevealOptions = {
        threshold: 0.1
    };

    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, scrollRevealOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        scrollRevealObserver.observe(el);
    });

    // Initialize navbar animation
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.classList.remove('opacity-0', '-translate-y-10');
        navbar.classList.add('opacity-100', 'translate-y-0');
    }

    // Service card hover effects
    document.querySelectorAll('.service-card').forEach(card => {
        const img = card.querySelector('img');
        const title = card.querySelector('h3');
        const text = card.querySelector('p');

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.01)';
            card.style.transition = 'transform 0.3s ease-out, box-shadow 0.4s ease-out';

            if (img) img.style.transform = 'scale(1.02)';
            if (title) title.style.color = '#1dd1a1';
            if (text) {
                text.style.transform = 'translateY(-3px)';
                text.style.opacity = '0.9';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.transition = 'transform 0.6s ease-out, box-shadow 0.4s ease-out';

            if (img) img.style.transform = 'scale(1)';
            if (title) title.style.color = '';
            if (text) {
                text.style.transform = 'translateY(0)';
                text.style.opacity = '1';
            }
        });
    });

    // Service cards animation dengan delay
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(serviceCards).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.15}s`;
                entry.target.classList.add('show');
                serviceCardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    serviceCards.forEach(card => {
        serviceCardObserver.observe(card);
    });

    // Pastikan toggle projects diinisialisasi lagi jika belum
    setTimeout(() => {
        const toggleBtn = document.getElementById('toggleProjectsBtn');
        if (toggleBtn && !toggleBtn.hasAttribute('data-initialized')) {
            console.log('Re-initializing projects toggle from main script...');
            initProjectsToggle();
        }
    }, 500);

    console.log('Main script initialized successfully');
}