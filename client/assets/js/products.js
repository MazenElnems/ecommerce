const BASE_URL = "https://ecommerce-depi.runasp.net";
const PAGE_SIZE = 8;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let totalPages = 1;

document.addEventListener("DOMContentLoaded", () => loadProducts(currentPage));

/* =========================
   LOAD PRODUCTS (Server Pagination)
========================= */

async function loadProducts(page = 1) {
  try {
    const url = `${BASE_URL}/api/Product?pageNumber=${page}&pageSize=${PAGE_SIZE}`;
    const res = await fetch(url);
    const data = await res.json();

    // يدعم حالتين: { items, totalCount } أو مصفوفة مباشرة
    const items = data.items || data;
    const totalCount = data.totalCount ?? items.length;

    allProducts = items.map(normalizeProduct);
    filteredProducts = [...allProducts];

    totalPages = Math.ceil(totalCount / PAGE_SIZE);
    currentPage = page;

    renderProducts();
    renderPagination();

  } catch (error) {
    console.error("API Error:", error);
  }
}

/* =========================
   NORMALIZE DATA
========================= */

function normalizeProduct(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image?.startsWith("http")
      ? p.image
      : `${BASE_URL}/${p.image}`,
    description: p.description ?? "",
    rating: p.rating ?? 4
  };
}

/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  const container = document.getElementById("products-container");
  const countEl = document.getElementById("productsCount");

  container.innerHTML = "";

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-face-sad-tear"></i>
        <p>No products found</p>
      </div>
    `;
    countEl.textContent = "";
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE;

  countEl.textContent =
    `Showing ${start + 1}–${start + filteredProducts.length}`;

  filteredProducts.forEach((product) => {

    const card = document.createElement("div");
    card.className = "shop-card";

    const stars = generateStars(product.rating);

    card.innerHTML = `
      <div class="shop-img">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.src='https://placehold.co/300x300'"
        >
        <span class="discount-badge">-35%</span>
        <button class="wishlist-btn">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>

      <div class="shop-body">
        <h4>${product.name}</h4>
        <p class="price">${product.price} EGP</p>
        <div class="stars">${stars}</div>
        <button class="btn-add">Add To Cart</button>
      </div>
    `;

    container.appendChild(card);

  });
}

/* =========================
   STARS
========================= */

function generateStars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<i class="fa-${i < rating ? "solid" : "regular"} fa-star"></i>`
  ).join("");
}

/* =========================
   PAGINATION
========================= */

function renderPagination() {

  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Previous
  pagination.innerHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>
    </li>
  `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
      </li>
    `;
  }

  // Next
  pagination.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>
    </li>
  `;
}

/* =========================
   CHANGE PAGE
========================= */

function changePage(page) {

  if (page < 1 || page > totalPages) return;

  loadProducts(page);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}
/* =========================
   SORT
========================= */

document.getElementById("sortProducts").addEventListener("change", function () {

  const value = this.value;

  if (value === "priceLow") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (value === "priceHigh") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (value === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderProducts();
});