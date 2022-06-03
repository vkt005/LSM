'use strict';
const mongoose = require('mongoose');
const BaseController = require('../../lib/base.controller');
const Webinars = mongoose.model('Webinar');
const moment = require("moment")
class WebinarController extends BaseController {
    constructor(apiRouter, basePath) {
        super(apiRouter, basePath);
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get(
            `${this.basePath}`,
            this.handleAsyncErrors(this.getAllWebinars)
        );
        this.router.post(
            `${this.basePath}`,
            this.handleAsyncErrors(this.saveWebinar)
        );
        this.router.get(
            `${this.basePath}/:id`,
            this.handleAsyncErrors(this.getWebinar)
        );
    }

    async saveWebinar(req, res) {
        const { title, webinarMode, webinarDate, time, country, webinarLink } = req.body
        const webinarDetails = new Webinars({
            title,
            webinarMode,
            webinarDate: new Date(moment(webinarDate, 'YYYY-MM-DD').format()),
            time,
            country,
            webinarLink
        })
        await webinarDetails.save()
        res.send(webinarDetails)

    }
    async getWebinar(req, res) {
        const { id } = req.params;
        let webinar = await Webinars.findOne({ _id: id })
        res.send(webinar);
    }
    async getAllWebinars(req, res) {
        let webinarList = await Webinars.find().sort({ createdAt: -1 });
        const total = await Webinars.count(webinarList)
        res.send({ webinarList, total });
    }


}

module.exports = WebinarController;