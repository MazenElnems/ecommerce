const BASE_URL = "https://ecommerce-depi.runasp.net";
const PAGE_SIZE = 8;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let totalPages = 1;

document.addEventListener("DOMContentLoaded", () => {
  loadProducts(currentPage);
  updateCartCount();
});

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts(page = 1) {
  try {

    const url = `${BASE_URL}/api/Product?pageNumber=${page}&pageSize=${PAGE_SIZE}`;
    const res = await fetch(url);
    const data = await res.json();

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

  if (!container) return;

  container.innerHTML = "";

  if (filteredProducts.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-face-sad-tear"></i>
        <p>No products found</p>
      </div>
    `;

    if (countEl) countEl.textContent = "";
    return;

  }

  const start = (currentPage - 1) * PAGE_SIZE;

  if (countEl) {
    countEl.textContent =
      `Showing ${start + 1}–${start + filteredProducts.length}`;
  }

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

        <button class="btn-add" data-product-id="${product.id}">
          Add To Cart
        </button>

      </div>
    `;

    container.appendChild(card);

  });

  // Add event listener to container using delegation
  container.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-add")) {
      const productId = parseInt(e.target.getAttribute("data-product-id"));
      addToCart(productId);
    }
  });

}

/* =========================
   ADD TO CART
========================= */

function addToCart(productId) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let product = cart.find((p) => p.id === productId);

  if (product) {
    product.qty++;
  } else {
    cart.push({
      id: productId,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  showAddToCartMessage();
  updateCartCount();

}

/* =========================
   SUCCESS MESSAGE
========================= */

function showAddToCartMessage() {
  // Remove any existing toast
  const oldToast = document.querySelector('[data-toast="success"]');
  if (oldToast) oldToast.remove();

  // Create toast notification
  const toast = document.createElement("div");
  toast.setAttribute("data-toast", "success");
  toast.innerHTML = "✓ تمت إضافة المنتج للسلة بنجاح";
  
  toast.style.cssText = `
    position: fixed !important;
    top: 30px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: #28a745 !important;
    color: white !important;
    padding: 18px 30px !important;
    border-radius: 8px !important;
    font-size: 16px !important;
    font-weight: bold !important;
    z-index: 999999999 !important;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3) !important;
    text-align: center !important;
    min-width: 350px !important;
    animation: slideDown 0.3s ease !important;
  `;

  document.body.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = "slideUp 0.3s ease";
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }
  }, 3000);
}

/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCountEl = document.querySelector(".cart-count");

  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }

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

  pagination.innerHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {

    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
      </li>
    `;

  }

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

const sortSelect = document.getElementById("sortProducts");

if (sortSelect) {

  sortSelect.addEventListener("change", function () {

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

}