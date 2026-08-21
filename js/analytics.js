// Google Analytics (gtag.js) Centralized Delayed Non-blocking Script
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "G-E0TGCJ3HWY");

(function () {
    var loaded = false;
    function loadGtag() {
        if (loaded) return;
        loaded = true;
        var gscript = document.createElement("script");
        gscript.async = true;
        gscript.src = "https://www.googletagmanager.com/gtag/js?id=G-E0TGCJ3HWY";
        document.head.appendChild(gscript);
    }

    // Trigger loading on user interaction or after 3.5s delay
    var events = ['mousemove', 'touchstart', 'scroll', 'keydown', 'click'];
    events.forEach(function (e) {
        window.addEventListener(e, loadGtag, { passive: true, once: true });
    });

    setTimeout(loadGtag, 3500);
})();
