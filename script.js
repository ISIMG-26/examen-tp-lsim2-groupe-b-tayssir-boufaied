/* =====================================================
   AutoLuxe — Main JavaScript
   ===================================================== */

// ── TOAST NOTIFICATIONS ──────────────────────────────
function showToast(message, type = 'success') {
    const container = document.getElementById('toasts');
    if (!container) return;
    const icon = type === 'success' ? '✅' : '❌';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
}

// ── FORMAT PRICE ─────────────────────────────────────
function formatPrice(price) {
    return Number(price).toLocaleString('fr-TN') + ' DT';
}

// ── TITLE CASE ────────────────────────────────────────
function titleCase(str) {
    return (str || '').replace(/\w\S*/g, txt =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

// ── SMART CAR IMAGE ───────────────────────────────────
// Picks a relevant Unsplash photo based on keywords in the car title
const CAR_IMAGES = [
    { keys: ['golf','volkswagen','vw'],  url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80' },
    { keys: ['bmw','serie','m3','m4','m5'], url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80' },
    { keys: ['mercedes','benz','amg','classe','c200','e200'], url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80' },
    { keys: ['peugeot','308','208','508'],  url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80' },
    { keys: ['renault','clio','megane','duster'], url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80' },
    { keys: ['toyota','yaris','corolla','hilux'], url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80' },
    { keys: ['audi','a3','a4','a5','a6','q5','q7'], url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80' },
    { keys: ['honda','civic','accord','crv'],      url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80' },
    { keys: ['hyundai','kia','tucson','sportage'], url: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&q=80' },
    { keys: ['ford','focus','mustang','ranger'],   url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&q=80' },
    { keys: ['fiat','punto','500','tipo'],         url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80' },
    { keys: ['seat','leon','ibiza','ateca'],       url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80' },
];

const FALLBACK_IMGS = [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=80',
    'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=600&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
    'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&q=80',
];

function getCarImage(car) {
    // If DB has a valid image URL, use it
    if (car.image && car.image.trim().startsWith('http')) return car.image;

    // Match by title keywords
    const title = (car.title || '').toLowerCase();
    for (const entry of CAR_IMAGES) {
        if (entry.keys.some(k => title.includes(k))) return entry.url;
    }

    // Deterministic fallback based on ID so each card looks different
    return FALLBACK_IMGS[car.id % FALLBACK_IMGS.length];
}

// ── BUILD CAR CARD HTML ──────────────────────────────
function buildCard(car) {
    const imgSrc = getCarImage(car);
    const displayTitle = titleCase(car.title);

    return `
        <div class="card" data-id="${car.id}">
            <div class="card-img-wrap">
                <img src="${imgSrc}" alt="${displayTitle}" loading="lazy"
                     onerror="this.src='${FALLBACK_IMGS[0]}'">
                <span class="card-badge">For Sale</span>
                <button class="btn-delete" onclick="deleteCar(${car.id}, event)" title="Delete listing">🗑</button>
            </div>
            <div class="card-body">
                <h3>${displayTitle}</h3>
                <div class="card-footer">
                    <div class="card-price">${formatPrice(car.price)}<span>TND</span></div>
                    <a href="#" class="btn-card">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// ── DEMO FALLBACK CARS ────────────────────────────────
const DEMO_CARS = [
    { id: 1, title: "Volkswagen Golf 7", price: 42000, image: "" },
    { id: 2, title: "Peugeot 308 Allure", price: 35500, image: "" },
    { id: 3, title: "Mercedes C200", price: 98000, image: "" },
    { id: 4, title: "Renault Clio 5", price: 28000, image: "" },
    { id: 5, title: "BMW M4 Sport", price: 115000, image: "" },
    { id: 6, title: "Toyota Yaris Cross", price: 52000, image: "" },
];

// ── LOAD CARS ─────────────────────────────────────────
let allCars = [];

function loadCars() {
    const container = document.getElementById('car-list');
    if (!container) return;

    fetch('fetch_cars.php')
        .then(res => { if (!res.ok) throw new Error(); return res.json(); })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) throw new Error('empty');
            allCars = data;
            renderCars(data);
            const s = document.getElementById('stat-count'); if (s) s.textContent = data.length + '+';
            const c = document.getElementById('car-count'); if (c) c.textContent = data.length;
        })
        .catch(() => {
            allCars = DEMO_CARS;
            renderCars(DEMO_CARS);
            const s = document.getElementById('stat-count'); if (s) s.textContent = DEMO_CARS.length + '+';
            const c = document.getElementById('car-count'); if (c) c.textContent = DEMO_CARS.length;
            const notice = document.createElement('p');
            notice.style.cssText = 'text-align:center;color:var(--text-dim);font-size:0.78rem;margin-top:24px;letter-spacing:0.04em;';
            notice.textContent = '⚡ Showing demo listings — connect your database to see live data';
            container.after(notice);
        });
}

function renderCars(cars) {
    const container = document.getElementById('car-list');
    if (!container) return;
    const carCount = document.getElementById('car-count');
    if (!cars.length) {
        container.innerHTML = `<div class="empty-state"><div style="font-size:3rem;margin-bottom:16px">🚗</div><h3>No cars found</h3><p style="font-size:0.85rem;margin-top:6px">Try a different search term.</p></div>`;
        if (carCount) carCount.textContent = 0;
        return;
    }
    container.innerHTML = cars.map(buildCard).join('');
    if (carCount) carCount.textContent = cars.length;
}

// ── SEARCH / FILTER ───────────────────────────────────
function initSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
        const val = searchInput.value.toLowerCase().trim();
        if (!val) { renderCars(allCars); return; }
        renderCars(allCars.filter(car => (car.title || '').toLowerCase().includes(val)));
    });
}

// ── ADD CAR FORM ──────────────────────────────────────
function initAddCarForm() {
    const form = document.getElementById('carForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const alertBox = document.getElementById('alert-msg');
        btn.disabled = true;
        btn.textContent = 'Publishing…';
        if (alertBox) alertBox.innerHTML = '';

        fetch('insert_car.php', { method: 'POST', body: new FormData(form) })
        .then(res => { if (!res.ok) throw new Error(); return res.json(); })
        .then(data => {
            if (data.error) throw new Error(data.error);
            showToast('🎉 Car listed successfully!', 'success');
            form.reset();
            const preview = document.getElementById('imagePreview');
            if (preview) preview.innerHTML = `<div class="image-placeholder"><div style="font-size:2rem;margin-bottom:8px">🖼️</div><div>Image preview will appear here</div></div>`;
        })
        .catch(() => {
            showToast('Failed to add listing. Please try again.', 'error');
            if (alertBox) alertBox.innerHTML = '<div class="alert alert-error">⚠️ Something went wrong. Please try again.</div>';
        })
        .finally(() => { btn.disabled = false; btn.textContent = '🚀 Publish Listing'; });
    });
}

// ── DELETE CAR ────────────────────────────────────────
function deleteCar(id, event) {
    event.stopPropagation();
    if (!confirm('Remove this listing?')) return;
    fetch(`delete_car.php?id=${encodeURIComponent(id)}`)
        .then(res => { if (!res.ok) throw new Error(); allCars = allCars.filter(c => c.id != id); renderCars(allCars); showToast('Listing removed.', 'success'); })
        .catch(() => showToast('Could not delete. Try again.', 'error'));
}

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => { loadCars(); initSearch(); initAddCarForm(); });
