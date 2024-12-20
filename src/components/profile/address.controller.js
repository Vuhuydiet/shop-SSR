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
    const addresses = await this.addressService.getUserAddresses(req.user.id);
    return res.render("pages/profileAddress", {
      user: req.user,
      addresses,
    });
  };

  /**
   * @description Gets all addresses for a user
   */
  getUserAddresses = async (req, res, next) => {
    const addresses = await this.addressService.getUserAddresses(req.user.id);
    return res.send({
      ok: true,
      message: "Addresses retrieved",
      data: { addresses },
    });
    // return new OKResponse("Addresses retrieved", { addresses }).send(res);
  };

  getAddAddressPage = async (req, res, next) => {
    return res.render("pages/addressForm", {
      user: req.user,
      address: null,
    });
  };

  /**
   * @description Adds a new address
   */
  postAddAddress = async (req, res, next) => {
    const address = await this.addressService.addAddress(
      req.user.userId,
      req.body
    );
    return new CreatedResponse("Address added", { address }).send(res);
  };

  getUpdateAddressPage = async (req, res, next) => {
    const address = await this.addressService.getAddressById(
      parseInt(req.params.addressId)
    );
    return res.render("pages/addressForm", { user: req.user, address });
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
    await this.addressService.deleteAddress(parseInt(req.params.addressId));
    return new NoContentResponse("Deleted").send(res);
  };
}

const addressController = new AddressController(AddressService);

module.exports = addressController;
