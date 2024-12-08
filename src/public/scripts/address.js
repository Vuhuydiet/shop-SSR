const addressAPI = {
  async getAddresses() {
    const response = await fetch("/profile/address");
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
  try {
    const { data } = await addressAPI.getAddresses();
    const addressContainer = document.querySelector(".sm\\:divide-y");
    const template = document.getElementById("address-template");

    addressContainer.innerHTML = "";

    data.addresses.forEach((address) => {
      const clone = template.content.cloneNode(true);

      clone.querySelector("[data-recipient]").textContent =
        address.recipientName;
      clone.querySelector("[data-phone]").textContent = address.phoneNumber;
      clone.querySelector("[data-detail]").textContent = address.detailAddress;
      clone.querySelector(
        "[data-location]"
      ).textContent = `${address.ward}, ${address.district}, ${address.city}, ${address.country}`;

      clone
        .querySelector("[data-edit]")
        .addEventListener("click", () => editAddress(address.addressId));
      clone
        .querySelector("[data-delete]")
        .addEventListener("click", () => deleteAddress(address.addressId));

      clone.firstElementChild.dataset.addressId = address.addressId;

      addressContainer.appendChild(clone);
    });
  } catch (error) {
    console.error("Error loading addresses:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAddresses);
