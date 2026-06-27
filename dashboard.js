/* ================================================
   FASHION E-COMMERCE | DASHBOARD JAVASCRIPT
   ================================================ */

// ---- DATA ----
const ORDERS = [
    { id: '#ORD-0023', product: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', img: 'IMAGE/products/f1.jpg', date: 'Jun 20, 2026', amount: '$78.00', status: 'delivered' },
    { id: '#ORD-0022', product: 'Classic Hoodie', brand: 'Adidas', img: 'IMAGE/products/f2.jpg', date: 'Jun 18, 2026', amount: '$118.19', status: 'transit' },
    { id: '#ORD-0021', product: 'Summer Floral Dress', brand: 'Cara', img: 'IMAGE/products/n1.jpg', date: 'Jun 15, 2026', amount: '$95.00', status: 'processing' },
    { id: '#ORD-0020', product: 'Streetwear Jacket', brand: 'Nike', img: 'IMAGE/products/n2.jpg', date: 'Jun 10, 2026', amount: '$210.00', status: 'delivered' },
    { id: '#ORD-0019', product: 'Casual Linen Shirt', brand: 'H&M', img: 'IMAGE/products/f3.jpg', date: 'May 28, 2026', amount: '$45.00', status: 'delivered' },
    { id: '#ORD-0018', product: 'Denim Joggers', brand: 'Levi\'s', img: 'IMAGE/products/f4.jpg', date: 'May 20, 2026', amount: '$89.00', status: 'cancelled' },
    { id: '#ORD-0017', product: 'Boho Maxi Skirt', brand: 'Cara', img: 'IMAGE/products/n3.jpg', date: 'May 10, 2026', amount: '$62.00', status: 'delivered' },
];

const WISHLIST = [
    { id: 1, product: 'Vintage Denim Jacket', brand: 'Levi\'s', img: 'IMAGE/products/f5.jpg', price: '$145.00' },
    { id: 2, product: 'Knit Cardigan', brand: 'Zara', img: 'IMAGE/products/f6.jpg', price: '$88.00' },
    { id: 3, product: 'Printed Summer Blouse', brand: 'Cara', img: 'IMAGE/products/n4.jpg', price: '$55.00' },
    { id: 4, product: 'Slim Chino Pants', brand: 'H&M', img: 'IMAGE/products/n5.jpg', price: '$70.00' },
    { id: 5, product: 'Silk Evening Top', brand: 'Cara', img: 'IMAGE/products/n6.jpg', price: '$92.00' },
];

const NOTIFICATIONS = [
    { icon: 'fa-check', iconClass: 'green', msg: 'Your order <strong>#ORD-0023</strong> has been delivered successfully!', time: '2 hours ago', unread: true },
    { icon: 'fa-truck', iconClass: 'orange', msg: 'Order <strong>#ORD-0022</strong> is out for delivery. Expected today.', time: 'Yesterday', unread: true },
    { icon: 'fa-tag', iconClass: 'teal', msg: 'Flash Sale is live! Up to <strong>70% off</strong> on summer collection.', time: '2 days ago', unread: false },
    { icon: 'fa-heart', iconClass: 'green', msg: 'Item from your wishlist is back in stock!', time: '3 days ago', unread: false },
    { icon: 'fa-gift', iconClass: 'teal', msg: 'You\'ve earned a <strong>loyalty reward</strong> of 50 points!', time: '1 week ago', unread: false },
];

// ---- USER DATA ----
let userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 555 0123',
    dob: '',
    gender: 'Prefer not to say',
};

// Load from localStorage if available
function loadUserData() {
    const stored = JSON.parse(localStorage.getItem('keyDetails') || '[]');
    if (stored.length > 0) {
        const user = stored[stored.length - 1];
        userData.firstName = user.f_name || 'John';
        userData.lastName = user.l_name || 'Doe';
        userData.email = user.email || 'john.doe@example.com';
    }
}

function getInitials() {
    return (userData.firstName[0] + (userData.lastName[0] || '')).toUpperCase();
}

function getFullName() { return `${userData.firstName} ${userData.lastName}`; }

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initUserDisplay();
    initNavigation();
    initSidebar();
    initTopbar();
    initOrders();
    initWishlist();
    initNotifications();
    initProfile();
    initSettings();
    initModals();
    initGlobalSearch();
});

// ---- USER DISPLAY ----
function initUserDisplay() {
    const initials = getInitials();
    const fullName = getFullName();

    document.getElementById('sidebarAvatar').querySelector('#avatarInitials').textContent = initials;
    document.getElementById('sidebarUserName').textContent = fullName;
    document.getElementById('sidebarUserEmail').textContent = userData.email;
    document.getElementById('topbarAvatar').textContent = initials;
    document.getElementById('topbarUserName').textContent = userData.firstName + ' ' + (userData.lastName[0] || '') + '.';
    document.getElementById('welcomeName').textContent = userData.firstName;
    document.getElementById('profileAvatarLarge').textContent = initials;
    document.getElementById('profileFullName').textContent = fullName;
    document.getElementById('profileEmailDisplay').textContent = userData.email;

    // Prefill profile form
    document.getElementById('editFirstName').value = userData.firstName;
    document.getElementById('editLastName').value = userData.lastName;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editPhone').value = userData.phone;
}

