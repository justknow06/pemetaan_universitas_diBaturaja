// ===== DATA KAMPUS DI BATURAJA =====
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
    name: "Sekolah Tinggi Ilmu Kesehatan (STIKes) Al-Ma'arif Baturaja",
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

// ===== ELEMEN =====
const listEl = document.getElementById('campusList');
const searchInput = document.getElementById('searchInput');
const chips = document.querySelectorAll('.chip');
const resultCount = document.getElementById('resultCount');
const detailCard = document.getElementById('detailCard');
const closeDetail = document.getElementById('closeDetail');
const mapIframe = document.getElementById('mapIframe');
const mapLabel = document.getElementById('mapLabel');

let activeFilter = 'semua';
let activeSearch = '';

// ===== RENDER LIST =====
function renderList(){
  const filtered = campuses.filter(c => {
    const matchFilter = activeFilter === 'semua' || c.type === activeFilter;
    const haystack = (c.name + ' ' + c.address + ' ' + c.program).toLowerCase();
    const matchSearch = haystack.includes(activeSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  resultCount.textContent = filtered.length
    ? `Menampilkan ${filtered.length} dari ${campuses.length} kampus`
    : 'Tidak ada kampus yang cocok';

  listEl.innerHTML = '';

  filtered.forEach(c => {
    const li = document.createElement('li');
    li.className = 'campus-item';
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
function selectCampus(c){
  // highlight item terpilih
  document.querySelectorAll('.campus-item').forEach(el => {
    el.classList.toggle('selected', Number(el.dataset.id) === c.id);
  });

  // update peta
  const delta = 0.01;
  const bbox = [
    c.lng - delta, c.lat - delta,
    c.lng + delta, c.lat + delta
  ].join('%2C');

  mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${c.lat},${c.lng}`;

  mapLabel.innerHTML = `<strong>${c.name}</strong><span>${c.address}</span>`;

  // isi detail card
  document.getElementById('detailTag').textContent = c.typeLabel;
  document.getElementById('detailTag').className = `detail-tag ${c.type}`;
  document.getElementById('detailName').textContent = c.name;
  document.getElementById('detailAddress').textContent = c.address;
  document.getElementById('detailProgram').textContent = c.program;
  document.getElementById('detailDistance').textContent = c.distance;
  document.getElementById('detailMapLink').href =
    `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;

  detailCard.classList.add('active');
}

// ===== EVENT: PENCARIAN =====
searchInput.addEventListener('input', (e) => {
  activeSearch = e.target.value;
  renderList();
});

// ===== EVENT: FILTER CHIP =====
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderList();
  });
});

// ===== EVENT: TUTUP DETAIL =====
closeDetail.addEventListener('click', () => {
  detailCard.classList.remove('active');
  document.querySelectorAll('.campus-item').forEach(el => el.classList.remove('selected'));
});

// ===== INIT =====
renderList();