// function addToCart(productId) {

//     let cart = localStorage.getItem("cart");

//     if (cart) {
//         cart = JSON.parse(cart);
//     } else {
//         cart = [];
//     }

//     cart.push(productId);

//     localStorage.setItem("cart", JSON.stringify(cart));
// }

// function getCart() {
//     let cart = localStorage.getItem("cart");

//     if (cart) {
//         return JSON.parse(cart);
//     }
//     return [];
// }

// function removeFromCart(productId) {

//     let cart = getCart();

//     cart = cart.filter(id => id !== productId);

//     localStorage.setItem("cart", JSON.stringify(cart));
// }

// function clearCart() {
//     localStorage.removeItem("cart");
// }

// clearCart();

// addToCart(1);
// addToCart(2);
// addToCart(3);









// const cartContainer = document.getElementById("cart-items");

// let cart = JSON.parse(localStorage.getItem("cart")) || [];

// cart.forEach(id => {

//     fetch(`https://ecommerce-depi.runasp.net/api/Product/${id}`)
//     .then(res => res.json())
//     .then(product => {

//         let item = document.createElement("div");
//         item.className = "cart-item";

//         item.innerHTML = `
//             <div class="product">
//                 <img src="${product.image}" alt="">
//                 <p>${product.name}</p>
//             </div>

//             <div>$${product.price}</div>

//             <div>
//                 <input type="number" value="1" min="1">
//             </div>

//             <div>$${product.price}</div>
//         `;

//         cartContainer.appendChild(item);

//     });

// });










// function addToCart(productId) { 
//     let cart = localStorage.getItem("cart"); 
//     if (cart) { 
//         cart = JSON.parse(cart); 
//     } else { 
//         cart = []; 
//     } 
//     cart.push(productId); 
//     localStorage.setItem("cart", JSON.stringify(cart)); 
// } 

// function getCart() { 
//     let cart = localStorage.getItem("cart"); 
//     return cart ? JSON.parse(cart) : []; 
// } 

// function removeFromCart(productId) { 
//     let cart = getCart(); 
//     cart = cart.filter(id => id !== productId); 
//     localStorage.setItem("cart", JSON.stringify(cart)); 
// } 

// function clearCart() { 
//     localStorage.removeItem("cart"); 
// } 

// // Example setup
// clearCart(); 
// addToCart(1); 
// addToCart(2); 
// addToCart(3); 

// const cartContainer = document.getElementById("cart-items"); 
// let cart = getCart(); 

// // Keep track of products for subtotal calculation
// let productsInCart = [];

// cart.forEach(async id => { 
//     let response = await fetch(`https://ecommerce-depi.runasp.net/api/Product/${id}`);
//     let product = await response.json();


//     productsInCart.push(product);

//         let item = document.createElement("div"); 
//         item.className = "cart-item"; 

//         item.innerHTML = ` 
//             <div class="product"> 
//                 <img src="${product.image}" alt=""> 
//                 <p>${product.name}</p> 
//             </div> 

//             <div class="price">$${product.price}</div> 

//             <div> 
//                 <input type="number" value="1" min="1" class="qty-input"> 
//             </div> 

//             <div class="subtotal">$${product.price}</div> 
//         `; 

//         cartContainer.appendChild(item); 

//         // Add event listener to quantity input
//         const qtyInput = item.querySelector(".qty-input");
//         const subtotalDiv = item.querySelector(".subtotal");

//         qtyInput.addEventListener("input", () => {
//             let qty = parseInt(qtyInput.value) || 1;
//             let subtotal = (product.price * qty).toFixed(2);
//             subtotalDiv.textContent = `$${subtotal}`;
//             updateCartTotal();
//         });

//         updateCartTotal();
    
    
// }); 

// // Function to update the overall cart total
// function updateCartTotal() {
//     let subtotalElements = document.querySelectorAll(".cart-item .subtotal");
//     let subtotal = 0;
//     subtotalElements.forEach(el => {
//         subtotal += parseFloat(el.textContent.replace("$",""));
//     });
//     document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
//     document.getElementById("total").textContent = `$${subtotal.toFixed(2)}`; // Shipping is free
// }




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

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function removeFromCart(productId) {

    let cart = getCart();

    cart = cart.filter(p => p.id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
    localStorage.removeItem("cart");
}

addToCart(1);
addToCart(2);
addToCart(3);




/* Render Cart */

const cartContainer = document.getElementById("cart-items");

let cart = getCart();

cart.forEach(async itemData => {

    let response = await fetch(`https://ecommerce-depi.runasp.net/api/Product/${itemData.id}`);
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

        let productInCart = cart.find(p => p.id === itemData.id);

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


/* Update Cart Total */

function updateCartTotal() {

    let subtotalElements = document.querySelectorAll(".cart-item .subtotal");

    let subtotal = 0;

    subtotalElements.forEach(el => {

        subtotal += parseFloat(el.textContent.replace("$", ""));

    });

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;

    document.getElementById("total").textContent = `$${subtotal.toFixed(2)}`;
    
}



let cartcount = document.querySelector(".cart-count");
function updateCartCount() {

    let cart = getCart();
    let count = cart.length;

    cartcount.textContent = count;
}
