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
    const response = await fetch(`/profile/address/${addressId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete address");
    return response.json();
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

    data.addresses.forEach((address) => {
      const clone = template.content.cloneNode(true);

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
            const response = await fetch(
              `/profile/address/delete/${address.addressId}`,
              {
                method: "POST",
              }
            );

            if (response.ok) {
              clone.firstElementChild.remove();
            } else {
              throw new Error("Failed to delete address");
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
