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
        document.body.style.overflow = 'hidden';
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

    // ── Logged-In User State in Navbar ───────────────────
    updateNavbarUserState();

});

// ── Navbar Auth State ─────────────────────────────────────
function updateNavbarUserState() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const getStartedBtn = document.querySelector('#navbar > a[href="Signup.html"]');

    if (loggedInUser && getStartedBtn) {
        const initials = ((loggedInUser.f_name || 'U')[0] + (loggedInUser.l_name || '')[0]).toUpperCase();
        const firstName = loggedInUser.f_name || 'User';

        // Replace the "Let's Get Started" button with user avatar
        getStartedBtn.innerHTML = `
            <span class="nav-user-pill" title="My Dashboard" onclick="window.location.href='dashboard.html'" style="
                display:inline-flex;align-items:center;gap:8px;cursor:pointer;
                background:linear-gradient(135deg,#088178,#04b49c);
                color:#fff;padding:7px 14px 7px 8px;border-radius:50px;
                font-size:13px;font-weight:600;border:none;
                box-shadow:0 2px 10px rgba(8,129,120,0.3);transition:all .2s ease;">
                <span style="background:rgba(255,255,255,0.25);width:26px;height:26px;
                             border-radius:50%;display:inline-flex;align-items:center;
                             justify-content:center;font-size:11px;font-weight:700;">${initials}</span>
                Hi, ${firstName}
            </span>`;
    }
}

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
const savedUsers = JSON.parse(localStorage.getItem('keyDetails')) || [];
const userLogin  = document.getElementById('loginAccount');

if (userLogin) {
    userLogin.addEventListener('click', () => {
        const userEmail    = document.getElementById('email').value.trim();
        const userPassword = document.getElementById('password').value.trim();
        const rememberMe   = document.querySelector('#loginAccount ~ * input[type="checkbox"], .options input[type="checkbox"]');
        const emailRegex   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!userEmail && !userPassword) {
            Toastify({
                text: 'Please fill in all fields.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)', maxWidth: '100%' }
            }).showToast();
            return;
        }

        if (!userEmail) {
            Toastify({
                text: 'Please enter your email.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)', maxWidth: '100%' }
            }).showToast();
            return;
        }

        if (!emailRegex.test(userEmail)) {
            Toastify({
                text: 'Please enter a valid email address.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)', maxWidth: '100%' }
            }).showToast();
            return;
        }

        if (!userPassword) {
            Toastify({
                text: 'Please enter your password.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)', maxWidth: '100%' }
            }).showToast();
            return;
        }

        const found = savedUsers.find(u => u.email === userEmail && u.password === userPassword);

        if (found) {
            // Save logged-in session
            localStorage.setItem('loggedInUser', JSON.stringify(found));

            // Handle "Remember Me"
            if (rememberMe && rememberMe.checked) {
                localStorage.setItem('rememberedEmail', userEmail);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            userLogin.innerHTML = `
                <span style="display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span style="width:16px;height:16px;border:3px solid rgba(255,255,255,0.3);
                                 border-top-color:#fff;border-radius:50%;
                                 animation:loginSpin 0.7s linear infinite;display:inline-block;"></span>
                    Logging in...
                </span>`;
            userLogin.disabled = true;

            Toastify({
                text: `✓ Welcome back, ${found.f_name}! Redirecting...`,
                className: 'info',
                duration: 3000,
                style: { background: 'linear-gradient(to right, #088178, #04b49c)', maxWidth: '100%' }
            }).showToast();

            setTimeout(() => { window.location.href = 'dashboard.html'; }, 2500);
        } else {
            Toastify({
                text: 'Invalid email or password. Please try again.',
                className: 'info',
                duration: 4000,
                style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)', maxWidth: '100%' }
            }).showToast();

            // Shake the button
            userLogin.style.animation = 'none';
            void userLogin.offsetWidth;
            userLogin.style.animation = 'inputShake 0.4s ease';
        }
    });

    // Pre-fill email if "Remember Me" was previously checked
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.value = remembered;
    }
}

// Inject spinner keyframe
const loginStyle = document.createElement('style');
loginStyle.textContent = '@keyframes loginSpin { to { transform: rotate(360deg); } }';
document.head.appendChild(loginStyle);

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
        } else {
            // Product not found — show graceful error
            prodetails.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:80px 20px;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:48px;color:#f4a261;margin-bottom:16px;"></i>
                    <h2>Product Not Found</h2>
                    <p style="color:#888;margin:12px 0 24px;">The product you're looking for doesn't exist or has been removed.</p>
                    <a href="shop.html" style="background:#088178;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;">Back to Shop</a>
                </div>`;
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
