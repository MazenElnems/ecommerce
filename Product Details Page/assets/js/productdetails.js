let currentProductId = null;

function getProductId() {
  const query = window.location.search;
  const parts = query.split("=");

  return parts[1];
}


async function loadProduct() {
  let id = getProductId();

  if (!id) {
    const res = await fetch("https://localhost:7200/api/Product?pageNumber=1&pageSize=1");
    const data = await res.json();
    id = data.items[0].id;
  }

  currentProductId = id;

  const response = await fetch(`https://localhost:7200/api/Product/${id}`);
  const product = await response.json();

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = "$" + product.price;
  document.getElementById("productDesc").textContent = product.description;
  document.getElementById("mainImage").src = product.image;
  document.getElementById("stock").textContent = product.productsInStock;

  loadRelated(product.categoryId, product.id);
}


async function loadRelated(categoryId, currentProductId) {
  const response = await fetch(`https://localhost:7200/api/Product/category/${categoryId}?pageNumber=1&pageSize=10`);
  const data = await response.json();
  const container = document.getElementById("relatedProducts");
  container.innerHTML = "";

  let count = 0;
  data.items.forEach(product => {
    if (product.id != currentProductId && count < 4) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.image}">
        <div class="card-body">
          <h4>${product.name}</h4>
          <p>$${product.price}</p>
          <a href="productdetails.html?id=${product.id}">View</a>
        </div>
      `;
      container.appendChild(card);
      count++;
    }
  });
}


function increase() {
  let qty = document.getElementById("qty");
  qty.value = parseInt(qty.value) + 1;
}

function decrease() {
  let qty = document.getElementById("qty");
  if (qty.value > 1) {
    qty.value = parseInt(qty.value) - 1;
  }
}


async function buyNow() {
  const quantity = parseInt(document.getElementById("qty").value);
  const productId = parseInt(currentProductId); 
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); 
  if (!token || !userId) {
    alert("Please login first!");
    return;
  }

  const order = {
    userId: userId,
    items: [
      { 
        productId:productId, 
        quantity:quantity 
      }
    ]
  };

  const response = await fetch("https://localhost:7200/api/Orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(order)
  });

  if (response.ok) {
    window.location.href = "cart.html";
  } else {
    const text = await response.text();
    console.log("Order Failed: " + text); 
  }
}

loadProduct();