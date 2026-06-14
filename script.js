// ===== DATA KAMPUS =====
const campuses = [
  {
    id: 1,
    name: "Universitas Baturaja (UNBARA)",
    type: "swasta",
    typeLabel: "Swasta",
    address: "Jl. Ki Ratu Penghulu No.02301, Karang Sari, Baturaja Timur, OKU",
    program: "Manajemen, Akuntansi, Bisnis Digital, Teknik Sipil, Informatika, Agroteknologi, Ilmu Komunikasi, Hukum Bisnis, FKIP",
    distance: "± 2 km dari pusat kota",
    lat: -4.1389,
    lng: 104.1764
  },
  {
    id: 2,
    name: "STAI Baturaja",
    type: "swasta",
    typeLabel: "Swasta",
    address: "Jl. Bindung Langit Lawang Kulon No.0799, Baturaja Timur, OKU (samping DPRD OKU)",
    program: "Pendidikan Agama Islam, Ekonomi Syariah",
    distance: "± 1.2 km dari pusat kota",
    lat: -4.1325,
    lng: 104.1705
  },
  {
    id: 3,
    name: "STIKes Al-Ma'arif Baturaja",
    type: "swasta",
    typeLabel: "Swasta",
    address: "Jl. Dr. Mohammad Hatta No.687-B/C, Sukaraya, Baturaja Timur, OKU",
    program: "Keperawatan, Kebidanan, Kesehatan Masyarakat",
    distance: "± 1.8 km dari pusat kota",
    lat: -4.1295,
    lng: 104.1685
  },
  {
    id: 4,
    name: "AMIK AKMI Baturaja",
    type: "swasta",
    typeLabel: "Swasta",
    address: "Jl. Jend. A. Yani No.0267 A, Tanjung Baru, Baturaja Timur, OKU",
    program: "Manajemen Informatika, Teknik Informatika",
    distance: "± 1.5 km dari pusat kota",
    lat: -4.1320,
    lng: 104.1715
  },
  {
    id: 5,
    name: "Poltekkes Kemenkes Palembang - Prodi D.III Keperawatan Baturaja",
    type: "negeri",
    typeLabel: "Negeri",
    address: "Jl. Imam Bonjol No.652, Air Paoh, Baturaja Timur, OKU",
    program: "D-III Keperawatan",
    distance: "± 3 km dari pusat kota",
    lat: -4.1230,
    lng: 104.1620
  }
];

// ===== INISIALISASI PETA LEAFLET =====
const map = L.map('map').setView([-4.133, 104.168], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

// ===== WARNA MARKER =====
function markerColor(type) {
  return type === 'negeri' ? '#5f7350' : '#c4602f';
}

function makeIcon(type, active = false) {
  const color = markerColor(type);
  const size = active ? 38 : 32;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
      <circle cx="16" cy="13" r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
      <polygon points="16,28 10,18 22,18" fill="${color}"/>
      <text x="16" y="17" text-anchor="middle" fill="#fff" font-size="11" font-family="sans-serif" font-weight="bold">🎓</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size]
  });
}

// ===== BUAT SEMUA MARKER =====
const markers = {};

campuses.forEach(c => {
  const marker = L.marker([c.lat, c.lng], { icon: makeIcon(c.type) }).addTo(map);
  marker.bindTooltip(c.name, { direction: 'top', offset: [0, -28] });
  marker.on('click', () => selectCampus(c));
  markers[c.id] = marker;
});

// ===== ELEMEN UI =====
const listEl       = document.getElementById('campusList');
const searchInput  = document.getElementById('searchInput');
const chips        = document.querySelectorAll('.chip');
const resultCount  = document.getElementById('resultCount');
const detailCard   = document.getElementById('detailCard');
const closeDetail  = document.getElementById('closeDetail');

let activeFilter = 'semua';
let activeSearch = '';
let activeId     = null;

// ===== RENDER LIST =====
function renderList() {
  const filtered = campuses.filter(c => {
    const matchFilter = activeFilter === 'semua' || c.type === activeFilter;
    const haystack = (c.name + ' ' + c.address + ' ' + c.program).toLowerCase();
    return matchFilter && haystack.includes(activeSearch.toLowerCase());
  });

  resultCount.textContent = filtered.length
    ? `Menampilkan ${filtered.length} dari ${campuses.length} kampus`
    : 'Tidak ada kampus yang cocok';

  listEl.innerHTML = '';

  filtered.forEach(c => {
    const li = document.createElement('li');
    li.className = 'campus-item' + (c.id === activeId ? ' selected' : '');
    li.dataset.id = c.id;
    li.innerHTML = `
      <h3>${c.name}</h3>
      <p>${c.address}</p>
      <span class="tag-mini ${c.type}">${c.typeLabel}</span>
    `;
    li.addEventListener('click', () => selectCampus(c));
    listEl.appendChild(li);
  });
}

// ===== PILIH KAMPUS =====
function selectCampus(c) {
  // reset marker lama
  if (activeId && markers[activeId]) {
    const prev = campuses.find(x => x.id === activeId);
    markers[activeId].setIcon(makeIcon(prev.type, false));
  }

  activeId = c.id;

  // marker aktif
  markers[c.id].setIcon(makeIcon(c.type, true));
  map.flyTo([c.lat, c.lng], 16, { duration: 0.8 });

  // highlight list
  document.querySelectorAll('.campus-item').forEach(el => {
    el.classList.toggle('selected', Number(el.dataset.id) === c.id);
  });

  // isi detail card
  document.getElementById('detailTag').textContent  = c.typeLabel;
  document.getElementById('detailTag').className    = `detail-tag ${c.type}`;
  document.getElementById('detailName').textContent = c.name;
  document.getElementById('detailAddress').textContent = c.address;
  document.getElementById('detailProgram').textContent = c.program;
  document.getElementById('detailDistance').textContent = c.distance;
  document.getElementById('detailMapLink').href =
    `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;

  detailCard.classList.add('active');
}

// ===== EVENTS =====
searchInput.addEventListener('input', e => {
  activeSearch = e.target.value;
  renderList();
});

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderList();
  });
});

closeDetail.addEventListener('click', () => {
  detailCard.classList.remove('active');
  if (activeId && markers[activeId]) {
    const prev = campuses.find(x => x.id === activeId);
    markers[activeId].setIcon(makeIcon(prev.type, false));
  }
  activeId = null;
  document.querySelectorAll('.campus-item').forEach(el => el.classList.remove('selected'));
  map.flyTo([-4.133, 104.168], 14, { duration: 0.6 });
});

// ===== INIT =====
renderList();
