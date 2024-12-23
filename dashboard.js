// Load data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    loadOrders();
    loadProducts();
    loadCustomers();
    loadSettings();
});

// Load Dashboard Overview Data
function loadDashboardData() {
    // في الواقع، هذه البيانات ستأتي من الخادم
    const dashboardData = {
        totalSales: 15000,
        totalOrders: 150,
        totalCustomers: 75,
        totalProducts: 45,
        recentOrders: [
            {
                id: '1001',
                customer: 'أحمد محمد',
                amount: 250,
                date: '2023-12-13',
                status: 'completed'
            },
            {
                id: '1002',
                customer: 'سارة أحمد',
                amount: 180,
                date: '2023-12-12',
                status: 'pending'
            },
            // يمكن إضافة المزيد من الطلبات هنا
        ]
    };

    // تحديث إحصائيات لوحة التحكم
    document.getElementById('totalSales').textContent = dashboardData.totalSales + ' ريال';
    document.getElementById('totalOrders').textContent = dashboardData.totalOrders;
    document.getElementById('totalCustomers').textContent = dashboardData.totalCustomers;
    document.getElementById('totalProducts').textContent = dashboardData.totalProducts;

    // تحديث جدول آخر الطلبات
    const recentOrdersList = document.getElementById('recentOrdersList');
    recentOrdersList.innerHTML = '';

    dashboardData.recentOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.amount} ريال</td>
            <td>${formatDate(order.date)}</td>
            <td><span class="badge status-${order.status}">${getStatusText(order.status)}</span></td>
        `;
        recentOrdersList.appendChild(row);
    });
}

// Load Orders Data
function loadOrders() {
    // في الواقع، هذه البيانات ستأتي من الخادم
    const orders = [
        {
            id: '1001',
            customer: 'أحمد محمد',
            products: ['طماطم', 'خيار', 'بطاطس'],
            amount: 250,
            date: '2023-12-13',
            status: 'completed'
        },
        // يمكن إضافة المزيد من الطلبات هنا
    ];

    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.products.join(', ')}</td>
            <td>${order.amount} ريال</td>
            <td>${formatDate(order.date)}</td>
            <td><span class="badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <div class="btn-group action-buttons">
                    <button class="btn btn-sm btn-info" onclick="viewOrder('${order.id}')">عرض</button>
                    <button class="btn btn-sm btn-success" onclick="updateOrderStatus('${order.id}')">تحديث</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}')">حذف</button>
                </div>
            </td>
        `;
        ordersList.appendChild(row);
    });
}

// Load Products Data
function loadProducts() {
    // في الواقع، هذه البيانات ستأتي من الخادم
    const products = [
        {
            image: 'images/vegetables/tomatoes.jpg',
            name: 'طماطم',
            category: 'خضروات',
            price: 5,
            unit: 'كيلو'
        },
        // يمكن إضافة المزيد من المنتجات هنا
    ];

    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price} ريال</td>
            <td>${product.unit}</td>
            <td>
                <div class="btn-group action-buttons">
                    <button class="btn btn-sm btn-info" onclick="editProduct('${product.name}')">تعديل</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.name}')">حذف</button>
                </div>
            </td>
        `;
        productsList.appendChild(row);
    });
}

// Load Customers Data
function loadCustomers() {
    // في الواقع، هذه البيانات ستأتي من الخادم
    const customers = [
        {
            name: 'أحمد محمد',
            email: 'ahmed@example.com',
            phone: '0501234567',
            orders: 5,
            totalSpent: 1200
        },
        // يمكن إضافة المزيد من العملاء هنا
    ];

    const customersList = document.getElementById('customersList');
    customersList.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td>${customer.totalSpent} ريال</td>
            <td>
                <div class="btn-group action-buttons">
                    <button class="btn btn-sm btn-info" onclick="viewCustomer('${customer.email}')">عرض</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer.email}')">حذف</button>
                </div>
            </td>
        `;
        customersList.appendChild(row);
    });
}

// Load Settings
function loadSettings() {
    // في الواقع، هذه البيانات ستأتي من الخادم
    const settings = {
        storeName: 'متجر الخضار والفواكه',
        email: 'store@example.com',
        phone: '0501234567',
        address: 'الرياض، السعودية'
    };

    document.getElementById('storeName').value = settings.storeName;
    document.getElementById('storeEmail').value = settings.email;
    document.getElementById('storePhone').value = settings.phone;
    document.getElementById('storeAddress').value = settings.address;
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

// Event Handlers
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // في الواقع، سيتم إرسال البيانات إلى الخادم
    alert('تم حفظ الإعدادات بنجاح');
});

document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // في الواقع، سيتم إرسال البيانات إلى الخادم
    alert('تمت إضافة المنتج بنجاح');
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
});

// Action Functions
function viewOrder(orderId) {
    // تنفيذ عرض تفاصيل الطلب
    alert(`عرض تفاصيل الطلب رقم ${orderId}`);
}

function updateOrderStatus(orderId) {
    // تنفيذ تحديث حالة الطلب
    alert(`تحديث حالة الطلب رقم ${orderId}`);
}

function deleteOrder(orderId) {
    // تنفيذ حذف الطلب
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        alert(`تم حذف الطلب رقم ${orderId}`);
    }
}

function editProduct(productName) {
    // تنفيذ تعديل المنتج
    alert(`تعديل المنتج: ${productName}`);
}

function deleteProduct(productName) {
    // تنفيذ حذف المنتج
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        alert(`تم حذف المنتج: ${productName}`);
    }
}

function viewCustomer(email) {
    // تنفيذ عرض تفاصيل العميل
    alert(`عرض تفاصيل العميل: ${email}`);
}

function deleteCustomer(email) {
    // تنفيذ حذف العميل
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        alert(`تم حذف العميل: ${email}`);
    }
}