// ---- NAVIGATION ----
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.dashboard-section');
    const breadcrumb = document.getElementById('breadcrumbSection');

    function navigateTo(sectionId) {
        sections.forEach(s => s.classList.remove('active'));
        navLinks.forEach(l => l.classList.remove('active'));

        const targetSection = document.getElementById('section-' + sectionId);
        const targetNav = document.getElementById('nav-' + sectionId);

        if (targetSection) targetSection.classList.add('active');
        if (targetNav) targetNav.classList.add('active');
        if (breadcrumb) breadcrumb.textContent = formatSectionName(sectionId);

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navigateTo(link.dataset.section);
        });
    });

    // Section links inside cards (quick actions, "View all", etc.)
    document.addEventListener('click', e => {
        const link = e.target.closest('[data-section]');
        if (link && !link.classList.contains('nav-link')) {
            e.preventDefault();
            navigateTo(link.dataset.section);
        }
    });
}

function formatSectionName(id) {
    const map = {
        overview: 'Overview', orders: 'My Orders', wishlist: 'Wishlist',
        addresses: 'Addresses', payments: 'Payment Methods',
        notifications: 'Notifications', profile: 'Edit Profile', settings: 'Settings'
    };
    return map[id] || id;
}

// ---- SIDEBAR ----
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('overlay');

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    });

    sidebarClose.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('keyDetails');
        showToast('Logged out successfully!');
        setTimeout(() => { window.location.href = 'Login.html'; }, 1500);
    });
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
}

// ---- TOPBAR ----
function initTopbar() {
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const markAllRead = document.getElementById('markAllRead');

    notifBtn.addEventListener('click', e => {
        e.stopPropagation();
        notifDropdown.classList.toggle('open');
    });

    document.addEventListener('click', e => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
            notifDropdown.classList.remove('open');
        }
    });

    markAllRead.addEventListener('click', () => {
        document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
        document.querySelectorAll('.icon-badge.pulse').forEach(b => b.textContent = '0');
        document.getElementById('notifBadge').style.display = 'none';
        showToast('All notifications marked as read.');
    });

    // Notification footer link
    document.querySelector('.notif-footer').addEventListener('click', e => {
        e.preventDefault();
        notifDropdown.classList.remove('open');
    });
}

// ---- ORDERS ----
function initOrders() {
    renderOrders(ORDERS);

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const filtered = filter === 'all' ? ORDERS : ORDERS.filter(o => o.status === filter);
            renderOrders(filtered);
        });
    });

    // Search
    document.getElementById('orderSearch').addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        const filtered = ORDERS.filter(o =>
            o.product.toLowerCase().includes(q) ||
            o.id.toLowerCase().includes(q) ||
            o.brand.toLowerCase().includes(q)
        );
        renderOrders(filtered);
    });
}

function renderOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-light);">
            <i class="fa-solid fa-box-open" style="font-size:40px;margin-bottom:12px;display:block;opacity:0.3;"></i>
            No orders found.
        </td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map((o, i) => `
        <tr>
            <td><strong>${o.id}</strong></td>
            <td>
                <div class="order-product-cell">
                    <img src="${o.img}" alt="${o.product}" onerror="this.src='https://via.placeholder.com/44x44/088178/fff?text=F'">
                    <div>
                        <strong>${o.product}</strong>
                        <span>${o.brand}</span>
                    </div>
                </div>
            </td>
            <td>${o.date}</td>
            <td><strong>${o.amount}</strong></td>
            <td><span class="order-status ${o.status}">${statusLabel(o.status)}</span></td>
            <td><button class="btn-view" onclick="openOrderModal(${i})">View</button></td>
        </tr>
    `).join('');
}

function statusLabel(s) {
    const map = { delivered: 'Delivered', transit: 'In Transit', processing: 'Processing', cancelled: 'Cancelled' };
    return map[s] || s;
}

