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
      return new OKResponse("Addresses retrieved", { addresses }).send(res);
    } catch (error) {
      next(new InternalServerError("Failed to fetch addresses", 500));
    }
  };

  /**
   * @description Adds a new address
   */
  addAddress = async (req, res, next) => {
    try {
      const address = await this.addressService.addAddress(
        req.user.id,
        req.body
      );
      return new CreatedResponse("Address added", { address }).send(res);
    } catch (error) {
      next(new InternalServerError("Failed to add address", 500));
    }
  };

  /**
   * @description Updates an existing address
   */
  updateAddress = async (req, res, next) => {
    try {
      const address = await this.addressService.updateAddress(
        parseInt(req.params.addressId),
        req.body
      );
      return new OKResponse("Address updated", { address }).send(res);
    } catch (error) {
      next(new InternalServerError("Failed to update address", 500));
    }
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
