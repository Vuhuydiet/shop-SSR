document.addEventListener("DOMContentLoaded", () => {
  const provinceSelect = document.getElementById("city");
  const districtSelect = document.getElementById("district");
  const wardSelect = document.getElementById("ward");
  const detailAddressInput = document.getElementById("detailAddress");
  const addressForm = document.getElementById("address-form");

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://vapi.vnappmob.com/api/province/");
      const data = await response.json();
      data.results.forEach((province) => {
        const option = document.createElement("option");
        option.value = province.province_id;
        option.textContent = province.province_name;
        provinceSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(
        `https://vapi.vnappmob.com/api/province/district/${provinceId}`
      );
      const data = await response.json();
      data.results.forEach((district) => {
        const option = document.createElement("option");
        option.value = district.district_id;
        option.textContent = district.district_name;
        districtSelect.appendChild(option);
      });
      districtSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await fetch(
        `https://vapi.vnappmob.com/api/province/ward/${districtId}`
      );
      const data = await response.json();
      data.results.forEach((ward) => {
        const option = document.createElement("option");
        option.value = ward.ward_id;
        option.textContent = ward.ward_name;
        wardSelect.appendChild(option);
      });
      wardSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  provinceSelect.addEventListener("change", async () => {
    const provinceId = provinceSelect.value;
    districtSelect.innerHTML = '<option value="">Select District</option>';
    wardSelect.innerHTML = '<option value="">Select Ward</option>';
    wardSelect.disabled = true;

    if (provinceId) {
      await fetchDistricts(provinceId);
    } else {
      districtSelect.disabled = true;
    }
  });

  districtSelect.addEventListener("change", async () => {
    const districtId = districtSelect.value;
    wardSelect.innerHTML = '<option value="">Select Ward</option>';

    if (districtId) {
      await fetchWards(districtId);
    } else {
      wardSelect.disabled = true;
    }
  });

  detailAddressInput.addEventListener("input", () => {
    const detailAddress = detailAddressInput.value;

    const notFullySelected = provinceSelect.selectedIndex === 0 || districtSelect.selectedIndex === 0 || wardSelect.selectedIndex === 0;
    if (notFullySelected) {
      return;
    }
    const cityName = provinceSelect.options[provinceSelect.selectedIndex]?.text || "";
    const districtName = districtSelect.options[districtSelect.selectedIndex]?.text || "";
    const wardName = wardSelect.options[wardSelect.selectedIndex]?.text || "";
    const country = document.getElementById("country").value;

    const fullAddress = `${detailAddress}, ${wardName}, ${districtName}, ${cityName}, ${country}`;
    const addressPreview = document.getElementById("address-preview");
    addressPreview.textContent = fullAddress;
  });

  addressForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const countryInput = document.getElementById("country");
    countryInput.disabled = false;
    
    const cityName =
      provinceSelect.options[provinceSelect.selectedIndex].text;
    const districtName =
      districtSelect.options[districtSelect.selectedIndex].text;
    const wardName = wardSelect.options[wardSelect.selectedIndex].text;

    const formData = new FormData(addressForm);
    formData.set("city", cityName);
    formData.set("district", districtName);
    formData.set("ward", wardName);

    const data = Object.fromEntries(formData.entries());

    countryInput.disabled = true;

    const submitButton = document.getElementById("add-btn");
    const submitButtonStyle = submitButton.style;
    const disabledButtonStyle = "opacity: 0.5; cursor: not-allowed; background-color: grey;";
    submitButton.disabled = true;
    submitButtonStyle.cssText = disabledButtonStyle;
    
    
    try {
      console.log(data);
      const response = await fetch("/profile/api/address/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert("Address added successfully!");
        window.location.href = "/profile/address";
      } else {
        const errorData = await response.json();
        alert("Error adding address: " + errorData.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form: " + error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.style = submitButtonStyle;
    }
  });
  
  // Initial fetch of provinces
  fetchProvinces();
});

