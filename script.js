// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.getElementById('cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Add to cart functionality
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const product = {
            name: card.querySelector('.card-title').textContent,
            price: parseFloat(card.querySelector('.price').textContent.split(' ')[0]), // Extract number from "5 ريال/كجم"
            quantity: 1
        };

        // Check if product already exists in cart
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }

        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display
        updateCartDisplay();
        showNotification('تمت إضافة المنتج إلى السلة');
    });
});

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal content
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartTotal) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItemsContainer.innerHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="card-title">${item.name}</h6>
                            <p class="card-text">${item.price} ريال × ${item.quantity}</p>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-success me-2" onclick="changeQuantity(${index}, 1)">+</button>
                            <button class="btn btn-sm btn-danger me-2" onclick="changeQuantity(${index}, -1)">-</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">حذف</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    cartTotal.textContent = total.toFixed(2);
}

// Change item quantity
function changeQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
    notification.style.zIndex = '1000';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Redirect to cart page when clicking cart button
document.querySelector('.btn-outline-success').addEventListener('click', () => {
    window.location.href = 'cart.html';
});

// Initialize cart count
updateCartCount();

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Handle checkout button
document.getElementById('proceed-to-checkout')?.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('السلة فارغة');
        return;
    }
    
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (cartModal && checkoutModal) {
        const cartBootstrapModal = bootstrap.Modal.getInstance(cartModal);
        const checkoutBootstrapModal = new bootstrap.Modal(checkoutModal);
        
        cartBootstrapModal.hide();
        checkoutBootstrapModal.show();
    }
});

// Handle checkout form submission
document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            email: formData.get('email')
        },
        address: {
            city: formData.get('city'),
            district: formData.get('district'),
            street: formData.get('street'),
            details: formData.get('addressDetails')
        },
        items: cart,
        total: parseFloat(document.getElementById('cart-total').textContent)
    };

    // Here you would typically send this data to your backend
    console.log('Order submitted:', orderData);
    
    // Clear cart and show success message
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        const modal = bootstrap.Modal.getInstance(checkoutModal);
        modal.hide();
    }
    
    showNotification('تم تأكيد طلبك بنجاح');
    e.target.reset();
});

// Initialize all tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
