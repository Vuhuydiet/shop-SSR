

async function handleAddToCart(productId, quantity, isAuthenticated) {
		if (isAuthenticated) {
			await sendAddCartItemReq(productId, quantity, isAuthenticated);
		}
		else {
			const cart = JSON.parse(localStorage.getItem('cart')) || {};
			cart[productId] = (cart[productId] || 0) + quantity;
			localStorage.setItem('cart', JSON.stringify(cart));
		}
}

async function handleAlterCartItemQuantity(productId, quantity, isAuthenticated) {
  if (isAuthenticated) {
    await sendAlterCartItemQuantity(productId, quantity);
  }
  else {
    console.log(productId, quantity);
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[productId] = quantity
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

async function handleDeleteCartItem(productId, isAuthenticated) {
  if (isAuthenticated) {
    await sendDeleteItemReq(productId);
  }
  else {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}


async function flushItemToCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  for (const productId in cart) {
    await sendAddCartItemReq(productId, cart[productId]);
  }
  localStorage.removeItem('cart');
}

async function handleSendCheckout(products, isAuthenticated) {
  if (isAuthenticated) {
    await sendCheckoutReq(products);
  }
  else {
    window.location.href = '/users/login';
  }
}