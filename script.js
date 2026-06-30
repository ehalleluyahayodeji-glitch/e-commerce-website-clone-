/* ==========================================================
   script.js — Fashion E-Commerce Shared Scripts
   Handles: mobile navbar, password toggle, login logic,
            scroll reveal, sticky header, back-to-top
   ========================================================== */

// ── Mobile Navbar Toggle ──────────────────────────────────
const bar   = document.getElementById('bar');
const close = document.getElementById('close');
const nav   = document.getElementById('navbar');
const mobileBag = document.querySelector('#mobile .cart-icon-wrapper');

function toggleMobileBag(hide) {
    if (mobileBag) {
        mobileBag.style.display = hide ? 'none' : 'flex';
    }
}

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scroll when open
        toggleMobileBag(true);
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
        document.body.style.overflow = '';
        toggleMobileBag(false);
    });
}

// Close navbar when clicking outside of it
document.addEventListener('click', (e) => {
    if (nav && nav.classList.contains('active')) {
        if (!nav.contains(e.target) && e.target !== bar) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
            toggleMobileBag(false);
        }
    }
});

// ── Scroll Reveal (Intersection Observer) ────────────────
document.addEventListener('DOMContentLoaded', () => {

    const scrollEls = document.querySelectorAll('.scroll-reveal');
    if (scrollEls.length && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        scrollEls.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        scrollEls.forEach(el => el.classList.add('visible'));
    }

    // ── Hero "Shop Now" button ────────────────────────────
    const heroBtn = document.getElementById('hero-shop-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
    }

});

// ── Password Toggle (Login page) ─────────────────────────
const eyeIcon      = document.querySelector('.password-field i');
const passwordInput = document.querySelector('.password-field input');

if (eyeIcon && passwordInput) {
    eyeIcon.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}

// ── LOGIN — localStorage Auth ─────────────────────────────
const savedUser  = JSON.parse(localStorage.getItem('keyDetails')) || [];
const userLogin  = document.getElementById('loginAccount');

if (userLogin) {
    userLogin.addEventListener('click', () => {
        const userEmail    = document.getElementById('email').value.trim();
        const userPassword = document.getElementById('password').value.trim();

        if (!userEmail && !userPassword) {
            Toastify({
                text: 'Please fill in all fields.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)' }
            }).showToast();
            return;
        }

        if (!userEmail) {
            Toastify({
                text: 'Please enter your email.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)' }
            }).showToast();
            return;
        }

        if (!userPassword) {
            Toastify({
                text: 'Please enter your password.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)' }
            }).showToast();
            return;
        }

        const found = savedUser.find(u => u.email === userEmail && u.password === userPassword);

        if (found) {
            userLogin.innerHTML = `
                <span style="display:flex;align-items:center;justify-content:center;gap:8px">
                    <span class="login-spinner"></span> Logging in...
                </span>`;
            userLogin.disabled = true;

            Toastify({
                text: '✓ Login Successful! Redirecting...',
                className: 'info',
                duration: 3000,
                style: { background: 'linear-gradient(to right, #088178, #04b49c)' }
            }).showToast();

            setTimeout(() => { window.location.href = 'dashboard.html'; }, 2500);
        } else {
            Toastify({
                text: 'Invalid email or password. Please try again.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)' }
            }).showToast();

            // Shake the button
            userLogin.style.animation = 'none';
            void userLogin.offsetWidth;
            userLogin.style.animation = 'inputShake 0.4s ease';
        }
    });
}

// ── DYNAMIC SINGLE PRODUCT LOGIC ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the single product page
    const prodetails = document.getElementById('prodetails');
    if (!prodetails) return;

    // Get the product ID from the URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId && typeof getProductById === 'function') {
        const product = getProductById(productId);
        if (product) {
            // Populate the data
            document.getElementById('MainImg').src = product.images[0];
            document.getElementById('prod-brand').innerText = `Home / ${product.brand}`;
            document.getElementById('prod-name').innerText = product.name;
            document.getElementById('prod-price').innerText = `$${product.price.toFixed(2)}`;
            document.getElementById('prod-desc').innerText = product.description;

            // Populate the small images
            const smallImgGroup = document.getElementById('small-img-group');
            if (smallImgGroup) {
                smallImgGroup.innerHTML = product.images.map((img, index) => `
                    <div class="small-img-col">
                        <img src="${img}" width="100%" class="small-img ${index === 0 ? 'small-img--active' : ''}" alt="Product view ${index + 1}">
                    </div>
                `).join('');
            }

            // Image switcher logic
            const mainImg = document.getElementById('MainImg');
            const smallImgs = document.querySelectorAll('.small-img');

            smallImgs.forEach((img) => {
                img.addEventListener('click', () => {
                    mainImg.src = img.src;
                    smallImgs.forEach(i => i.classList.remove('small-img--active'));
                    img.classList.add('small-img--active');
                });
            });
        }
    } else {
        // Image switcher logic fallback (if no dynamic product)
        const mainImg = document.getElementById('MainImg');
        const smallImgs = document.querySelectorAll('.small-img');
        if (mainImg && smallImgs.length) {
            smallImgs.forEach((img) => {
                img.addEventListener('click', () => {
                    mainImg.src = img.src;
                    smallImgs.forEach(i => i.classList.remove('small-img--active'));
                    img.classList.add('small-img--active');
                });
            });
        }
    }

    // Image Zoom functionality
    const zoomContainer = document.getElementById('img-zoom-container');
    const mainImgNode = document.getElementById('MainImg');

    if (zoomContainer && mainImgNode) {
        zoomContainer.addEventListener('mousemove', (e) => {
            const rect = zoomContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = Math.round(100 / (rect.width / x));
            const yPercent = Math.round(100 / (rect.height / y));

            mainImgNode.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        });

        zoomContainer.addEventListener('mouseleave', () => {
            mainImgNode.style.transformOrigin = 'center center';
        });
    }
});
