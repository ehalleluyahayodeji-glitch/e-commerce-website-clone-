/* ==========================================================
   cart.js — Fashion E-Commerce Cart System
   Handles: add, remove, update, total, badge, render
   ========================================================== */

// ─── Constants ────────────────────────────────────────────
const CART_KEY = 'fashionCartItems';

// ─── Helper: get cart from localStorage ───────────────────
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// ─── Helper: save cart to localStorage ────────────────────
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ─── Activity Logger ──────────────────────────────────────
function logActivity(message, icon = 'fa-check', iconClass = 'green') {
    const activities = JSON.parse(localStorage.getItem('fashionActivity')) || [];
    const now = new Date();
    // Format: "2 hours ago" or just the date string if complex. We'll store exact timestamp and format in dashboard.
    activities.unshift({
        msg: message,
        icon: icon,
        iconClass: iconClass,
        timestamp: now.toISOString(),
        unread: true
    });
    // Keep last 50 activities
    if (activities.length > 50) activities.pop();
    localStorage.setItem('fashionActivity', JSON.stringify(activities));
}

// ─── Add to Cart ──────────────────────────────────────────
function addToCart(id, name, price, image, brand) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), image, brand, qty: 1 });
    }

    saveCart(cart);
    updateCartBadge();
    showCartToast(`"${name}" added to cart!`);
    logActivity(`You added <strong>${name}</strong> to your cart.`, 'fa-cart-arrow-down', 'teal');
}

// ─── Remove from Cart ─────────────────────────────────────
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartBadge();
    renderCartTable();
    updateCartTotal();
}

// ─── Update Quantity ──────────────────────────────────────
function updateCartQty(index, qty) {
    const cart = getCart();
    const parsedQty = parseInt(qty);
    if (parsedQty < 1) {
        removeFromCart(index);
        return;
    }
    cart[index].qty = parsedQty;
    saveCart(cart);
    updateCartBadge();
    updateCartTotal();
}

// ─── Calculate Total ──────────────────────────────────────
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// ─── Update Badge on all pages ────────────────────────────
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';

        // Pulse animation on update
        badge.classList.remove('badge-pulse');
        void badge.offsetWidth; // reflow
        badge.classList.add('badge-pulse');
    });
}

