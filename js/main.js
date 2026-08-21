(function ($) {
    "use strict";

    // Spinner - Hide cleanly without layout thrashing
    var spinner = function () {
        setTimeout(function () {
            var spinnerEl = document.getElementById('spinner');
            if (spinnerEl) {
                spinnerEl.classList.remove('show');
            } else if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Failsafe to ensure spinner hides when window loads
    if (typeof window !== 'undefined') {
        window.addEventListener('load', function () {
            var spinnerEl = document.getElementById('spinner');
            if (spinnerEl) {
                spinnerEl.classList.remove('show');
            }
        }, { passive: true });
    }
    
    // Initiate WOW.js if available (defer slightly to avoid initial paint reflow)
    if (typeof WOW !== 'undefined') {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(function () { new WOW().init(); });
        } else {
            setTimeout(function () { new WOW().init(); }, 100);
        }
    }

    // Throttled Scroll Listener using requestAnimationFrame (prevents forced reflow)
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                var top = window.pageYOffset || document.documentElement.scrollTop;
                
                // Sticky Navbar toggle
                if (top > 300) {
                    $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
                } else {
                    $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
                }

                // Back to top button toggle
                if (top > 100) {
                    $('.back-to-top').fadeIn('slow');
                } else {
                    $('.back-to-top').fadeOut('slow');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Facts counter
    if ($.fn.counterUp) {
        $('[data-toggle="counter-up"]').counterUp({
            delay: 10,
            time: 2000
        });
    }
    
    // Back to top click handler
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Testimonials carousel
    if ($.fn.owlCarousel && $(".testimonial-carousel").length > 0) {
        $(".testimonial-carousel").owlCarousel({
            items: 1,
            autoplay: true,
            smartSpeed: 1000,
            dots: true,
            loop: true,
            nav: true,
            navText : [
                '<i class="bi bi-chevron-left"></i>',
                '<i class="bi bi-chevron-right"></i>'
            ]
        });
    }
    
})(jQuery);
