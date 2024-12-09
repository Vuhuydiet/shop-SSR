const AddressService = require("./address.service");
const {
  OKResponse,
  CreatedResponse,
  NoContentResponse,
} = require("../../core/SuccessResponse");
const { InternalServerError } = require("../../core/ErrorResponse");

/**
 * @class AddressController
 * @description Handles all address-related requests
 */
class AddressController {
  constructor(addressService) {
    this.addressService = addressService;
  }

  /**
   * @description Renders the address management page
   */
  renderAddressPage = async (req, res, next) => {
    try {
      const addresses = await this.addressService.getUserAddresses(req.user.id);
      return res.render("pages/profileAddress", {
        user: req.user,
        addresses,
      });
    } catch (error) {
      next(new InternalServerError("Failed to load addresses", 500));
    }
  };

  /**
   * @description Gets all addresses for a user
   */
  getUserAddresses = async (req, res, next) => {
    try {
      const addresses = await this.addressService.getUserAddresses(req.user.id);
      return res.send({
        ok: true,
        message: "Addresses retrieved",
        data: { addresses },
      });
      // return new OKResponse("Addresses retrieved", { addresses }).send(res);
    } catch (error) {
      next(new InternalServerError("Failed to fetch addresses", 500));
    }
  };

  getAddAddressPage = async (req, res, next) => {
    try {
      return res.render("pages/addAddress", {
        user: req.user,
      });
    } catch (error) {
      next(new InternalServerError("Failed to fetch address", 500));
    }
  };

  /**
   * @description Adds a new address
   */
  postAddAddress = async (req, res, next) => {
      console.log(req.body);
      const address = await this.addressService.addAddress(
        req.user.userId,
        req.body
      );
      return new CreatedResponse("Address added", { address }).send(res);
  };

  /**
   * @description Updates an existing address
   */
  updateAddress = async (req, res, next) => {
      const address = await this.addressService.updateAddress(
        parseInt(req.params.addressId),
        req.body
      );
      return new OKResponse("Address updated", { address }).send(res);
  };

  /**
   * @description Deletes an address
   */
  deleteAddress = async (req, res, next) => {
    try {
      await this.addressService.deleteAddress(parseInt(req.params.addressId));
      return new NoContentResponse().send(res);
    } catch (error) {
      next(new InternalServerError("Failed to delete address", 500));
    }
  };
}

// Create instance with dependency injection
const addressController = new AddressController(AddressService);

module.exports = addressController;
