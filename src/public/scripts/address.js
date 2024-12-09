const addressAPI = {
  async getAddresses() {
    const response = await fetch("/profile/api/address");
    console.log(response);
    if (!response.ok) throw new Error("Failed to fetch addresses");
    return response.json();
  },

  async addAddress(addressData) {
    const response = await fetch("/profile/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error("Failed to add address");
    return response.json();
  },

  async updateAddress(addressId, addressData) {
    const response = await fetch(`/profile/address/${addressId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error("Failed to update address");
    return response.json();
  },

  async deleteAddress(addressId) {
    return await fetch(`/profile/api/address/${addressId}`, {
      method: "DELETE",
    });
  },
};

async function loadAddresses() {
  const container = document.getElementById("address-container");
  const loadingState = document.getElementById("loading-state");
  const template = document.getElementById("address-template");

  try {
    container.innerHTML = loadingState.outerHTML;
    const { data } = await addressAPI.getAddresses();
    container.innerHTML = "";

    if (data.addresses.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4">
          No addresses found. <a class="text-red-500" href="/profile/address/add">Add one now</a>.
        </div>
      `;
      return;
    }

    data.addresses.forEach((address) => {
      const clone = template.content.cloneNode(true);
      const addressElement = clone.firstElementChild;

      clone.querySelector("[data-recipient]").textContent =
        address.recipientName;
      clone.querySelector("[data-phone]").textContent = address.phoneNumber;
      clone.querySelector("[data-detail]").textContent = address.detailAddress;
      clone.querySelector(
        "[data-location]"
      ).textContent = `${address.ward}, ${address.district}, ${address.city}, ${address.country}`;

      clone.querySelector("[data-edit]").addEventListener("click", () => {
        window.location.href = `/profile/address/edit/${address.addressId}`;
      });

      clone
        .querySelector("[data-delete]")
        .addEventListener("click", async () => {
          if (!confirm("Are you sure you want to delete this address?")) return;

          try {
            const response = await addressAPI.deleteAddress(address.addressId);
            
            if (response.status === 204) {
              alert("Address deleted successfully");
              addressElement.remove();
              return;
            }
          } catch (error) {
            alert("Error deleting address: " + error.message);
          }
        });

      container.appendChild(clone);
    });
  } catch (error) {
    container.innerHTML = `
      <div class="text-center py-4 text-red-500">
        Failed to load addresses. Please try again later.
      </div>
    `;
    console.error("Error loading addresses:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAddresses);
