// ========================================
// TOKO KELONTONG 46 - SCRIPT LENGKAP
// ========================================

// Data produk lengkap
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'Beras Pandan Wangi 5kg', desc: 'Beras premium kualitas super', price: 85000, image: '🍚' },
    { id: 2, name: 'Beras IR 64 5kg', desc: 'Beras medium kualitas bagus', price: 65000, image: '🍚' },
    { id: 3, name: 'Minyak Fortuna 1L', desc: 'Minyak goreng premium', price: 19500, image: '🛢️' },
    { id: 4, name: 'Minyak Bimoli 1L', desc: 'Minyak goreng spesial', price: 20500, image: '🛢️' },
    { id: 5, name: 'Gula Pasir 1kg', desc: 'Gula pasir murni kristal', price: 15500, image: '🍬' },
    { id: 6, name: 'Telur Ayam 1kg (15 butir)', desc: 'Telur ayam kampung segar', price: 32000, image: '🥚' },
    { id: 7, name: 'Tepung Terigu 1kg', desc: 'Tepung protein tinggi', price: 12500, image: '🌾' },
    { id: 8, name: 'Indomie Goreng 1 dus (40 pcs)', desc: 'Rasa ayam spesial', price: 72000, image: '🍜' },
    { id: 9, name: 'Kopi Kapal Api 170gr', desc: 'Kopi robusta premium', price: 22000, image: '☕' },
    { id: 10, name: 'Sabun Lifebuoy 90gr (6 pcs)', desc: 'Anti bakteri lengkap', price: 21000, image: '🧼' },
    { id: 11, name: 'Deterjen Attack 800gr', desc: 'Deterjen bubuk wangi', price: 18500, image: '🧺' },
    { id: 12, name: 'Cabai Merah Segar', desc: 'Cabai merah segar hari ini', price: null, image: '🌶️' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const ADMIN_PASSWORD = 'admin123';
const WA_NUMBER = '6285155132160'; // ❌ GANTI INI DENGAN NOMOR ANDA!

// === INIT APP ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Toko Kelontong 46 Loaded!');
    
    renderProducts();
    updateCartCount();
    updateWhatsAppLinks();
    
    // Event Listeners
    document.getElementById('cartLink').addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });
    
    document.getElementById('adminBtn').addEventListener('click', openAdminModal);
    
    // Modal closes
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Form listeners
    document.getElementById('adminLoginBtn').addEventListener('click', handleAdminLogin);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    document.getElementById('continueShopping').addEventListener('click', closeAllModals);
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
});

// === PRODUCT FUNCTIONS ===
function renderProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            ${product.price ? 
                `<div class="product-price">Rp ${formatRupiah(product.price)}</div>` : 
                `<div class="no-price-text">💬 Tanya Harga</div>`
            }
            <button class="add-to-cart ${!product.price ? 'no-price' : ''}" 
                    onclick="addToCart(${product.id})">
                ${product.price ? '🛒 Keranjang' : '💬 Chat WA'}
            </button>
        `;
        container.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} ✓`, 'success');
}

function formatRupiah(angka) {
    return angka.toLocaleString('id-ID');
}

// === CART FUNCTIONS ===
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cartCount');
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
}

function openCartModal() {
    renderCart();
    document.getElementById('cartModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:3rem;color:#666">
                <i class="fas fa-shopping-cart" style="font-size:5rem;color:#ddd;margin-bottom:1rem"></i>
                <h3>Keranjang Kosong</h3>
                <p>Tambahkan produk dari daftar!</p>
            </div>
        `;
        totalEl.textContent = 'Rp 0';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const subtotal = item.price ? item.price * item.quantity : 0;
        total += subtotal;
        return `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.desc}</p>
                </div>
                ${item.price ? `
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(${item.id},-1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${item.id},1)">+</button>
                    </div>
                    <div class="cart-item-price">Rp ${formatRupiah(subtotal)}</div>
                ` : `
                    <div class="cart-item-price" style="color:#666">Tanya harga</div>
                `}
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    totalEl.textContent = `Rp ${formatRupiah(total)}`;
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
    showToast('Item dihapus', 'info');
}

// === ADMIN FUNCTIONS ===
function openAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function handleAdminLogin() {
    const password = document.getElementById('adminPass').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminPassword').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        renderAdminProducts();
        showToast('✅ Admin Login OK!', 'success');
    } else {
        showToast('❌ Password Salah!', 'error');
        document.getElementById('adminPass').value = '';
        document.getElementById('adminPass').focus();
    }
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const desc = document.getElementById('productDesc').value;
    const priceInput = document.getElementById('productPrice').value;
    const imageFile = document.getElementById('productImage').files[0];
    
    const price = priceInput ? parseInt(priceInput) : null;
    const newId = Date.now();
    const newProduct = {
        id: newId,
        name,
        desc,
        price,
        image: imageFile ? '📷' : '🛒'
    };
    
    products.unshift(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    renderProducts();
    renderAdminProducts();
    e.target.reset();
    showToast('✅ Produk baru ditambah!', 'success');
}

function renderAdminProducts() {
    const container = document.getElementById('productsListAdmin');
    document.getElementById('productsCount').textContent = products.length;
    
    container.innerHTML = products.map(product => `
        <div class="admin-product">
            <div>
                <strong>${product.name}</strong><br>
                <small>${product.desc} ${product.price ? `• Rp ${formatRupiah(product.price)}` : '• Tanya harga'}</small>
            </div>
            <button onclick="deleteProduct(${product.id})" class="btn-delete">
                🗑️ Hapus
            </button>
        </div>
    `).join('');
}

function deleteProduct(id) {
    if (confirm('Hapus produk ini?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        renderAdminProducts();
        showToast('✅ Produk dihapus!', 'success');
    }
}

// === CHECKOUT ===
function handleCheckout() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    
    if (!name || !phone) {
        showToast('❌ Nama & No. HP wajib diisi!', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showToast('❌ Keranjang kosong!', 'error');
        return;
    }
    
    // Buat pesan WA
    let message = `🛒 *PESANAN BARU - TOKO KELONTONG 46*\n\n`;
    message += `👤 Nama: ${name}\n`;
    message += `📱 WA: ${phone}\n`;
    message += `📍 Alamat: ${address || 'Ambil langsung'}\n\n`;
    message += `📋 *PESANAN:*\n`;
    
    let total = 0;
    cart.forEach((item, i) => {
        if (item.price) {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            message += `${i+1}. ${item.name} (${item.quantity}x) = Rp${formatRupiah(subtotal)}\n`;
        } else {
            message += `${i+1}. ${item.name} (${item.quantity}x) *Tanya harga*\n`;
        }
    });
    
    message += `\n💰 *TOTAL: Rp${formatRupiah(total)}*`;
    message += `\n\n⏰ ${new Date().toLocaleString('id-ID')}`;
    
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Kirim WA & reset
    window.open(waUrl, '_blank');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Reset form
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    
    closeAllModals();
    document.getElementById('successModal').style.display = 'block';
}

function updateWhatsAppLinks() {
    document.getElementById('whatsappFloat').href = `https://wa.me/${WA_NUMBER}`;
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
