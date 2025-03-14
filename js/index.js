// 商品数据
const products = [
    { id: 1, name: '地图定制服务', price1: 5, price2: 15, image: '../image/dtdzfw.png' },
    { id: 2, name: '玩法定制服务', price1: 5, price2: 15, image: '../image/wfdzfw.png' },
    { id: 3, name: '载具定制服务', price1: 5, price2: 15, image: '../image/zjdzfw.png' },
];

// 系统状态
let cart = [];
let isCartOpen = false;
let searchKeyword = '';

// 初始化
function init() {
    renderProducts(filterProducts());
    setupEventListeners();
}

// 事件监听
function setupEventListeners() {
    // 搜索功能
    document.getElementById('searchInput').addEventListener('input', function (e) {
        searchKeyword = e.target.value.toLowerCase().trim();
        renderProducts(filterProducts());
    });

    // 购物车交互
    document.getElementById('cartButton').addEventListener('click', toggleCart);
    document.addEventListener('keydown', e => e.key === 'Escape' && closeCart());

    // 结算功能
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
}

// 支付方式切换
function switchPayment(type) {
    document.querySelectorAll('.payment-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    document.querySelectorAll('.qrcode-content').forEach(content => {
        content.classList.toggle('active', content.dataset.type === type);
    });
}

// 支付功能
function handleCheckout() {
    const total1 = cart.reduce((sum, item) => sum + item.price1 * item.quantity, 0);
    const total2 = cart.reduce((sum, item) => sum + item.price2 * item.quantity, 0);

    if (total1 <= 0 || total2 <= 0) {
        showToast('请先添加需要支付的商品');
        return;
    }

    document.getElementById('paymentModal').style.display = 'block';
    switchPayment('alipay'); // 默认显示支付宝

    document.getElementById('payDeposit').textContent = total1;
    document.getElementById('payFinal').textContent = total2;
}

function closePayment() {
    document.getElementById('paymentModal').style.display = 'none';
    showToast('支付已取消');
}

// 购物车操作
function toggleCart() {
    isCartOpen = !isCartOpen;
    document.getElementById('cartSidebar').classList.toggle('cart-open', isCartOpen);
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
}

function closeCart() {
    isCartOpen = false;
    document.getElementById('cartSidebar').classList.remove('cart-open');
    document.body.style.overflow = '';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 });
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateCartDisplay() {
    document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.quantity, 0);

    document.getElementById('cartItems').innerHTML = cart.map(item => `
        <div class="card mb-2">
            <div class="card-body d-flex justify-content-between align-items-center p-2">
                <div>
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">x${item.quantity}</small>
                </div>
                <div class="text-end">
                    <div class="text-primary small">定金：￥${item.price1 * item.quantity}</div>
                    <div class="text-success small">尾款：￥${item.price2 * item.quantity}</div>
                    <button class="btn btn-sm btn-danger mt-1" 
                            onclick="removeFromCart(${item.id})">删除</button>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('cartTotal1').textContent =
        cart.reduce((sum, item) => sum + item.price1 * item.quantity, 0);
    document.getElementById('cartTotal2').textContent =
        cart.reduce((sum, item) => sum + item.price2 * item.quantity, 0);
}

// 商品展示
function filterProducts() {
    return products.filter(p =>
        p.name.toLowerCase().includes(searchKeyword)
    );
}

function renderProducts(filteredProducts) {
    const container = document.getElementById('productList');
    const noResults = document.getElementById('noResults');

    container.innerHTML = filteredProducts.map(p => `
        <div class="col-12 col-sm-6 col-lg-4 mb-3">
            <div class="card product-card h-100">
                <img src="${p.image}" class="card-img-top product-img">
                <div class="card-body">
                    <h5 class="card-title">${p.name}</h5>
                    <div class="d-flex justify-content-between align-items-end">
                        <div>
                            <div class="text-primary">定金：￥${p.price1}</div>
                            <div class="text-success">尾款：￥${p.price2}</div>
                        </div>
                        <button class="btn btn-primary" 
                                onclick="addToCart(${p.id})">
                            加入购物车
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    noResults.style.display = filteredProducts.length ? 'none' : 'block';
}

// 修复后的 showToast 函数
function showToast(msg) {
    // 移除已存在的 toast
    document.querySelectorAll('.toast').forEach(toast => toast.remove());

    // 创建新 toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;

    // 添加动画结束处理
    toast.addEventListener('animationend', () => {
        setTimeout(() => {
            toast.style.animation = 'toastHide 0.3s ease-out forwards';
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        }, 1500);
    }, { once: true });

    // 插入到页面并触发动画
    document.body.appendChild(toast);
    
    // 强制触发重绘
    void toast.offsetWidth;
    toast.style.animation = 'toastSlide 0.3s ease-out forwards';
}

function kfid(){
    window.open("https://work.weixin.qq.com/kfid/kfc06d83bbddb5104d0")
}

// 启动
init();