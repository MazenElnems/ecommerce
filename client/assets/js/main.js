"use strict";

// =========================
// Basic Config
// =========================
const API_BASE_URL = "https://ecommerce-depi.runasp.net";
const BEST_COUNT = 4;
const EXPLORE_COUNT = 4;

// =========================
// Global Variables
// =========================
let allCategories = [];
let allProducts = [];
let shownProducts = [];
let selectedCategoryId = null;

// =========================
// Global DOM Elements
// =========================
const browseCategoriesEl = document.getElementById("browseCategories");
const bestSellingGridEl = document.getElementById("bestSellingGrid");
const exploreGridEl = document.getElementById("exploreGrid");
const allProductsBtnEl = document.getElementById("allProductsBtn");
const searchInputEl = document.getElementById("searchInput");
const searchBtnEl = document.getElementById("searchBtn");
const mainNavEl = document.getElementById("mainNav");
const mobileMenuBtnEl = document.getElementById("mobileMenuBtn");

// =========================
// Startup Functions
// =========================
document.addEventListener("DOMContentLoaded", function () {
  addEventHandlers();
  loadHomeData();
});

// =========================
// Data Loading Functions
// =========================
async function loadHomeData() {
  try {
    const categories = await getCategoriesFromApi();
    const products = await getProductsFromApi(1, 48);

    allCategories = categories;
    allProducts = products;
    shownProducts = products;

    renderCategoryMenue(categories);
    renderAllProductSections(shownProducts);
  } catch (error) {
    console.error(error);
    console.error("Could not load data from API.");
  }
}

async function getCategoriesFromApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Categories`);
    if (!response.ok) {
      console.error("Categories request failed");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Categories request failed:", error);
    return [];
  }
}

async function getProductsFromApi(pageNumber, pageSize) {
  try {
    const url = `${API_BASE_URL}/api/Product?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Products request failed");
      return [];
    }
    const result = await response.json();
    return result.items ? result.items : [];
  } catch (error) {
    console.error("Products request failed:", error);
    return [];
  }
}

async function getSearchProductsFromApi(query) {
  try {
    const url = `${API_BASE_URL}/api/Product/search?query=${encodeURIComponent(query)}&pageNumber=1&pageSize=48`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Search request failed");
      return [];
    }
    const result = await response.json();
    return result.items ? result.items : [];
  } catch (error) {
    console.error("Search request failed:", error);
    return [];
  }
}

// =========================
// Render Categories
// =========================
function renderCategoryMenue(categories) {
  const menuHtml = getCategoryMenueHtml(categories);
  browseCategoriesEl.innerHTML = menuHtml;
  addCategoryEventHandlers();
}

function getCategoryMenueHtml(categories) {
  const icons = [
    "fa-mobile-screen-button",
    "fa-desktop",
    "fa-clock",
    "fa-camera",
    "fa-headphones",
    "fa-gamepad",
  ];

  let html = "";
  const maxItems = Math.min(categories.length, 6);

  for (let i = 0; i < maxItems; i++) {
    const category = categories[i];
    const activeClass = i === 3 ? "active" : "";
    const iconName = icons[i % icons.length];

    html += `
            <article class="category-card ${activeClass}" data-category-id="${category.id}">
                <i class="fa-solid ${iconName}"></i>
                <p>${category.name}</p>
            </article>
        `;
  }

  return html;
}

function addCategoryEventHandlers() {
  const browseCards = browseCategoriesEl.querySelectorAll(".category-card");
  for (let i = 0; i < browseCards.length; i++) {
    browseCards[i].addEventListener("click", function () {
      const categoryId = Number(browseCards[i].dataset.categoryId);
      filterProductsByCategory(categoryId);

      for (let j = 0; j < browseCards.length; j++) {
        browseCards[j].classList.remove("active");
      }
      browseCards[i].classList.add("active");
    });
  }
}

function filterProductsByCategory(categoryId) {
  selectedCategoryId = categoryId;

  const list = [];
  for (let i = 0; i < allProducts.length; i++) {
    if (allProducts[i].categoryId === categoryId) {
      list.push(allProducts[i]);
    }
  }

  shownProducts = list;
  renderAllProductSections(shownProducts);
}

// =========================
// Render Products
// =========================
function renderAllProductSections(products) {
  renderProductCards(bestSellingGridEl, products.slice(0, BEST_COUNT), false);
  renderProductCards(exploreGridEl, products.slice(0, EXPLORE_COUNT), false);
}

function addToCart(productId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let product = cart.find(p => p.id === productId);

    if (product) {
        product.qty++;
    } else {
        cart.push({
            id: productId,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderProductCards(container, products, showDiscount) {
  if (!products || products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  let html = "";

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const price = Number(product.price);
    const oldPrice = (price * 1.2).toFixed(2);
    const imageUrl = product.image
      ? product.image
      : "https://via.placeholder.com/300x300?text=Product";
    const discountHtml = showDiscount
      ? `<span class="discount-badge">-20%</span>`
      : "";
    html += `
            <article class="product-card">
                <div class="product-media">
                    ${discountHtml}
                    <div class="quick-actions">
                        <button aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
                        <button aria-label="Quick view"><i class="fa-regular fa-eye"></i></button>
                    </div>
                    <img src="${imageUrl}" alt="${product.name}" />
                </div>
                <button class="add-btn">Add To Cart</button>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price-row">
                        <span class="new-price">$${price.toFixed(2)}</span>
                        <span class="old-price">$${oldPrice}</span>
                    </div>
                    <p class="rating">★★★★☆ <span class="count">(88)</span></p>
                </div>
            </article>
        `;
  }
  let addBtn = document.querySelector(".add-btn");
  addBtn.addEventListener("click", () => {
    addToCart(product.id);
});


  container.innerHTML = html;
}

// =========================
// UI Events
// =========================
function addEventHandlers() {
  searchBtnEl.addEventListener("click", onSearchClick);
  searchInputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      onSearchClick();
    }
  });

 
  mobileMenuBtnEl.addEventListener("click", function () {
    mainNavEl.classList.toggle("show");
  });
}

async function onSearchClick() {
  const query = searchInputEl.value.trim();

  if (query === "") {
    if (selectedCategoryId === null) {
      shownProducts = allProducts.slice();
    } else {
      shownProducts = allProducts.filter(function (p) {
        return p.categoryId === selectedCategoryId;
      });
    }

    renderAllProductSections(shownProducts);
    return;
  }

  try {
    const searchResult = await getSearchProductsFromApi(query);
    shownProducts = searchResult;
    renderAllProductSections(shownProducts);
  } catch (error) {
    console.error(error);
    console.error("Search failed. Try again.");
  }
}
