// function addToCart(productId) {

//     let cart = JSON.parse(localStorage.getItem("cart")) || [];

//     let product = cart.find(p => p.id === productId);

//     if (product) {
//         product.qty++;
//     } else {
//         cart.push({
//             id: productId,
//             qty: 1
//         });
//     }

//     localStorage.setItem("cart", JSON.stringify(cart));
// }

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function removeFromCart(productId) {
  let cart = getCart();

  cart = cart.filter((p) => p.id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem("cart");
}

/* Render Cart */

const cartContainer = document.getElementById("cart-items");

// Only run cart rendering if we're on the cart page
if (cartContainer) {
  let cart = getCart();

  cart.forEach(async (itemData) => {
    let response = await fetch(
      `https://ecommerce-depi.runasp.net/api/Product/${itemData.id}`,
    );
    let product = await response.json();

    let item = document.createElement("div");
    item.className = "cart-item";

    item.innerHTML = `
          <div class="product">
              <img src="${product.image}" alt="">
              <p>${product.name}</p>
          </div>

          <div class="price">$${product.price}</div>

          <div>
              <input type="number" value="${itemData.qty}" min="1" max="${product.productsInStock}" class="qty-input">
          </div>

          <div class="subtotal">$${(product.price * itemData.qty).toFixed(2)}</div>

          <div>
              <button class="remove-btn">Remove</button>
          </div>
      `;

    cartContainer.appendChild(item);

  const qtyInput = item.querySelector(".qty-input");
  const subtotalDiv = item.querySelector(".subtotal");
  const removeBtn = item.querySelector(".remove-btn");

  /* Quantity Change */

  qtyInput.addEventListener("input", () => {
    let qty = parseInt(qtyInput.value) || 1;

    let subtotal = (product.price * qty).toFixed(2);

    subtotalDiv.textContent = `$${subtotal}`;

    let cart = getCart();

    let productInCart = cart.find((p) => p.id === itemData.id);

    if (productInCart) {
      productInCart.qty = qty;
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartTotal();
  });

  /* Remove Button */

  removeBtn.addEventListener("click", () => {
    removeFromCart(itemData.id);

    item.remove();

    updateCartTotal();
    updateCartCount();
  });

  updateCartTotal();
  updateCartCount();
  });
}

/* Update Cart Total */

function updateCartTotal() {
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  
  if (!subtotalEl || !totalEl) return;
  
  let subtotalElements = document.querySelectorAll(".cart-item .subtotal");

  let subtotal = 0;

  subtotalElements.forEach((el) => {
    subtotal += parseFloat(el.textContent.replace("$", ""));
  });

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function updateCartCount() {
  let cartcount = document.querySelector(".cart-count, #cartCount");
  if (!cartcount) return;
  
  let cart = getCart();
  let count = 0;

  cart.forEach((item) => {
    count += Number(item.qty || 0);
  });

  cartcount.textContent = count;
}


const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    clearCart();
    cartContainer.innerHTML = "";
    
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");
    
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    if (totalEl) totalEl.textContent = "$0.00";

    updateCartCount();
    alert("Order placed successfully!");
  });
}

updateCartCount();