// ---- ORDER MODAL ----
window.openOrderModal = function(index) {
    const o = ORDERS[index];
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('orderModalContent');

    const steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
    const stepIndex = { processing: 1, transit: 2, delivered: 3, cancelled: 0 };
    const current = stepIndex[o.status] ?? 0;

    const stepsHTML = steps.map((step, i) => {
        let cls = i <= current ? 'done' : (i === current + 1 ? 'active' : 'pending');
        if (o.status === 'cancelled') cls = i === 0 ? 'done' : 'pending';
        const lineClass = i < current ? 'done' : '';
        return `
            ${i > 0 ? `<div class="step-line ${lineClass}"></div>` : ''}
            <div class="step">
                <div class="step-dot ${cls}">
                    <i class="fa-solid ${i <= current && o.status !== 'cancelled' ? 'fa-check' : (i === 0 ? 'fa-check' : 'fa-circle')}"></i>
                </div>
                <label>${step}</label>
            </div>
        `;
    }).join('');

    content.innerHTML = `
        <div class="order-detail-header">
            <div>
                <strong>Order ID:</strong> ${o.id}<br>
                <small style="color:var(--text-light);">Placed on ${o.date}</small>
            </div>
            <span class="order-status ${o.status}">${statusLabel(o.status)}</span>
        </div>
        <div class="order-detail-steps">${stepsHTML}</div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
            <img src="${o.img}" onerror="this.src='https://via.placeholder.com/64x64/088178/fff?text=F'" 
                 style="width:64px;height:64px;border-radius:10px;object-fit:cover;">
            <div>
                <strong>${o.product}</strong><br>
                <span style="color:var(--text-light);font-size:13px;">Brand: ${o.brand}</span>
            </div>
        </div>
        <table class="order-detail-table">
            <tr><td>Subtotal</td><td>${o.amount}</td></tr>
            <tr><td>Shipping</td><td>Free</td></tr>
            <tr><td>Tax (5%)</td><td>$${(parseFloat(o.amount.replace('$','')) * 0.05).toFixed(2)}</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>$${(parseFloat(o.amount.replace('$','')) * 1.05).toFixed(2)}</strong></td></tr>
        </table>
        ${o.status !== 'cancelled' && o.status !== 'delivered' ? 
            `<button class="btn-submit" style="margin-top:16px;" onclick="showToast('Order tracking updated!')">
                <i class="fa-solid fa-truck"></i> Track Package
            </button>` : ''}
    `;

    modal.classList.add('open');
};

// ---- WISHLIST ----
function initWishlist() {
    renderWishlist(WISHLIST);
}

function renderWishlist(items) {
    const grid = document.getElementById('wishlistGrid');
    if (items.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-light);">
            <i class="fa-solid fa-heart" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.2;"></i>
            <h4 style="color:var(--text-mid)">Your wishlist is empty</h4>
            <a href="shop.html" class="btn-submit" style="display:inline-block;width:auto;padding:12px 28px;margin-top:16px;">Start Shopping</a>
        </div>`;
        return;
    }

    grid.innerHTML = items.map((item, i) => `
        <div class="wishlist-card" data-wish-id="${item.id}">
            <div class="wishlist-remove-overlay" onclick="removeWishlistItem(${i})" title="Remove from wishlist">
                <i class="fa-solid fa-times"></i>
            </div>
            <div class="wishlist-card-img">
                <img src="${item.img}" alt="${item.product}" 
                     onerror="this.src='https://via.placeholder.com/220x180/088178/fff?text=Fashion'">
            </div>
            <div class="wishlist-card-body">
                <span>${item.brand}</span>
                <h5>${item.product}</h5>
                <span class="price">${item.price}</span>
            </div>
            <div class="wishlist-card-footer">
                <button class="btn-add-cart" onclick="addToCart(${i})">
                    <i class="fa-solid fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn-remove-wish" onclick="removeWishlistItem(${i})" title="Remove">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

window.removeWishlistItem = function(index) {
    WISHLIST.splice(index, 1);
    renderWishlist(WISHLIST);
    updateWishlistBadge();
    showToast('Item removed from wishlist.');
};

window.addToCart = function(index) {
    showToast(`"${WISHLIST[index].product}" added to cart!`);
};

function updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    badge.textContent = WISHLIST.length;
    document.getElementById('wishlistStat').textContent = WISHLIST.length;
}

// ---- NOTIFICATIONS ----
function initNotifications() {
    const list = document.getElementById('notifFullList');
    list.innerHTML = NOTIFICATIONS.map(n => `
        <div class="notif-item ${n.unread ? 'unread' : ''}">
            <div class="notif-icon ${n.iconClass}"><i class="fa-solid ${n.icon}"></i></div>
            <div style="flex:1;">
                <p>${n.msg}</p>
                <span>${n.time}</span>
            </div>
            ${n.unread ? `<span style="width:8px;height:8px;border-radius:50%;background:var(--primary);flex-shrink:0;margin-top:6px;"></span>` : ''}
        </div>
    `).join('');

    // Update badge
    const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
    if (unreadCount === 0) {
        document.getElementById('notifBadge').style.display = 'none';
    } else {
        document.getElementById('notifBadge').textContent = unreadCount;
    }
}

