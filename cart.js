// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const DELIVERY_FEE = 15;

// Location handling
let userLocation = null;

function getLocation() {
    const locationStatus = document.getElementById('location-status');
    const locationInput = document.getElementById('location');
    
    locationStatus.textContent = 'جاري تحديد موقعك...';
    
    if (!navigator.geolocation) {
        locationStatus.textContent = 'خاصية تحديد الموقع غير مدعومة في متصفحك';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            locationInput.value = `${userLocation.latitude}, ${userLocation.longitude}`;
            locationStatus.textContent = 'تم تحديد موقعك بنجاح';
            locationStatus.className = 'form-text text-success';
        },
        (error) => {
            console.error('Error getting location:', error);
            locationStatus.textContent = 'حدث خطأ في تحديد الموقع. يرجى المحاولة مرة أخرى';
            locationStatus.className = 'form-text text-danger';
        }
    );
}

// Display cart items
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5>السلة فارغة</h5>
                <a href="index.html" class="btn btn-success mt-3">العودة للتسوق</a>
            </div>
        `;
        subtotalElement.textContent = '0 ريال';
        totalElement.textContent = '0 ريال';
        return;
    }

    let subtotal = 0;
    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        cartContainer.innerHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text text-muted">${item.price} ريال / كجم</p>
                        </div>
                        <div class="col-md-4">
                            <div class="d-flex align-items-center justify-content-end">
                                <button class="btn btn-sm btn-outline-success me-2" onclick="updateQuantity(${index}, -1)">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-success me-2" onclick="updateQuantity(${index}, 1)">+</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <div class="text-end mt-2">
                                <strong>${itemTotal} ريال</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // Update totals
    subtotalElement.textContent = subtotal + ' ريال';
    totalElement.textContent = (subtotal + DELIVERY_FEE) + ' ريال';
}

// Update item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeItem(index);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Remove item from cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Show checkout form
document.getElementById('proceed-checkout').addEventListener('click', function() {
    if (cart.length === 0) {
        showNotification('السلة فارغة', 'danger');
        return;
    }
    document.getElementById('checkout-section').style.display = 'block';
    this.disabled = true;
    window.scrollTo({ top: document.getElementById('checkout-section').offsetTop, behavior: 'smooth' });
});

// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // تعطيل زر التقديم لمنع الإرسال المتكرر
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(this);
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
                address: formData.get('address'),
                notes: formData.get('notes')
            },
            payment: formData.get('payment'),
            items: cart,
            subtotal: parseFloat(document.getElementById('subtotal').textContent),
            deliveryFee: DELIVERY_FEE,
            total: parseFloat(document.getElementById('total').textContent),
            location: userLocation
        };

        console.log('Submitting order with data:', orderData);

        // إرسال الطلب إلى الخادم
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        console.log('Order API Response Status:', response.status);
        const result = await response.json();
        console.log('Order API Response:', result);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${result.message || 'Unknown error'}`);
        }

        if (result.success) {
            // مسح السلة وعرض رسالة نجاح
            localStorage.removeItem('cart');
            cart = [];
            
            try {
                // إرسال بريد إلكتروني للتأكيد
                await sendConfirmationEmail({
                    customerName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                    phone: orderData.customer.phone,
                    email: orderData.customer.email,
                    address: `${orderData.address.city}, ${orderData.address.district}, ${orderData.address.address}`,
                    location: orderData.location,
                    items: orderData.items,
                    subtotal: orderData.subtotal,
                    deliveryFee: orderData.deliveryFee,
                    total: orderData.total,
                    notes: orderData.address.notes
                });
                showNotification('تم تأكيد طلبك بنجاح! تم إرسال بريد إلكتروني بتفاصيل الطلب', 'success');
            } catch (emailError) {
                console.error('Detailed email error:', emailError);
                showNotification('تم تأكيد الطلب ولكن حدث خطأ في إرسال البريد الإلكتروني. سنقوم بإرسال التفاصيل لاحقاً', 'warning');
            }

            // إعادة التوجيه إلى الصفحة الرئيسية بعد ثانيتين
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            throw new Error(result.error || 'حدث خطأ في معالجة الطلب');
        }
    } catch (error) {
        console.error('Detailed error in form submission:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        showNotification(error.message || 'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى', 'danger');
        submitButton.disabled = false;
    }
});

