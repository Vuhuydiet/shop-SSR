module.exports = {
  getUserProfile: (req, res) => {
    res.render("pages/profile", {
      user: req.user,
    });
  },

  getUserAddress: (req, res) => {
    const addresses = [
      {
        addressId: 1,
        userId: 1,
        country: "Vietnam",
        city: "Ho Chi Minh",
        district: "Tan Binh",
        ward: "15",
        phoneNumber: "0123456789",
        detailAddress: "123 Nguyen Van Linh",
        recipientName: "John Doe",
      },
    ];
    res.render("pages/profileAddress", {
      addresses: addresses,
    });
  },
};
