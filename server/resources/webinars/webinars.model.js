'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webinarSchema = new Schema(
    {
        title: String,
        webinarMode: {
            type: String,
            enum: ['free', 'paid'],
        },
        webinarDate: Date,
        time: String,
        country: String,
        webinarLink: {
            type: String,
            required: 'URL can\'t be empty',
            unique: true
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
        toObject: {
            transform: function (doc, ret) {
                delete ret.id;
                delete ret.__v;
            },
        },
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.__v;
                delete ret.id;
            },
        },
    }
);

class Webinar { }
webinarSchema.loadClass(Webinar);

module.exports = mongoose.model('Webinar', webinarSchema);