// ---- PROFILE ----
function initProfile() {
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', e => {
        e.preventDefault();
        userData.firstName = document.getElementById('editFirstName').value.trim() || userData.firstName;
        userData.lastName = document.getElementById('editLastName').value.trim() || userData.lastName;
        userData.email = document.getElementById('editEmail').value.trim() || userData.email;
        userData.phone = document.getElementById('editPhone').value.trim() || userData.phone;

        // Update display
        initUserDisplay();
        showToast('Profile updated successfully!');
    });

    // Password toggles
    document.querySelectorAll('.toggle-eye').forEach(eye => {
        eye.addEventListener('click', () => {
            const targetId = eye.dataset.target;
            const input = document.getElementById(targetId);
            if (input.type === 'password') {
                input.type = 'text';
                eye.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                eye.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Avatar change
    document.getElementById('avatarChangeBtn').addEventListener('click', () => {
        showToast('Avatar upload coming soon!');
    });
}

// ---- SETTINGS ----
function initSettings() {
    // Toggle switches
    document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', () => {
            const label = toggle.closest('.settings-row').querySelector('h6').textContent;
            const state = toggle.checked ? 'enabled' : 'disabled';
            showToast(`"${label}" ${state}.`);
        });
    });

    // Delete account
    document.getElementById('deleteAccountBtn').addEventListener('click', () => {
        document.getElementById('deleteModal').classList.add('open');
    });

    document.getElementById('cancelDelete').addEventListener('click', () => {
        document.getElementById('deleteModal').classList.remove('open');
    });

    document.getElementById('confirmDelete').addEventListener('click', () => {
        localStorage.removeItem('keyDetails');
        showToast('Account deleted. Redirecting...');
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    });
}

// ---- MODALS ----
function initModals() {
    // Order modal close
    document.getElementById('closeOrderModal').addEventListener('click', () => {
        document.getElementById('orderModal').classList.remove('open');
    });

    // Address modal
    document.getElementById('addAddressBtn').addEventListener('click', () => {
        document.getElementById('addressModal').classList.add('open');
    });

    document.getElementById('closeAddressModal').addEventListener('click', () => {
        document.getElementById('addressModal').classList.remove('open');
    });

    document.getElementById('addressForm').addEventListener('submit', e => {
        e.preventDefault();
        document.getElementById('addressModal').classList.remove('open');
        showToast('Address saved successfully!');
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                overlay.classList.remove('open');
            }
        });
    });

    // Address card actions
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => showToast('Edit address coming soon!'));
    });

    document.querySelectorAll('.address-card .btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this address?')) showToast('Address deleted!');
        });
    });

    document.querySelectorAll('.address-card .btn-default').forEach(btn => {
        btn.addEventListener('click', () => showToast('Default address updated!'));
    });

    // Payment add
    document.getElementById('addPaymentBtn').addEventListener('click', () => {
        showToast('Payment method setup coming soon!');
    });

    // Payment actions
    document.querySelectorAll('.payment-card .btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Remove this card?')) showToast('Card removed!');
        });
    });

    document.querySelectorAll('.payment-card .btn-default').forEach(btn => {
        btn.addEventListener('click', () => showToast('Default card updated!'));
    });

    // Delete modal close on overlay
    document.getElementById('deleteModal').addEventListener('click', e => {
        if (e.target === document.getElementById('deleteModal')) {
            document.getElementById('deleteModal').classList.remove('open');
        }
    });

    // Promo code copy
    const promoCode = document.querySelector('.promo-code');
    if (promoCode) {
        promoCode.addEventListener('click', () => {
            navigator.clipboard.writeText('MEMBER20').catch(() => {});
            showToast('Promo code "MEMBER20" copied!');
        });
    }
}

// ---- GLOBAL SEARCH ----
function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const q = e.target.value.trim();
            if (q) {
                showToast(`Searching for "${q}"...`);
                searchInput.value = '';
            }
        }
    });
}

// ---- TOAST ----
window.showToast = function(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
};

// ---- STATS ANIMATION (count-up) ----
function animateCountUp() {
    const counters = document.querySelectorAll('.stat-info h3');
    counters.forEach(counter => {
        const target = parseFloat(counter.textContent.replace(/[$,]/g, ''));
        if (isNaN(target)) return;
        const prefix = counter.textContent.includes('$') ? '$' : '';
        const duration = 1200;
        const stepTime = 20;
        const steps = duration / stepTime;
        let current = 0;
        const inc = target / steps;

        const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toLocaleString('en-US', { maximumFractionDigits: 0 }));
        }, stepTime);
    });
}

// Run count-up on page load
setTimeout(animateCountUp, 200);

// ---- KEYBOARD SHORTCUT: Escape closes modals ----
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
        document.getElementById('notifDropdown').classList.remove('open');
    }
});
