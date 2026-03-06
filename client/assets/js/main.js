"use strict";

// =========================
// Basic Config
// =========================
const API_BASE_URL = "https://ecommerce-depi.runasp.net";
const BEST_COUNT = 8;
const EXPLORE_COUNT = 16;

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

        drawCategoryMenus(categories);
        drawAllProductSections(shownProducts);
    } catch (error) {
        console.error(error);
        console.error("Could not load data from API.");
    }
}

async function getCategoriesFromApi() {
    const response = await fetch(`${API_BASE_URL}/api/Categories`);
    if (!response.ok) {
        throw new Error("Categories request failed");
    }
    return await response.json();
}

async function getProductsFromApi(pageNumber, pageSize) {
    const url = `${API_BASE_URL}/api/Product?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Products request failed");
    }
    const result = await response.json();
    return result.items ? result.items : [];
}

async function getSearchProductsFromApi(query) {
    const url = `${API_BASE_URL}/api/Product/search?query=${encodeURIComponent(query)}&pageNumber=1&pageSize=48`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Search request failed");
    }
    const result = await response.json();
    return result.items ? result.items : [];
}

// =========================
// Render Categories
// =========================
function drawCategoryMenus(categories) {
    drawBrowseCategoryMenu(categories);
    AddCategoryEventHandlers();
}

function drawBrowseCategoryMenu(categories) {
    const icons = [
        "fa-mobile-screen-button",
        "fa-desktop",
        "fa-clock",
        "fa-camera",
        "fa-headphones",
        "fa-gamepad"
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

    browseCategoriesEl.innerHTML = html;
}

function AddCategoryEventHandlers() {
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
    drawAllProductSections(shownProducts);
}

// =========================
// Render Products
// =========================
function drawAllProductSections(products) {
    drawProductCards(bestSellingGridEl, products.slice(0, BEST_COUNT), false);
    drawProductCards(exploreGridEl, products.slice(0, EXPLORE_COUNT), false);
}

function drawProductCards(container, products, showDiscount) {
    if (!products || products.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    let html = "";

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const price = Number(product.price);
        const oldPrice = (price * 1.2).toFixed(2);
        const imageUrl = product.image ? product.image : "https://via.placeholder.com/300x300?text=Product";
        const stars = Math.floor(Math.random() * 2) + 4;
        const starCount = Math.floor(Math.random() * (300 - 40 + 1)) + 40;
        const discount = "-" + (Math.floor(Math.random() * (30 - 10 + 1)) + 10) + "%";
        const starsText = "★".repeat(stars) + "☆".repeat(5 - stars);

        const discountHtml = showDiscount ? `<span class="discount-badge">${discount}</span>` : "";
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
                    <p class="rating">${starsText} <span class="count">(${starCount})</span></p>
                </div>
            </article>
        `;
    }

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

    allProductsBtnEl.addEventListener("click", function (event) {
        event.preventDefault();
        drawProductCards(exploreGridEl, shownProducts, false);
        window.scrollTo({
            top: exploreGridEl.offsetTop - 100,
            behavior: "smooth"
        });
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

        drawAllProductSections(shownProducts);
        return;
    }

    try {
        const searchResult = await getSearchProductsFromApi(query);
        shownProducts = searchResult;
        drawAllProductSections(shownProducts);
    } catch (error) {
        console.error(error);
        console.error("Search failed. Try again.");
    }
}

