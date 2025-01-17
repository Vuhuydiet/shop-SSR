﻿const PAGE_SIZE = 9;

document.addEventListener("DOMContentLoaded", async () => {
  await fetchProducts();
});

const updateURL = (queryString) => {
  const newURL = `${window.location.pathname}?${queryString}`;
  history.replaceState(null, "", newURL);
};

const config = {
  categories: { isArray: true },
  brands: { isArray: true },
  minPrice: {},
  maxPrice: {},
  minRating: {},
  maxRating: {},
  searchTerm: {},
  sortBy: {
    customHandler: (value, searchParams) => {
      const [sortBy, order] = value.split("-");
      searchParams.append("sortBy", sortBy);
      searchParams.append("order", order);
    },
  },
};

function generateSearchParams(config = {}) {
  const formData = new FormData(form);
  const searchParams = new URLSearchParams();

  const urlParams = new URLSearchParams(window.location.search);
  const existingSearchTerm = urlParams.get("searchTerm");
  if (existingSearchTerm) {
    formData.set("searchTerm", existingSearchTerm);
  }

  for (const [field, options] of Object.entries(config)) {
    const { isArray, customHandler } = options;

    if (customHandler && formData.get(field)) {
      customHandler(formData.get(field), searchParams);
      continue;
    }

    if (isArray && formData.get(field)) {
      formData.getAll(field).forEach((value) => {
        searchParams.append(field, value);
      });
      continue;
    }

    if (formData.get(field)) {
      searchParams.append(field, formData.get(field));
    }
  }

  const searchTerm = formData.get("searchTerm");
  if (searchTerm) {
    searchParams.append("searchTerm", searchTerm);
  }
  console.log(searchTerm);

  return searchParams;
}

async function fetchProducts(page = 1, query = {}) {
  try {
    const existingParams = new URLSearchParams(window.location.search);
    console.log("Search Params:", existingParams.toString());

    const searchParams = new URLSearchParams({
      ...Object.fromEntries(existingParams.entries()),
      ...query,
      page,
      limit: PAGE_SIZE,
    });

    const response = await fetch(`/products/api?${searchParams.toString()}`, {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    console.log("Search para:", searchParams.toString());
    updateURL(searchParams.toString());
    renderProducts(data.products);
    renderPagination(data.currentPage, data.totalPages, query);
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Failed to fetch products. Please try again.");
  }
}

const form = document.getElementById("searchForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const minRating = parseFloat(document.getElementById("minRating").value);
  const maxRating = parseFloat(document.getElementById("maxRating").value);
  if (minRating > maxRating) {
    alert("Min rating must be less than or equal to Max rating.");
    return;
  }
  const searchParams = generateSearchParams(config);
  const queryString = searchParams.toString();
  console.log("Query Params:", queryString);
  updateURL(queryString);
  await fetchProducts(1, Object.fromEntries(searchParams.entries()));
});

const sortSelect = document.getElementById("sort");
sortSelect.addEventListener("change", async (e) => {
  const searchParams = generateSearchParams(config);
  const queryString = searchParams.toString();
  console.log("Query Params:", queryString);
  //const params = Object.fromEntries(searchParams.entries());
  //console.log("Pagination Params:", params);
  updateURL(queryString);
  await fetchProducts(1, Object.fromEntries(searchParams.entries()));
});

// Function to render products dynamically
function renderProducts(products) {
  const productGrid = document.querySelector(".product-container");
  const productsContainer = document.getElementById("products");
  productGrid.innerHTML = "";

  const existingEmptyMessage =
    productsContainer.querySelector(".empty-message");
  if (existingEmptyMessage) {
    existingEmptyMessage.remove();
  }

  if (products.length === 0) {
    const emptyHtml = `
      <div class="empty-message">There is no matched product. Please try with another filter.</div>
    `;
    productsContainer.innerHTML += emptyHtml;
    return;
  }

  products.forEach((product) => {
    const productHTML = `
			<div class="bg-white shadow rounded overflow-hidden group">
				<div class="relative">
					<a href="/products/${product.productId}">
						<img src="${
              product.productImages[0]?.url ||
              "/assets/images/products/product1.jpg"
            }" alt="${product.productName}" class="w-full" />
					</a>
				</div>
				<div class="pt-4 pb-3 px-4 w-full">
					<a href="/products/${product.productId}">
						<h4 class="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
								${product.productName}
						</h4>
					</a>
					<div class="flex items-baseline mb-1 space-x-2">
						<p class="text-xl text-primary font-semibold">$${product.currentPrice}</p>
						<p class="text-sm text-gray-400 line-through">$${product.originalPrice}</p>
					</div>
					<div class="flex items-center">
						<div class="flex gap-1 text-sm text-yellow-400">
							<span><i class="fa-solid fa-star"></i></span>
							<span>${product.rating}</span>
						</div>
					</div>
				</div>
			</div>`;
    productGrid.innerHTML += productHTML;
  });
}

function renderPagination(currentPage, totalPages, query) {
  const paginationContainer = document.querySelector(".pagination-container");
  paginationContainer.innerHTML = ""; // Clear existing pagination

  const queryParams = new URLSearchParams(query);

  if (currentPage > 1) {
    queryParams.set("page", currentPage - 1);
    paginationContainer.innerHTML += `
			<a href="?${queryParams.toString()}"
				class="pagination-link px-4 py-2 bg-gray-300 text-gray-800 rounded">Previous</a>
		`;
  }

  for (let i = 1; i <= totalPages; i++) {
    queryParams.set("page", i);
    paginationContainer.innerHTML += `
			<a href="?${queryParams.toString()}"
					class="pagination-link px-4 py-2 rounded ${
            currentPage === i
              ? "bg-primary text-white"
              : "bg-gray-300 text-gray-800"
          }">${i}
			</a>
		`;
  }

  if (currentPage < totalPages) {
    queryParams.set("page", currentPage + 1);
    paginationContainer.innerHTML += `
            <a href="?${queryParams.toString()}"
               class="pagination-link px-4 py-2 bg-gray-300 text-gray-800 rounded">Next</a>`;
  }

  setupPaginationListeners(query);
}

function setupPaginationListeners(query) {
  const paginationLinks = document.querySelectorAll(".pagination-link");
  paginationLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const url = new URL(e.target.href);
      //const params = Object.fromEntries(url.searchParams.entries());
      //console.log("Pagination Params:", params);
      updateURL(url);
      const page = parseInt(
        Object.fromEntries(url.searchParams.entries()).page
      );
      await fetchProducts(page, Object.fromEntries(url.searchParams.entries()));
    });
  });
}