// ─── Show Toast Notification ──────────────────────────────
function showCartToast(message, type = 'success') {
    // Remove any existing toast
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `cart-toast cart-toast--${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger show animation
    requestAnimationFrame(() => toast.classList.add('cart-toast--show'));

    setTimeout(() => {
        toast.classList.remove('cart-toast--show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ─── Render Cart Table (on cart.html) ─────────────────────
function renderCartTable() {
    const cartBody = document.getElementById('cart-body');
    const emptyMsg = document.getElementById('cart-empty');
    if (!cartBody) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartBody.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = 'block';
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';

    cartBody.innerHTML = cart.map((item, index) => `
        <tr class="cart-row" data-index="${index}">
            <td>
                <button class="cart-remove-btn" onclick="removeFromCart(${index})" title="Remove item">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </td>
            <td><img src="${item.image}" alt="${item.name}" class="cart-img"></td>
            <td class="cart-product-name">
                <span class="cart-brand">${item.brand || ''}</span>
                ${item.name}
            </td>
            <td class="cart-price">$${item.price.toFixed(2)}</td>
            <td>
                <div class="cart-qty-control">
                    <button onclick="stepQty(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <input type="number" min="1" value="${item.qty}"
                        onchange="updateCartQty(${index}, this.value)"
                        id="qty-${index}">
                    <button onclick="stepQty(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
            </td>
            <td class="cart-subtotal" id="subtotal-${index}">$${(item.price * item.qty).toFixed(2)}</td>
        </tr>
    `).join('');
}

// ─── Step quantity up/down ────────────────────────────────
function stepQty(index, delta) {
    const cart = getCart();
    const newQty = (cart[index]?.qty || 1) + delta;
    if (newQty < 1) {
        removeFromCart(index);
        return;
    }
    cart[index].qty = newQty;
    saveCart(cart);
    updateCartBadge();
    renderCartTable();
    updateCartTotal();
}

// ─── Update Cart Total Section ────────────────────────────
function updateCartTotal() {
    const total = getCartTotal();
    const cart = getCart();

    const subtotalEl = document.getElementById('cart-subtotal-val');
    const totalEl = document.getElementById('cart-total-val');
    const itemCountEl = document.getElementById('cart-item-count');

    if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (itemCountEl) {
        const totalItems = cart.reduce((s, i) => s + i.qty, 0);
        itemCountEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    }
}

// ─── Coupon Apply ─────────────────────────────────────────
function applyCoupon() {
    const input = document.getElementById('coupon-input');
    const feedback = document.getElementById('coupon-feedback');
    if (!input || !feedback) return;

    const code = input.value.trim().toUpperCase();
    const validCoupons = { 'FASHION10': 10, 'SAVE20': 20, 'WELCOME15': 15 };

    if (!code) {
        showCouponFeedback(feedback, 'Please enter a coupon code.', false);
        return;
    }

    if (validCoupons[code]) {
        const discount = validCoupons[code];
        showCouponFeedback(feedback, `🎉 Coupon applied! ${discount}% off your order.`, true);
        applyDiscount(discount);
    } else {
        showCouponFeedback(feedback, '❌ Invalid coupon code. Try FASHION10, SAVE20, or WELCOME15.', false);
    }
}

function showCouponFeedback(el, msg, success) {
    el.textContent = msg;
    el.className = `coupon-feedback ${success ? 'coupon-feedback--success' : 'coupon-feedback--error'}`;
    el.style.display = 'block';
}

function applyDiscount(percent) {
    const total = getCartTotal();
    const discount = (total * percent) / 100;
    const discounted = total - discount;

    const totalEl = document.getElementById('cart-total-val');
    const discountRow = document.getElementById('discount-row');
    const discountVal = document.getElementById('discount-val');

    if (totalEl) totalEl.textContent = `$${discounted.toFixed(2)}`;
    if (discountRow) discountRow.style.display = '';
    if (discountVal) discountVal.textContent = `-$${discount.toFixed(2)}`;
}

// ─── Newsletter Validation ────────────────────────────────
function validateNewsletter(inputEl, btnEl) {
    const email = inputEl.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showCartToast('Please enter your email address.', 'error');
        inputEl.classList.add('input-error');
        return;
    }
    if (!emailRegex.test(email)) {
        showCartToast('Please enter a valid email address.', 'error');
        inputEl.classList.add('input-error');
        return;
    }

    inputEl.classList.remove('input-error');
    inputEl.value = '';
    showCartToast('🎉 You\'ve subscribed successfully!', 'success');

    if (btnEl) {
        const original = btnEl.textContent;
        btnEl.textContent = '✓ Subscribed!';
        btnEl.disabled = true;
        setTimeout(() => {
            btnEl.textContent = original;
            btnEl.disabled = false;
        }, 4000);
    }
}

// ─── Back to Top ──────────────────────────────────────────
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('btt-visible');
        } else {
            btn.classList.remove('btt-visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── Sticky Header Shadow ─────────────────────────────────
function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// ─── Init on DOMContentLoaded ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    initBackToTop();
    initStickyHeader();

    // Render cart if we're on cart.html
    if (document.getElementById('cart-body')) {
        renderCartTable();
        updateCartTotal();
    }

    // Product card cart icon handlers
    document.querySelectorAll('.pro').forEach(card => {
        const cartBtn = card.querySelector('.fa-shopping-cart, .fa-cart-plus');
        const imgEl = card.querySelector('img');
        const nameEl = card.querySelector('h5');
        const priceEl = card.querySelector('.des h4');
        const brandEl = card.querySelector('.des span');

        if (!cartBtn) return;

        const parent = cartBtn.closest('a') || cartBtn;
        parent.addEventListener('click', (e) => {
            e.preventDefault();
            const name = nameEl ? nameEl.textContent.trim() : 'Product';
            const price = priceEl ? priceEl.textContent.replace('$', '').trim() : '0';
            const image = imgEl ? imgEl.src : '';
            const brand = brandEl ? brandEl.textContent.trim() : '';
            const id = `${name}-${price}`.replace(/\s+/g, '-');

            addToCart(id, name, price, image, brand);
        });

        // Wishlist handling
        const wishBtn = card.querySelector('.fa-heart');
        if (wishBtn) {
            const wishParent = wishBtn.closest('button') || wishBtn;
            wishParent.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // prevent navigating to sproduct
                const name = nameEl ? nameEl.textContent.trim() : 'Product';
                const price = priceEl ? priceEl.textContent.trim() : '$0';
                const image = imgEl ? imgEl.src : '';
                const brand = brandEl ? brandEl.textContent.trim() : '';
                const id = `${name}-${price}`.replace(/\s+/g, '-');

                const wishlist = JSON.parse(localStorage.getItem('fashionWishlist')) || [];
                const existing = wishlist.find(item => item.id === id);

                if (!existing) {
                    wishlist.push({ id, product: name, price, img: image, brand });
                    localStorage.setItem('fashionWishlist', JSON.stringify(wishlist));
                    showCartToast(`"${name}" added to wishlist!`);
                    logActivity(`You favorited <strong>${name}</strong>.`, 'fa-heart', 'orange');
                } else {
                    showCartToast(`"${name}" is already in your wishlist!`, 'info');
                }
            });
        }
    });

    // Newsletter sign up buttons
    document.querySelectorAll('#newsletter .form').forEach(form => {
        const input = form.querySelector('input');
        const btn = form.querySelector('button');
        if (btn && input) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                validateNewsletter(input, btn);
            });
        }
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                showCartToast('Your cart is empty!', 'error');
                return;
            }
            showCartToast('Redirecting to checkout...', 'success');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 800);
        });
    }

    // Coupon button
    const couponBtn = document.getElementById('coupon-btn');
    if (couponBtn) {
        couponBtn.addEventListener('click', applyCoupon);
    }

    // sproduct.html — Add To Cart
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const name = document.querySelector('#prodetails .single-pro-details h4')?.textContent || 'Product';
            const price = document.querySelector('#prodetails .single-pro-details h2')?.textContent.replace('$', '') || '0';
            const image = document.getElementById('MainImg')?.src || '';
            const sizeEl = document.querySelector('#prodetails select');
            const size = sizeEl ? sizeEl.value : '';
            const qty = parseInt(document.querySelector('#prodetails input[type="number"]')?.value || 1);

            if (sizeEl && size === 'Select Size') {
                showCartToast('Please select a size first.', 'error');
                return;
            }

            const id = `${name}-${size}`.replace(/\s+/g, '-');
            const cart = getCart();
            const existing = cart.find(item => item.id === id);

            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ id, name, price: parseFloat(price), image, brand: 'Fashion', qty });
            }

            saveCart(cart);
            updateCartBadge();
            showCartToast(`"${name}" (${size}) added to cart!`);
        });
    }

    // Image switcher on sproduct.html (loop instead of 4 hardcoded handlers)
    const smallImgs = document.querySelectorAll('.small-img');
    const mainImg = document.getElementById('MainImg');
    if (mainImg && smallImgs.length) {
        smallImgs.forEach(img => {
            img.addEventListener('click', () => {
                mainImg.src = img.src;
                smallImgs.forEach(si => si.classList.remove('small-img--active'));
                img.classList.add('small-img--active');
            });
        });
    }
});
