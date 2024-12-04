
async function sendAddCartItemReq(productId, quantity) {
  const response = await fetch("/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  const data = await response.json();
  console.log(data);
}

async function sendAlterCartItemQuantity(productId, quantity) {
  const response = await fetch(`/cart/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error("Failed to update cart item");
  }

  const data = await response.json();
  console.log(data);
}

async function sendDeleteItemReq(productId) {
  const response = await fetch(`/cart/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete cart item");
  }

  const data = await response.json();
  console.log(data);
}

async function sendCheckoutReq(products) {
  fetch('/checkout/submit-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products,
    }),
  })
  .then(response => {
    if (response.redirected) {
      // Redirect the client to the new page
      window.location.href = response.url;
    }
  })
  .catch(error => {
    throw new Error("Failed to checkout");
  });

}
