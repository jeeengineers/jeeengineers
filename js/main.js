(function ($) {
    "use strict";

    // Spinner
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
        });
    }
    
    // Initiate WOW.js if available
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });

    // Facts counter
    if ($.fn.counterUp) {
        $('[data-toggle="counter-up"]').counterUp({
            delay: 10,
            time: 2000
        });
    }
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
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

