// ================================
// Gallery Lightbox Functionality
// ================================

document.addEventListener('DOMContentLoaded', function() {

    // Get lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');

    // ================================
    // Open Lightbox
    // ================================
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-caption');

            if (img && lightbox) {
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;

                if (caption) {
                    lightboxCaption.textContent = caption.textContent;
                } else {
                    lightboxCaption.textContent = img.alt;
                }

                // Prevent body scroll when lightbox is open
                document.body.style.overflow = 'hidden';

                // Add animation
                setTimeout(() => {
                    lightboxImg.style.animation = 'zoomIn 0.3s ease-out';
                }, 10);
            }
        });

        // Add keyboard support for gallery items
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Open image in lightbox');

        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ================================
    // Close Lightbox
    // ================================
    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
            lightboxImg.style.animation = '';
        }
    }

    // Close on X button click
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });

    // ================================
    // Navigation between images
    // ================================
    let currentImageIndex = 0;
    const galleryImages = Array.from(galleryItems);

    function showImage(index) {
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;

        currentImageIndex = index;
        const item = galleryImages[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');

        lightboxImg.style.animation = 'fadeIn 0.3s ease-out';
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;

        if (caption) {
            lightboxCaption.textContent = caption.textContent;
        } else {
            lightboxCaption.textContent = img.alt;
        }
    }

    // Update current index when opening lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentImageIndex = index;
        });
    });

    // Arrow key navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                showImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showImage(currentImageIndex + 1);
            }
        }
    });

    // ================================
    // Touch/Swipe Support for Mobile
    // ================================
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                showImage(currentImageIndex + 1);
            } else {
                // Swipe right - previous image
                showImage(currentImageIndex - 1);
            }
        }
    }

    // ================================
    // Gallery Hover Effects Enhancement
    // ================================
    galleryItems.forEach(item => {
        const img = item.querySelector('img');

        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ================================
    // Lazy Loading for Gallery Images
    // ================================
    if ('IntersectionObserver' in window) {
        const galleryObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && img.getAttribute('loading') === 'lazy') {
                        // Image will load automatically due to loading="lazy" attribute
                        // Add a fade-in effect when loaded
                        img.addEventListener('load', function() {
                            this.style.animation = 'fadeIn 0.5s ease-out';
                        });
                    }
                    galleryObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        galleryItems.forEach(item => {
            galleryObserver.observe(item);
        });
    }

    // ================================
    // Add CSS animations dynamically
    // ================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes zoomIn {
            from {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
            }
            to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .gallery-item {
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .gallery-item:focus {
            outline: 3px solid var(--primary-color);
            outline-offset: 3px;
        }

        .lightbox-content {
            animation: zoomIn 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
});
