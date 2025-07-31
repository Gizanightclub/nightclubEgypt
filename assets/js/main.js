// Global Variables
let selectedPackage = '';
let selectedPrice = 0;
let galleryIndex = 0;

// Gallery Configuration
const galleryImages = [
    "images/نايت كلوب العجزه3.jpg",
    "images/515937717_122140568642643264_8812620047065069950_n.jpg",
    "images/496297633_122132908394643264_7862667949279596569_n.jpg",
    "images/نايت كلوب العجزه2.jpg",
    "images/نايت كلوب القاهره.jpg",
    "images/518971388_122141706854643264_31228572094353642_n.jpg",
    "images/نايت كلوب العجزه.jpg",

];

// Gallery Functions
function initializeGallery() {
    const galleryImg = document.getElementById('gallery-image');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    
    // Show specific image
    function showGalleryImage(idx) {
        if (galleryImg) {
            galleryImg.style.opacity = '0.3';
            
            setTimeout(() => {
                galleryImg.src = galleryImages[idx];
                galleryImg.style.opacity = '1';
                
                // Update dots
                galleryDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === idx);
                });
            }, 300);
        }
    }
    
    // Add click listeners to dots
    galleryDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            galleryIndex = i;
            showGalleryImage(galleryIndex);
        });
    });
    
    // Auto-slide gallery
    function autoSlideGallery() {
        galleryIndex = (galleryIndex + 1) % galleryImages.length;
        showGalleryImage(galleryIndex);
    }
    
    // Start auto-slide
    setInterval(autoSlideGallery, 3500);
    
    // Show first image
    showGalleryImage(0);
}

// Booking Form Functions
function showBookingForm(packageType, price) {
    selectedPackage = packageType;
    selectedPrice = price;
    
    // Generate unique discount code
    const discountCode = generateDiscountCode();
    
    // Hide packages and show form
    const packagesSection = document.getElementById('packages-section');
    const bookingForm = document.getElementById('booking-form');
    
    if (packagesSection) packagesSection.style.display = 'none';
    if (bookingForm) bookingForm.classList.add('active');
    
    // Update booking summary
    const packageName = packageType === 'first' ? 'الصف الأول VIP' : 'الصف الثاني';
    const bookingSummary = document.getElementById('booking-summary');
    
    if (bookingSummary) {
        bookingSummary.innerHTML = `
            ${packageName} - ${price} جنيه للفرد<br>
            <span style="color: #ffd93d; font-size: 1.1rem;">🎁 كود الخصم الخاص بك: <strong>${discountCode}</strong></span>
        `;
    }
    
    // Store discount code
    window.currentDiscountCode = discountCode;
    
    // Set minimum date to today
    const bookingDate = document.getElementById('booking-date');
    if (bookingDate) {
        const today = new Date().toISOString().split('T')[0];
        bookingDate.setAttribute('min', today);
    }
    
    // Scroll to form
    bookingForm.scrollIntoView({ behavior: 'smooth' });
}

function hideBookingForm() {
    const packagesSection = document.getElementById('packages-section');
    const bookingForm = document.getElementById('booking-form');
    
    if (packagesSection) packagesSection.style.display = 'block';
    if (bookingForm) bookingForm.classList.remove('active');
    
    // Scroll to packages
    packagesSection.scrollIntoView({ behavior: 'smooth' });
}

function generateDiscountCode() {
    const prefixes = ['VIP', 'NIGHT', 'CLUB', 'PARTY', 'ELITE', 'GOLD'];
    const numbers = Math.floor(Math.random() * 9000) + 1000;
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix}${numbers}`;
}

// Form Validation
function validateForm() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const guestCount = document.getElementById('guest-count').value;
    const bookingDate = document.getElementById('booking-date').value;
    
    if (!name) {
        alert('يرجى إدخال الاسم الكامل');
        document.getElementById('customer-name').focus();
        return false;
    }
    
    if (!phone) {
        alert('يرجى إدخال رقم الهاتف');
        document.getElementById('customer-phone').focus();
        return false;
    }
    
    // Validate phone number (Egyptian format)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        alert('يرجى إدخال رقم هاتف صحيح (مثال: 01123456789)');
        document.getElementById('customer-phone').focus();
        return false;
    }
    
    if (!guestCount) {
        alert('يرجى اختيار عدد الأشخاص');
        document.getElementById('guest-count').focus();
        return false;
    }
    
    if (!bookingDate) {
        alert('يرجى اختيار تاريخ الحجز');
        document.getElementById('booking-date').focus();
        return false;
    }
    
    // Check if date is not in the past
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('لا يمكن اختيار تاريخ في الماضي');
        document.getElementById('booking-date').focus();
        return false;
    }
    
    return true;
}

function confirmBooking() {
    if (!validateForm()) {
        return;
    }
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const guestCount = document.getElementById('guest-count').value;
    const bookingDate = document.getElementById('booking-date').value;
    const notes = document.getElementById('special-notes').value.trim();

    // Format the date
    const dateObj = new Date(bookingDate);
    const formattedDate = dateObj.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get booking number for the day
    const bookingKey = 'bookingNumber-' + bookingDate;
    let bookingNumber = parseInt(localStorage.getItem(bookingKey) || '0', 10) + 1;
    localStorage.setItem(bookingKey, bookingNumber);

    const packageName = selectedPackage === 'first' ? 'الصف الأول VIP' : 'الصف الثاني';
    const totalPrice = selectedPrice * parseInt(guestCount);

    // Build WhatsApp message
    let message = `🔢 *حجز عميل رقم ::* ${bookingNumber}\n\n`;
    message += `👤 *الاسم:* ${name}\n`;
    message += `📱 *رقم الهاتف:* ${phone}\n`;
    message += `🎫 *نوع التذكرة:* ${packageName}\n`;
    message += `👥 *عدد الأشخاص:* ${guestCount}\n`;
    message += `💰 *السعر للفرد:* ${selectedPrice} جنيه\n`;
    message += `💳 *إجمالي المبلغ:* ${totalPrice} جنيه\n`;
    message += `🎁 *كود الخصم:* ${window.currentDiscountCode}\n`;
    message += `📅 *تاريخ الحجز:* ${formattedDate}\n\n`;  

    if (notes) {
        message += `\n📝 *ملاحظات خاصة:* ${notes}\n`;
    }
    message += `\n✅ يرجى تأكيد الحجز `;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/201286110562?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Animation Functions
function addPackageAnimations() {
    const packages = document.querySelectorAll('.package');
    
    packages.forEach((pkg, index) => {
        pkg.style.animationDelay = `${index * 0.3}s`;
    });
}

// Performance Optimizations
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" if not already present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            // You could set a fallback image here
        });
    });
}

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeGallery();
    addPackageAnimations();
    optimizeImages();
    
    // Add smooth scrolling to all internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Preload critical images
    const criticalImages = [
        galleryImages[0],
        'https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    console.log('Night Club website initialized successfully!');
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Expose global functions for HTML onclick events
window.showBookingForm = showBookingForm;
window.hideBookingForm = hideBookingForm;
window.confirmBooking = confirmBooking;