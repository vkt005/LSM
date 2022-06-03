/** @format */

'use strict';

const BaseController = require('../../lib/base.controller');
const PropertiesService = require('./properties.service');

class PropertiesController extends BaseController {
  constructor(apiRouter, basePath) {
    super(apiRouter, basePath);
    this.registerRoutes();
  }
  registerRoutes() {
    this.router.get(
      `${this.basePath}`,
      this.handleAsyncErrors(this.getProperties),
    );
    this.router.get(
      `${this.basePath}/options-list`,
      this.handleAsyncErrors(this.getAllPropertiesOptionsList),
    );
    this.router.post(
      `${this.basePath}`,
      this.handleAsyncErrors(this.createProperty),
    );
    this.router.get(
      `${this.basePath}/:propertyId`,
      this.handleAsyncErrors(this.getPropertyDetails),
    );
   
    this.router.post(
      `${this.basePath}/report`,
      this.handleAsyncErrors(this.getPropertiesByFilter),
    );
    this.router.post(
      `${this.basePath}/update-order`,
      this.handleAsyncErrors(this.updateOrderOfProperties),
    );
  
  }

  async getProperties(req, res) {
    let properties = await PropertiesService.getAllProperties();

    properties = properties.map(x => {
      if (x.enabled == true) {
        x.enabled = 'Active';
      } else {
        x.enabled = 'Inactive';
      }
      let websiteUrl =
        process.env.NODE_ENV == 'production'
          ? 'https://www.universityliving.com'
          : 'https://beta.universityliving.com';
      x.websiteUrl = `${websiteUrl}/${x.countrySlug}/${x.citySlug}/${x.slug}`;
      return x;
    });

    res.send(properties);
  }

  async getAllPropertiesOptionsList(req, res) {
    const {
      query: { search },
    } = req;
    const properties = await PropertiesService.getAllPropertiesOptions(search);
    res.send(properties);
  }


  async getPropertiesByFilter(req, res) {
    let items = req.body;
    let properties = await PropertiesService.getAllPropertiesByFilter(items);
    res.send(properties);
  }

  async createProperty(req, res) {
    const { nominationChanges } = req.query;
    const data = await PropertiesService.findOneAndUpdate(
      req.body,
      nominationChanges,
      req.user
    );
    res.status(200).send(data);
  }

  async getPropertyDetails(req, res) {
    let { propertyId } = req.params;
    let propertyDetails = await PropertiesService.getPropertyDetailsBySlug({
      propertyId,
    });
    res.send(propertyDetails);
  }

  async updateOrderOfProperties(req, res) {
    const {
      body: { data },
      user
    } = req;
    await PropertiesService.updatePropertiesOrder(data, user);
    res.send(true);
  }

  

  
}

module.exports = PropertiesController;