// Send confirmation email
async function sendConfirmationEmail(orderData) {
    try {
        console.log('Preparing to send confirmation email...');
        console.log('Order data:', JSON.stringify(orderData, null, 2));
        
        // التحقق من صحة البيانات قبل الإرسال
        if (!orderData.email) {
            throw new Error('البريد الإلكتروني مطلوب');
        }

        const emailContent = generateEmailContent(orderData);
        console.log('Generated email content length:', emailContent.length);

        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                to: orderData.email,
                subject: 'تأكيد طلبك - متجر الخضار والفواكه',
                html: emailContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error response:', errorData);
            throw new Error(`خطأ في الخادم: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('Email API Response:', result);

        if (!result.success) {
            throw new Error(result.message || 'فشل في إرسال البريد الإلكتروني');
        }

        return result;
    } catch (error) {
        console.error('Error in sendConfirmationEmail:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// Generate email content
function generateEmailContent(orderData) {
    try {
        const items = orderData.items.map(item => `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.price} ريال</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.price * item.quantity} ريال</td>
            </tr>
        `).join('');

        // تنسيق معلومات الموقع
        let locationInfo = '';
        if (orderData.location && orderData.location.latitude && orderData.location.longitude) {
            locationInfo = `
                <div style="margin: 15px 0;">
                    <h4 style="margin: 5px 0;">معلومات الموقع:</h4>
                    <p style="margin: 5px 0;">خط العرض: ${orderData.location.latitude}</p>
                    <p style="margin: 5px 0;">خط الطول: ${orderData.location.longitude}</p>
                    <p style="margin: 5px 0;">
                        <a href="https://www.google.com/maps?q=${orderData.location.latitude},${orderData.location.longitude}" 
                           target="_blank" 
                           style="color: #007bff; text-decoration: none;">
                            عرض الموقع على خرائط Google
                        </a>
                    </p>
                </div>
            `;
        }

        return `
            <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>طلب جديد من متجر الخضار والفواكه</h2>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h3 style="margin: 5px 0;">معلومات العميل:</h3>
                    <p style="margin: 5px 0;">الاسم: ${orderData.customerName}</p>
                    <p style="margin: 5px 0;">رقم الهاتف: ${orderData.phone}</p>
                    <p style="margin: 5px 0;">البريد الإلكتروني: ${orderData.email}</p>
                    <p style="margin: 5px 0;">العنوان: ${orderData.address}</p>
                    ${locationInfo}
                    ${orderData.notes ? `<p style="margin: 5px 0;">ملاحظات: ${orderData.notes}</p>` : ''}
                </div>

                <h3>تفاصيل الطلب:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 10px; border: 1px solid #ddd;">المنتج</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">الكمية</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">السعر</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="text-align: left; padding: 10px; border: 1px solid #ddd;">المجموع الفرعي:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${orderData.subtotal} ريال</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="text-align: left; padding: 10px; border: 1px solid #ddd;">رسوم التوصيل:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${orderData.deliveryFee} ريال</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="text-align: left; padding: 10px; border: 1px solid #ddd;"><strong>المجموع الكلي:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${orderData.total} ريال</strong></td>
                        </tr>
                    </tfoot>
                </table>

                <hr style="border: 1px solid #eee; margin: 20px 0;">
                
                <p style="color: #666; font-size: 12px;">
                    تم إرسال هذا البريد تلقائياً من نظام متجر الخضار والفواكه
                </p>
            </div>
        `;
    } catch (error) {
        console.error('Error generating email content:', error);
        throw new Error('فشل في إنشاء محتوى البريد الإلكتروني');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '1000';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize cart display
displayCart();
