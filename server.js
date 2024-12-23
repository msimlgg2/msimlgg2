require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Test email configuration
async function testEmailConfig() {
    try {
        console.log('Testing email configuration...');
        console.log('Email User:', process.env.EMAIL_USER);
        
        await transporter.verify();
        console.log('Email configuration is valid');
        
        // Send test email
        const testMailOptions = {
            from: `"متجر الخضار والفواكه" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'اختبار إعدادات البريد الإلكتروني',
            text: 'هذا بريد اختباري للتحقق من صحة الإعدادات'
        };
        
        const info = await transporter.sendMail(testMailOptions);
        console.log('Test email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Email configuration test failed:', {
            name: error.name,
            message: error.message,
            code: error.code
        });
        throw error;
    }
}

// Call test function on startup
testEmailConfig().catch(console.error);

// Verify email configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready');
    }
});

// Helper function to format order details for email
function formatOrderDetails(order) {
    // تنسيق معلومات الموقع
    const locationSection = order.location ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin: 5px 0;">معلومات الموقع:</h3>
            <p style="margin: 5px 0;">خط العرض: ${order.location.latitude}</p>
            <p style="margin: 5px 0;">خط الطول: ${order.location.longitude}</p>
            <p style="margin: 5px 0;">
                <a href="https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}" 
                   target="_blank" 
                   style="color: #007bff; text-decoration: none;">
                    فتح الموقع في خرائط Google ↗
                </a>
            </p>
        </div>
    ` : '<p>لم يتم تحديد الموقع</p>';

    return `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #28a745;">طلب جديد #${order.id}</h2>
            <p style="color: #666;">تاريخ الطلب: ${new Date().toLocaleString('ar-SA')}</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h3 style="margin: 5px 0;">معلومات العميل:</h3>
                <p style="margin: 5px 0;">الاسم: ${order.customer.firstName} ${order.customer.lastName}</p>
                <p style="margin: 5px 0;">الجوال: ${order.customer.phone}</p>
                <p style="margin: 5px 0;">البريد الإلكتروني: ${order.customer.email}</p>
                <p style="margin: 5px 0;">المدينة: ${order.address.city}</p>
                <p style="margin: 5px 0;">الحي: ${order.address.district}</p>
                <p style="margin: 5px 0;">العنوان التفصيلي: ${order.address.address}</p>
                ${order.address.notes ? `<p style="margin: 5px 0;">ملاحظات: ${order.address.notes}</p>` : ''}
            </div>

            ${locationSection}
            
            <h3>تفاصيل المنتجات:</h3>
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
                    ${order.items.map(item => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.price} ريال</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.price * item.quantity} ريال</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: left; padding: 10px; border: 1px solid #ddd;">المجموع الفرعي:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${order.subtotal} ريال</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: left; padding: 10px; border: 1px solid #ddd;">رسوم التوصيل:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${order.deliveryFee} ريال</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: left; padding: 10px; border: 1px solid #ddd;"><strong>المجموع الكلي:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${order.total} ريال</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
                تم إرسال هذا البريد تلقائياً من نظام متجر الخضار والفواكه
            </p>
        </div>
    `;
}

// Save order to file
async function saveOrder(order) {
    const ordersFile = path.join(__dirname, 'orders.json');
    try {
        let orders = [];
        try {
            const data = await fs.readFile(ordersFile, 'utf8');
            orders = JSON.parse(data);
        } catch (err) {
            // File doesn't exist or is empty, start with empty array
        }
        
        order.id = Date.now().toString();
        order.status = 'pending';
        order.orderDate = new Date();
        
        orders.push(order);
        await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
        return order;
    } catch (err) {
        console.error('Error saving order:', err);
        throw err;
    }
}

// Send email endpoint
app.post('/send-email', async (req, res) => {
    console.log('Received email request:', {
        to: req.body.to,
        subject: req.body.subject,
        hasHtml: !!req.body.html
    });
    
    try {
        const { to, subject, html } = req.body;

        if (!to || !subject || !html) {
            console.error('Missing required fields:', { to, subject, hasHtml: !!html });
            return res.status(400).json({
                success: false,
                message: 'البيانات المطلوبة غير مكتملة'
            });
        }

        const mailOptions = {
            from: `"متجر الخضار والفواكه" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            headers: {
                'Content-Type': 'text/html; charset=UTF-8'
            }
        };

        console.log('Sending email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            response: info.response
        });

        res.json({
            success: true,
            message: 'تم إرسال البريد الإلكتروني بنجاح',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Email sending error:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        res.status(500).json({
            success: false,
            message: 'فشل في إرسال البريد الإلكتروني',
            error: error.message
        });
    }
});

// API Endpoints
app.post('/api/orders', async (req, res) => {
    try {
        console.log('Received order:', req.body);
        
        // حفظ الطلب
        const order = await saveOrder(req.body);
        console.log('Order saved:', order);

        // إرسال بريد إلكتروني للمتجر
        const storeMailOptions = {
            from: `"متجر الخضار والفواكه" <${process.env.EMAIL_USER}>`,
            to: process.env.STORE_EMAIL,
            subject: `طلب جديد #${order.id}`,
            html: formatOrderDetails(order)
        };

        console.log('Sending email to store...');
        await transporter.sendMail(storeMailOptions);
        console.log('Store email sent successfully');

        // إرسال بريد إلكتروني للعميل
        const customerMailOptions = {
            from: `"متجر الخضار والفواكه" <${process.env.EMAIL_USER}>`,
            to: order.customer.email,
            subject: 'تأكيد طلبك - متجر الخضار والفواكه',
            html: formatOrderDetails(order)
        };

        console.log('Sending email to customer...');
        await transporter.sendMail(customerMailOptions);
        console.log('Customer email sent successfully');

        res.json({
            success: true,
            message: 'تم استلام طلبك بنجاح',
            orderId: order.id
        });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في معالجة الطلب',
            error: error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
