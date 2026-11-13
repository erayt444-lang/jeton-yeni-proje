let currentUser = JSON.parse(localStorage.getItem('token_user')) || null;
let favorites = JSON.parse(localStorage.getItem('token_favs')) || [];
let recentSearches = JSON.parse(localStorage.getItem('token_recent_searches')) || [];
let recentViews = JSON.parse(localStorage.getItem('token_recent_views')) || [];

let activeCategory = 'all';
let activeSubCategory = 'all';
let selectedCityFilter = '';
let visibleCount = 12;

const subCategoryMap = {
  elektronik: ['Telefon', 'Bilgisayar', 'Tablet', 'Konsol & Oyun', 'Kulaklık'],
  mobilya: ['Masa & Sandalye', 'Koltuk Takımı', 'Kitaplık & Raf'],
  giyim: ['Ceket & Mont', 'Ayakkabı', 'Takım Elbise'],
  spor: ['Bisiklet', 'Fitness Aletleri', 'Ağırlık Seti']
};

const cities = ['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'];

const sellers = ['Ahmet Y.', 'Mehmet K.', 'Zeynep T.', 'Caner B.', 'Selin K.', 'Oğuz M.', 'Burak A.', 'Ece D.'];

const itemTemplates = [
  { cat: 'elektronik', sub: 'Telefon', title: 'iPhone 13 Pro Max', price: 34000, spec: '256 GB / %89 Pil', img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80' },
  { cat: 'elektronik', sub: 'Telefon', title: 'Samsung Galaxy S23 Ultra', price: 38000, spec: '512 GB / 12 GB RAM', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80' },
  { cat: 'elektronik', sub: 'Bilgisayar', title: 'MacBook Air M2 16GB', price: 32500, spec: '512 GB SSD', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { cat: 'elektronik', sub: 'Tablet', title: 'iPad Pro 11 inç M1', price: 24000, spec: '128 GB WiFi', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80' },
  { cat: 'elektronik', sub: 'Konsol & Oyun', title: 'PlayStation 5 Slim 1TB', price: 21000, spec: '1 TB / 2 Kol', img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80' },
  { cat: 'elektronik', sub: 'Kulaklık', title: 'Sony WH-1000XM4 Kulaklık', price: 7200, spec: 'Kablosuz / ANC', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { cat: 'mobilya', sub: 'Masa & Sandalye', title: 'İskandinav Çalışma Masası', price: 2400, spec: 'Ahşap / Demonte', img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
  { cat: 'mobilya', sub: 'Koltuk Takımı', title: 'Modern L Koltuk Takımı', price: 14500, spec: 'Gri / Tay Tüyü Kumaş', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { cat: 'mobilya', sub: 'Kitaplık & Raf', title: 'Kitaplık Açık Raf Sistemli', price: 1800, spec: 'Metal / Ceviz Kasa', img: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80' },
  { cat: 'giyim', sub: 'Ceket & Mont', title: 'Hakiki Deri Ceket Siyah', price: 1200, spec: 'L Beden / Kuzu Derisi', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
  { cat: 'giyim', sub: 'Ayakkabı', title: 'Nike Air Force 1 07', price: 2800, spec: '42 Beden / Beyaz', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' },
  { cat: 'spor', sub: 'Bisiklet', title: 'Salcano 29 Jant Dağ Bisikleti', price: 5800, spec: '29 Jant / Hidrolik Disk', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { cat: 'spor', sub: 'Fitness Aletleri', title: 'Voit Koşu Bandı Katlanır', price: 9200, spec: 'Otomatik Eğimli', img: 'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=800&q=80' }
];

let products = [];
let idCounter = 1;

for (let i = 0; i < 100; i++) {
  const template = itemTemplates[i % itemTemplates.length];
  const statusType = (i % 3 === 0) ? 'Sıfır' : 'İkinci El';
  const badgeType = (i % 7 === 0) ? 'acil' : (i % 5 === 0 ? 'vitrin' : 'normal');

  products.push({
    id: idCounter++,
    title: `${template.title}`,
    category: template.cat,
    subCategory: template.sub,
    price: Math.floor(template.price * (0.85 + Math.random() * 0.3)),
    status: statusType,
    badge: badgeType,
    city: cities[i % cities.length],
    seller: sellers[i % sellers.length],
    verified: i % 2 === 0,
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    image: template.img,
    spec: template.spec,
    desc: `${template.title} son derece temiz durumdadır sorunsuz çalışır,güvenle alabilirsiniz.`
  });
}

const grid = document.getElementById('productsGrid');
const userContainer = document.getElementById('userContainer');

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebarElement');
  sidebar.classList.toggle('mobile-open');
}

function openAuthModal() {
  document.getElementById('authModal').classList.add('open');
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
  }
}

document.getElementById('loginForm').onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUser').value.trim();
  currentUser = { name: username, verified: true };
  localStorage.setItem('token_user', JSON.stringify(currentUser));
  updateAuthUI();
  closeAllModals();
};

document.getElementById('registerForm').onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  currentUser = { name: name, verified: true };
  localStorage.setItem('token_user', JSON.stringify(currentUser));
  updateAuthUI();
  closeAllModals();
};

function updateAuthUI() {
  if (currentUser) {
    userContainer.innerHTML = `
      <div class="user-panel-btn" onclick="openProfileModal()">
        <span>👤 ${currentUser.name}</span>
        <span class="notif-dot"></span>
      </div>
    `;
  } else {
    userContainer.innerHTML = `
      <button class="btn-outline" onclick="openAuthModal()">Giriş Yap / Kayıt Ol</button>
    `;
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('token_user');
  updateAuthUI();
  closeAllModals();
  renderProducts();
}

function toggleFavorite(id, e) {
  e.stopPropagation();
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('token_favs', JSON.stringify(favorites));
  renderProducts();
}

function saveSearchQuery(query) {
  const trimmed = query.trim();
  if (!trimmed) return;
  recentSearches = recentSearches.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
  recentSearches.unshift(trimmed);
  if (recentSearches.length > 5) recentSearches.pop();
  localStorage.setItem('token_recent_searches', JSON.stringify(recentSearches));
  renderHistoryBars();
}

function removeRecentSearch(query, e) {
  e.stopPropagation();
  recentSearches = recentSearches.filter(q => q !== query);
  localStorage.setItem('token_recent_searches', JSON.stringify(recentSearches));
  renderHistoryBars();
}

function clearRecentSearches() {
  recentSearches = [];
  localStorage.removeItem('token_recent_searches');
  renderHistoryBars();
}

function applyRecentSearch(query) {
  document.getElementById('searchInput').value = query;
  renderProducts();
}

function saveRecentView(product) {
  recentViews = recentViews.filter(p => p.id !== product.id);
  recentViews.unshift({ id: product.id, title: product.title });
  if (recentViews.length > 5) recentViews.pop();
  localStorage.setItem('token_recent_views', JSON.stringify(recentViews));
  renderHistoryBars();
}

function removeRecentView(id, e) {
  e.stopPropagation();
  recentViews = recentViews.filter(p => p.id !== id);
  localStorage.setItem('token_recent_views', JSON.stringify(recentViews));
  renderHistoryBars();
}

function clearRecentViews() {
  recentViews = [];
  localStorage.removeItem('token_recent_views');
  renderHistoryBars();
}

function openRecentViewProduct(id) {
  const product = products.find(p => p.id === id);
  if (product) openDetailModal(product);
}

function renderHistoryBars() {
  const searchesContainer = document.getElementById('recentTagsContainer');
  searchesContainer.innerHTML = '';

  if (recentSearches.length > 0) {
    recentSearches.forEach(query => {
      const tag = document.createElement('div');
      tag.className = 'history-tag';
      tag.onclick = () => applyRecentSearch(query);
      tag.innerHTML = `
        <span>${query}</span>
        <span class="history-tag-remove" onclick="removeRecentSearch('${query}', event)">✕</span>
      `;
      searchesContainer.appendChild(tag);
    });
  } else {
    searchesContainer.innerHTML = '<span class="empty-history-text">Henüz arama yapmadınız.</span>';
  }

  const viewsContainer = document.getElementById('recentViewsContainer');
  viewsContainer.innerHTML = '';

  if (recentViews.length > 0) {
    recentViews.forEach(item => {
      const tag = document.createElement('div');
      tag.className = 'history-tag';
      tag.onclick = () => openRecentViewProduct(item.id);
      tag.innerHTML = `
        <span>📦 ${item.title}</span>
        <span class="history-tag-remove" onclick="removeRecentView(${item.id}, event)">✕</span>
      `;
      viewsContainer.appendChild(tag);
    });
  } else {
    viewsContainer.innerHTML = '<span class="empty-history-text">Henüz ilan incelemediniz.</span>';
  }
}

function updateDynamicFilters() {
  const group = document.getElementById('dynamicFilterGroup');
  const label = document.getElementById('dynamicFilterLabel');
  const select = document.getElementById('dynamicFilterSelect');

  if (activeCategory === 'elektronik') {
    group.style.display = 'block';
    label.textContent = 'Elektronik Kriteri';
    select.innerHTML = '<option value="all">Tümü</option><option value="256 GB">256 GB Hafıza</option><option value="512 GB">512 GB Hafıza</option><option value="Kablosuz">Kablosuz</option><option value="1 TB">1 TB Hafıza</option>';
  } else {
    group.style.display = 'none';
    select.value = 'all';
  }
}

function renderProducts() {
  const searchInput = document.getElementById('searchInput');
  const searchVal = searchInput.value.toLowerCase();

  if (searchVal.trim()) saveSearchQuery(searchInput.value);

  const selectedLoc = selectedCityFilter.toLowerCase().trim();

  const minPrice = Number(document.getElementById('minPrice').value) || 0;
  const maxPrice = Number(document.getElementById('maxPrice').value) || Infinity;
  const statusVal = document.getElementById('statusFilter').value;
  const dynamicVal = document.getElementById('dynamicFilterSelect').value;
  const sortVal = document.getElementById('sortFilter').value;

  document.getElementById('favCount').textContent = favorites.length;

  let filtered = products.filter(p => {
    let matchesCat = activeCategory === 'all' || p.category === activeCategory;
    if (activeCategory === 'favoriler') matchesCat = favorites.includes(p.id);

    let matchesSubCat = activeSubCategory === 'all' || p.subCategory === activeSubCategory;

    const matchesSearch = p.title.toLowerCase().includes(searchVal);
    const matchesLoc = !selectedLoc || p.city.toLowerCase() === selectedLoc;
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    const matchesStatus = statusVal === 'all' || p.status === statusVal;
    const matchesDynamic = dynamicVal === 'all' || (p.spec && p.spec.includes(dynamicVal));

    return matchesCat && matchesSubCat && matchesSearch && matchesLoc && matchesPrice && matchesStatus && matchesDynamic;
  });

  if (sortVal === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  if (sortVal === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if (sortVal === 'newest') filtered.sort((a,b) => b.id - a.id);

  let titleText = 'Tüm İlanlar';
  if (activeCategory !== 'all' && activeCategory !== 'favoriler') {
    titleText = activeCategory.toUpperCase();
    if (activeSubCategory !== 'all') titleText += ` > ${activeSubCategory}`;
  } else if (activeCategory === 'favoriler') {
    titleText = 'Favorilerim';
  }

  document.getElementById('resultCount').textContent = `${titleText} (${filtered.length})`;
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px; color:var(--muted);">Aradığınız kriterlere uygun ilan bulunamadı.</div>';
    document.getElementById('loadMoreWrapper').style.display = 'none';
    return;
  }

  const visibleItems = filtered.slice(0, visibleCount);

  visibleItems.forEach(p => {
    const isFav = favorites.includes(p.id);
    const badgeClass = p.status === 'Sıfır' ? 'badge-new' : 'badge-used';

    let extraBadgeHtml = '';
    if (p.badge === 'acil') extraBadgeHtml = '<span class="badge-custom badge-urgent">🔥 Acil</span>';
    if (p.badge === 'vitrin') extraBadgeHtml = '<span class="badge-custom badge-vitrin">⭐ Vitrin</span>';

    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openDetailModal(p);
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${p.image}" class="card-img" alt="${p.title}">
        <div class="card-badges">
          <span class="badge-custom ${badgeClass}">${p.status}</span>
          ${extraBadgeHtml}
        </div>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${p.id}, event)">
          ${isFav ? '♥' : '♡'}
        </button>
      </div>
      <div class="card-body">
        <div class="card-price">${p.price.toLocaleString('tr-TR')} TL</div>
        <div class="card-title">${p.title}</div>
        <div class="card-meta">
          <div class="seller-info">
            <span>👤 ${p.seller}</span>
            ${p.verified ? '<span class="verified-badge" title="Onaylı Satıcı">✓</span>' : ''}
          </div>
          <span>📍 ${p.city}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  const loadMoreBtnWrapper = document.getElementById('loadMoreWrapper');
  if (filtered.length > visibleCount) {
    loadMoreBtnWrapper.style.display = 'block';
  } else {
    loadMoreBtnWrapper.style.display = 'none';
  }
}

function loadMoreProducts() {
  visibleCount += 12;
  renderProducts();
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  selectedCityFilter = '';
  document.getElementById('sidebarLocationInput').value = '📍 Tüm Şehirler';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('statusFilter').value = 'all';
  document.getElementById('dynamicFilterSelect').value = 'all';
  document.getElementById('sortFilter').value = 'newest';
  activeCategory = 'all';
  activeSubCategory = 'all';
  visibleCount = 12;

  document.querySelectorAll('.sub-categories-list').forEach(ul => ul.classList.remove('open'));
  document.querySelectorAll('#categoryList a').forEach(el => el.classList.remove('active'));
  document.querySelector('#categoryList a[data-category="all"]').classList.add('active');

  updateDynamicFilters();
  renderProducts();
}

function openCityModal() {
  document.getElementById('cityModalSearchInput').value = '';
  populateCityList(cities);
  document.getElementById('cityModal').classList.add('open');
}

function populateCityList(cityArray) {
  const container = document.getElementById('cityModalListContainer');
  container.innerHTML = '';

  const allItem = document.createElement('div');
  allItem.style.cssText = 'padding: 12px 16px; border-radius: 12px; cursor: pointer; background: #f8fafc; font-weight: 600; color: #0f172a; display: flex; align-items: center; gap: 10px; transition: 0.2s; border: 1px solid var(--line);';
  allItem.innerHTML = '📍 <span>Tüm Şehirler</span>';
  allItem.onclick = () => {
    selectedCityFilter = '';
    document.getElementById('sidebarLocationInput').value = '📍 Tüm Şehirler';
    closeAllModals();
    renderProducts();
  };
  container.appendChild(allItem);

  cityArray.forEach(city => {
    const item = document.createElement('div');
    item.style.cssText = 'padding: 12px 16px; border-radius: 12px; cursor: pointer; background: #fff; font-weight: 500; color: var(--text); display: flex; align-items: center; gap: 10px; transition: 0.2s; border: 1px solid var(--line);';
    item.innerHTML = `📍 <span>${city}</span>`;
    item.onmouseover = () => item.style.background = '#fff7ed';
    item.onmouseout = () => item.style.background = '#fff';
    item.onclick = () => {
      selectedCityFilter = city;
      document.getElementById('sidebarLocationInput').value = `📍 ${city}`;
      closeAllModals();
      renderProducts();
    };
    container.appendChild(item);
  });
}

function filterCityModalList(query) {
  const val = query.toLowerCase().trim();
  const filtered = cities.filter(c => c.toLowerCase().includes(val));
  populateCityList(filtered);
}

document.querySelectorAll('#categoryList a').forEach(a => {
  a.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cat = a.dataset.category;
    const sub = a.dataset.subcategory || 'all';

    document.querySelectorAll('#categoryList a').forEach(el => el.classList.remove('active'));
    a.classList.add('active');

    activeCategory = cat;
    activeSubCategory = sub;
    visibleCount = 12;

    document.querySelectorAll('.sub-categories-list').forEach(ul => ul.classList.remove('open'));
    if (cat !== 'all' && cat !== 'favoriler') {
      const subUl = document.getElementById('sub-' + cat);
      if (subUl) subUl.classList.add('open');
    }

    updateDynamicFilters();
    renderProducts();
  };
});

document.getElementById('searchBtn').onclick = () => { visibleCount = 12; renderProducts(); };
document.getElementById('searchInput').onkeyup = (e) => { if(e.key==='Enter') { visibleCount = 12; renderProducts(); } };
document.getElementById('minPrice').onkeyup = () => { visibleCount = 12; renderProducts(); };
document.getElementById('maxPrice').onkeyup = () => { visibleCount = 12; renderProducts(); };
document.getElementById('statusFilter').onchange = () => { visibleCount = 12; renderProducts(); };
document.getElementById('dynamicFilterSelect').onchange = () => { visibleCount = 12; renderProducts(); };
document.getElementById('sortFilter').onchange = () => { visibleCount = 12; renderProducts(); };

function onAddCategoryChange() {
  const cat = document.getElementById('addCategory').value;
  const subSelect = document.getElementById('addSubCategory');
  subSelect.innerHTML = '';

  const subs = subCategoryMap[cat] || [];
  subs.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    subSelect.appendChild(opt);
  });
}

document.getElementById('openAddModal').onclick = () => {
  if (!currentUser) {
    alert('İlan verebilmek için lütfen önce giriş yapın.');
    document.getElementById('authModal').classList.add('open');
    return;
  }
  onAddCategoryChange();
  document.getElementById('addModal').classList.add('open');
};

document.getElementById('addForm').onsubmit = (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('addImageFile');
  const file = fileInput.files[0];

  if (!file) {
    alert('Lütfen bir fotoğraf seçin.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageDataUrl = event.target.result;
    const cat = document.getElementById('addCategory').value;
    const subCat = document.getElementById('addSubCategory').value;
    const specVal = document.getElementById('addStorageSpec').value;

    const newProduct = {
      id: Date.now(),
      title: document.getElementById('addTitle').value,
      category: cat,
      subCategory: subCat,
      price: Number(document.getElementById('addPrice').value),
      status: document.getElementById('addStatus').value,
      badge: document.getElementById('addBadgeType').value,
      city: document.getElementById('addCity').value,
      seller: currentUser.name,
      verified: true,
      rating: '5.0',
      image: imageDataUrl,
      spec: specVal,
      desc: document.getElementById('addDesc').value
    };

    products.unshift(newProduct);
    renderProducts();
    closeAllModals();
    document.getElementById('addForm').reset();
    alert('JETON\'da ilanınız başarıyla yayınlandı!');
  };

  reader.readAsDataURL(file);
};

let currentDetailProduct = null;

function openDetailModal(product) {
  currentDetailProduct = product;
  saveRecentView(product);

  document.getElementById('mImg').src = product.image;
  document.getElementById('mTitle').textContent = product.title;
  document.getElementById('mPrice').textContent = product.price.toLocaleString('tr-TR') + ' TL';
  document.getElementById('mDesc').textContent = product.desc;

  document.getElementById('mSeller').innerHTML = `${product.seller} ${product.verified ? '<span class="verified-badge" title="Onaylı Satıcı">✓ Onaylı Satıcı</span>' : ''} <span style="font-size:0.8rem; color:#f59e0b; margin-left:6px;">⭐ ${product.rating}</span>`;
  document.getElementById('mLoc').textContent = '📍 ' + product.city;

  const badgesContainer = document.getElementById('mBadgesContainer');
  badgesContainer.innerHTML = `<span class="badge-custom ${product.status === 'Sıfır' ? 'badge-new' : 'badge-used'}">${product.status}</span>`;
  if (product.badge === 'acil') badgesContainer.innerHTML += '<span class="badge-custom badge-urgent">🔥 Acil</span>';
  if (product.badge === 'vitrin') badgesContainer.innerHTML += '<span class="badge-custom badge-vitrin">⭐ Vitrin</span>';

  const specsContainer = document.getElementById('mSpecs');
  specsContainer.innerHTML = `<span>Kategori: ${product.category.toUpperCase()} > ${product.subCategory}</span> ${product.spec ? `<span>Detay: ${product.spec}</span>` : ''}`;

  document.getElementById('detailModal').classList.add('open');
}

function openProfileModal() {
  if (!currentUser) return;
  renderMyAds();
  loadNotificationSettings();
  switchProfileTab('ads');
  document.getElementById('profileModal').classList.add('open');
}

function switchProfileTab(tabKey) {
  ['Ads', 'Msgs', 'Auth', 'About', 'Help', 'Settings'].forEach(k => {
    const btn = document.getElementById('menuBtn' + k);
    if(btn) btn.classList.remove('active');
  });

  const activeBtn = document.getElementById('menuBtn' + tabKey.charAt(0).toUpperCase() + tabKey.slice(1));
  if(activeBtn) activeBtn.classList.add('active');

  ['Ads', 'Msgs', 'Auth', 'About', 'Help', 'Settings'].forEach(k => {
    const sec = document.getElementById('pSec' + k);
    if(sec) sec.style.display = 'none';
  });

  const targetSec = document.getElementById('pSec' + tabKey.charAt(0).toUpperCase() + tabKey.slice(1));
  if(targetSec) targetSec.style.display = 'block';
}

function renderMyAds() {
  const list = document.getElementById('myAdsList');
  list.innerHTML = '';
  const myAds = products.filter(p => currentUser && p.seller === currentUser.name);

  if (myAds.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:30px; color:var(--muted);">Henüz ilan vermediniz.</div>';
    return;
  }

  myAds.forEach(p => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border:1.5px solid var(--line); border-radius:12px; background:#fff;';
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${p.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
        <div>
          <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">${p.title}</div>
          <div style="color:#c2410c; font-weight:700; font-size:0.82rem;">${p.price.toLocaleString('tr-TR')} TL</div>
        </div>
      </div>
      <button class="btn-danger" style="padding:5px 10px; font-size:0.75rem;" onclick="deleteMyAd(${p.id})">İlanı Kaldır</button>
    `;
    list.appendChild(item);
  });
}

function deleteMyAd(id) {
  products = products.filter(p => p.id !== id);
  renderMyAds();
  renderProducts();
}

function saveNotificationSettings() {
  const emailNotif = document.getElementById('notifEmailCheck').checked;
  const smsNotif = document.getElementById('notifSmsCheck').checked;
  const darkMode = document.getElementById('darkModeCheck').checked;

  const settings = { email: emailNotif, sms: smsNotif, darkMode: darkMode };
  localStorage.setItem('token_notification_settings', JSON.stringify(settings));
  alert('Bildirim ve iletişim tercihleriniz başarıyla kaydedildi!');
}

function loadNotificationSettings() {
  const saved = JSON.parse(localStorage.getItem('token_notification_settings'));
  if (saved) {
    document.getElementById('notifEmailCheck').checked = saved.email;
    document.getElementById('notifSmsCheck').checked = saved.sms;
    document.getElementById('darkModeCheck').checked = saved.darkMode;
  }
}

function selectChat(userName) {
  document.querySelectorAll('.chat-user-item').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.getElementById('activeChatUser').textContent = userName;
}

function sendChatMessage() {
  const input = document.getElementById('chatInputText');
  const text = input.value.trim();
  if(!text) return;

  const chatMessages = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg outgoing';
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  input.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openChatFromDetail() {
  if (!currentUser) {
    alert('Satıcıyla mesajlaşabilmek için lütfen giriş yapın.');
    closeAllModals();
    document.getElementById('authModal').classList.add('open');
    return;
  }
  closeAllModals();
  openProfileModal();
  switchProfileTab('msgs');
  if (currentDetailProduct) {
    document.getElementById('activeChatUser').textContent = currentDetailProduct.seller;
  }
}

updateAuthUI();
renderHistoryBars();
onAddCategoryChange();
renderProducts();