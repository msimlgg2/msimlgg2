// Load products when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAllProducts();
    setupEventListeners();
    updateCartBadge();
});

// Setup all event listeners
function setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // استخدام this بدلاً من e.target لضمان الحصول على الزر نفسه
            const category = this.dataset.category;
            filterProductsByCategory(category);
            
            // تحديث حالة الأزرار النشطة
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            searchProducts(searchInput.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchInput.value);
            }
        });
    }

    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            addToCart(name, price);
        }
    });
}

// Load all products
function loadAllProducts() {
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('Products container not found!');
        return;
    }

    container.innerHTML = '';
    
    // Loop through all categories
    Object.keys(products).forEach(category => {
        products[category].forEach(product => {
            container.appendChild(createProductCard(product));
        });
    });
}

// Filter products by category
function filterProductsByCategory(category) {
    console.log('Filtering by category:', category); // للتشخيص
    
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('Products container not found!');
        return;
    }

    container.innerHTML = '';

    if (category === 'all') {
        loadAllProducts();
        return;
    }

    if (!products || !products[category]) {
        console.error(`Category ${category} not found in products:`, products);
        return;
    }

    const categoryProducts = products[category];
    categoryProducts.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });

    // عرض رسالة للمستخدم
    showToast(`تم عرض منتجات ${getCategoryName(category)}`);
}

// Helper function to get category name in Arabic
function getCategoryName(category) {
    const categoryNames = {
        'vegetables': 'الخضروات',
        'fruits': 'الفواكه',
        'leafy': 'الورقيات',
        'spices': 'التوابل',
        'all': 'جميع المنتجات'
    };
    return categoryNames[category] || category;
}

// Search products
function searchProducts(query) {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';

    if (!query) {
        loadAllProducts();
        return;
    }

    query = query.toLowerCase();
    
    Object.values(products).flat().forEach(product => {
        if (product.name.toLowerCase().includes(query)) {
            container.appendChild(createProductCard(product));
        }
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';
    card.innerHTML = `
        <div class="card h-100">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.price} ريال / ${product.unit}</p>
                <button class="btn btn-success add-to-cart w-100" 
                    data-name="${product.name}" 
                    data-price="${product.price}">
                    أضف إلى السلة
                </button>
            </div>
        </div>
    `;
    return card;
}

// Add to cart function
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`تم إضافة ${name} إلى السلة`);
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

// Show toast message
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">تم بنجاح</strong>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
