/*  for the header transition animation */
document.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const l_white = document.getElementById('l_white');
    const l_black = document.getElementById('l_black');

    if (window.scrollY >= 80) {
        if (header) header.classList.add('scrolled');
        if (l_white) l_white.style.display = 'none';
        if (l_black) l_black.style.display = 'block';
    } else {
        if (header) header.classList.remove('scrolled');
        if (l_white) l_white.style.display = 'block';
        if (l_black) l_black.style.display = 'none';
    }
});



/* Count-up animation when element enters the viewport */
(function(){
    const parseTarget = (text) => {
        if (!text) return null;
        const clean = text.replace(/\s+/g, '');
        // Match rating like 4.9/5
        const ratingMatch = clean.match(/^([\d.]+)\/([\d.]+)$/);
        if (ratingMatch) {
            const val = parseFloat(ratingMatch[1]);
            const denom = ratingMatch[2];
            const decimals = (ratingMatch[1].split('.')[1] || '').length;
            return { type: 'rating', target: val, denom, decimals };
        }
        // Match formats like 150K+, 1M+
        const kmMatch = clean.match(/^([\d,.]+)([kKmM])\+?$/);
        if (kmMatch) {
            const num = parseFloat(kmMatch[1].replace(/,/g, '')) || 0;
            const unit = kmMatch[2].toLowerCase();
            return { type: 'unit', target: Math.round(num * (unit === 'k' ? 1000 : 1000000)), unit };
        }
        // Plain integer or float
        const numMatch = clean.match(/^[\d,.]+(\.[\d]+)?$/);
        if (numMatch) {
            const asNum = parseFloat(clean.replace(/,/g, '')) || 0;
            const decimals = (clean.split('.')[1] || '').length;
            return { type: 'number', target: asNum, decimals };
        }
        return null;
    };

    const formatDisplay = (value, originalText, info) => {
        if (info && info.type === 'rating') {
            const decimals = info.decimals || 1;
            return value.toFixed(decimals).replace(/\.0+$/, '') + '/' + info.denom;
        }
        if (info && info.type === 'unit') {
            if (/k/i.test(info.unit)) {
                return Math.floor(value / 1000).toLocaleString() + 'K+';
            }
            if (/m/i.test(info.unit)) {
                return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
            }
        }
        if (info && info.type === 'number' && info.decimals > 0) {
            return value.toFixed(info.decimals).replace(/\.0+$/, '');
        }
        return Math.floor(value).toLocaleString();
    };

    const animate = (el, info, originalText) => {
        const target = info.target;
        const duration = 1400;
        const start = performance.now();
        const startVal = 0;
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out
            const current = startVal + (target - startVal) * ease;
            el.textContent = formatDisplay(current, originalText, info);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const original = el.textContent || '';
            const info = parseTarget(original);
            if (info !== null && info.target !== null && info.target > 0) {
                animate(el, info, original);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    // Observe only `.fs-big` elements that contain numeric patterns
    document.querySelectorAll('.fs-big').forEach(el => {
        const txt = (el.textContent || '').trim();
        if (/\d/.test(txt)) {
            const possible = parseTarget(txt);
            if (possible !== null) observer.observe(el);
        }
    });
})();
