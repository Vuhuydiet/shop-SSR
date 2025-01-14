async function fetchProvinces() {
  const citySelect = document.getElementById("city");

  try {
    const response = await fetch("https://vapi.vnappmob.com/api/v2/province/");
    const data = await response.json();

    data.results.forEach((province) => {
      const option = document.createElement("option");
      option.value = province.province_id;
      option.textContent = province.province_name;
      citySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching provinces:", error);
  }
}

async function fetchDistricts(provinceId) {
  const districtSelect = document.getElementById("district");

  try {
    const response = await fetch(
      `https://vapi.vnappmob.com/api/v2/province/district/${provinceId}`
    );
    const data = await response.json();

    districtSelect.innerHTML = '<option value="">Select District</option>';
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
}

async function fetchWards(districtId) {
  const wardSelect = document.getElementById("ward");

  try {
    const response = await fetch(
      `https://vapi.vnappmob.com/api/v2/province/ward/${districtId}`
    );
    const data = await response.json();

    wardSelect.innerHTML = '<option value="">Select Ward</option>';
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
}

document.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("city");
  const districtSelect = document.getElementById("district");
  const wardSelect = document.getElementById("ward");

  fetchProvinces();

  citySelect.addEventListener("change", async () => {
    const provinceId = citySelect.value;
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
});
