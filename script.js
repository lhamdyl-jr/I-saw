// =====================================================
//  عدّل هنا: الألبومات بتاعتك
//  - كل ألبوم له فولدر جوه images (مثلًا images/places)
//  - cover: صورة الغلاف (لو سبتها فاضية بتاخد أول صورة)
//  - photos: أسماء الصور اللي جوه الفولدر
// =====================================================
const albums = [
  {
    id: "places",
    title: "Places",
    description: "Streets, corners, and cities I walked through.",
    folder: "images/places",
    cover: "",
    photos: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
  },
  {
    id: "people",
    title: "People",
    description: "Faces and stories.",
    folder: "images/people",
    cover: "",
    photos: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
  },
  {
    id: "nature",
    title: "Nature",
    description: "Light, landscapes, and quiet moments.",
    folder: "images/nature",
    cover: "",
    photos: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
  },
];
// =====================================================

const $ = id => document.getElementById(id);
const home = $("home"), albumView = $("album-view");
const grid = $("album-grid"), gallery = $("gallery");
let current = null;   // الألبوم المفتوح
let idx = 0;          // الصورة المفتوحة في الـ lightbox

const src = (a, f) => `${a.folder}/${f}`;

// ---------- كروت الألبومات ----------
albums.forEach(a => {
  const card = document.createElement("a");
  card.className = "album-card";
  card.href = `#/album/${a.id}`;

  const img = new Image();
  img.src = a.cover ? `${a.folder}/${a.cover}` : src(a, a.photos[0]);
  img.alt = a.title; img.loading = "lazy";
  img.onload = () => img.classList.add("loaded");
  img.onerror = () => img.remove();   // لو مفيش صورة يفضل الكارت بالاسم بس

  const info = document.createElement("div");
  info.className = "album-info";
  info.innerHTML = `<h3>${a.title}</h3><span>${a.photos.length} photos</span>`;

  card.append(img, info);
  grid.appendChild(card);
});

// ---------- صفحة الألبوم ----------
function showAlbum(a) {
  current = a;
  $("album-title").textContent = a.title;
  $("album-desc").textContent = a.description || "";
  gallery.innerHTML = "";
  a.photos.forEach((f, i) => {
    const d = document.createElement("div");
    d.className = "item";
    const img = new Image();
    img.src = src(a, f); img.alt = `${a.title} ${i + 1}`; img.loading = "lazy";
    img.onload = () => img.classList.add("loaded");
    img.onerror = () => d.remove();
    d.appendChild(img);
    d.onclick = () => openLb(i);
    gallery.appendChild(d);
  });
  home.hidden = true; albumView.hidden = false;
  window.scrollTo(0, 0);
  document.title = `${a.title} — I saw`;
}

function showHome() {
  current = null;
  albumView.hidden = true; home.hidden = false;
  document.title = "I saw — Photography";
}

// ---------- التنقل (hash routing) ----------
function route() {
  const m = location.hash.match(/^#\/album\/([\w-]+)$/);
  const a = m && albums.find(x => x.id === m[1]);
  if (a) return showAlbum(a);
  showHome();
  const target = location.hash && document.querySelector(location.hash);
  if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
route();

// ---------- Lightbox ----------
const lb = $("lightbox"), lbImg = $("lb-img"), cap = $("caption");
function showLb(i) {
  idx = (i + current.photos.length) % current.photos.length;
  lbImg.src = src(current, current.photos[idx]);
  cap.textContent = `${current.title} · ${idx + 1} / ${current.photos.length}`;
}
function openLb(i) { showLb(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
$("close").onclick = closeLb;
$("prev").onclick = () => showLb(idx - 1);
$("next").onclick = () => showLb(idx + 1);
lb.onclick = e => { if (e.target === lb) closeLb(); };
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") showLb(idx - 1);
  if (e.key === "ArrowRight") showLb(idx + 1);
});

// سحب باللمس على الموبايل
let x0 = null;
lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) showLb(idx + (dx < 0 ? 1 : -1));
  x0 = null;
});

$("year").textContent = new Date().getFullYear();
