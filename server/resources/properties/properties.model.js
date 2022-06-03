'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');


const propertySchema = new Schema(
  {
    name: {
      type: String,
      index: true,
    },
    isCRMID: String,
    mostPopular: Boolean,
    providerAutomated: Boolean,
    provider: String,
    isNominated: Boolean,
    isShortTerm: { type: Boolean, default: false },
    isSoldOut: Boolean,
    description: String,
    baseCurrencyCode: String, //Currency code for all the rates
    address: String,
    videoUrl: [String],
    tourlink: [String],
    citySlug: String,
    countrySlug: String,
    minPrice: Number,
    city: String,
    cityId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    country: String,
    neighbourhood: String,

    location: {
      type: Array, // [<longitude>, <latitude>]
      index: '2dsphere', // create the geospatial index
      default: [],
    }, //Legacy point: longitude, latitude

    type: {
      // PBSA, APARTMENT
      type: String,
      enum: ['PBSA', 'APARTMENT'],
      required: true,
      index: true,
    },
    totalBeds: Number,
    cancellationPolicy: String,
    cancellationPolicySmall: String,
    postcode: String,
    guarantorRequired: Boolean,
    isCampaignCodeApplicable: Boolean,
    rating: Number, // Rating of the city (entered manually by the ops team)

    //??BUSINESS??: How is distanceFromCityCenter calculated
    distanceFromCityCenter: Number, // In kms, Kept as number so that it can be converted to other metric units easily,
    // features: {
    //   amenities: [String], //Searchable features
    //   rentIncludes: [String],
    //   safetyAndSecurity: [String],
    // },
    propertyFeatures: [], //Searchable features
    enabled: {
      type: Boolean,
      default: false,
      index: true,
    },

    isSuggested: {
      type: Boolean,
      default: false,
      index: true,
    },
    listingOrder: {
      type: Number,
      default: 999,
    },
    thumbnail: {
      url: String,
      description: String,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    offers: [
      // Any ongoing offers for the property, e.g Cashbacks, Early bird offer etc.
      {
        info: { type: String, },
        message: { type: String, },
        validTill: Date,
        price: String,
      },
    ],

    meta: {
      title: String,
      imageUrl: String,
      heading: String,
      subheading: String,
      keywords: String,
      description: String,
    },

    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
        },
        url: String,
        description: String,
      },
    ],

    // ROOMS IN THE PROPERTIES
    rooms: [
      //STUDIO,
      {
        category: {
          type: String,
          index: true,
        }, //Studio/Ensuite/Apartment/Shared/Houses/Service Apartments
        types: [
          // GOLD, SILVER, BRONZE // NORMAL,SUPERIOR, PREMIUM
          {
            amenities: [],
            tourlink: String,
            videos: [],
            stuRentsPropertyId: String,
            isNominated: Boolean,
            title: String,
            area: String,
            description: String,
            offers: [
              {
                info: { type: String, },
                message: { type: String, },
                validTill: Date,
              },
            ],
            areaUnit: String,
            bedrooms: Number,
            bathrooms: Number,
            dualOccupancy: Boolean,
            enabled: { type: Boolean, default: true },
            images: [
              {
                url: String,
                description: String,
                isFeatured: Boolean,
              },
            ],
            rates: [
              {
                allocatedRooms: Number,
                tenancy: String,
                enabled: { type: Boolean, default: true },
                discountedPrice: Number,
                checkInDate: Date,
                checkoutDate: Date,
                providerAvailability: String,
                CRMID: String,
                price: Number, //Price per price Unit eg 213 GBP/week
                priceUnit: String, //week/month etc
                rateProvider: String,
                providerId: String,
                deleteIt: Boolean,
                updatedAt: Date,
                providerPrice: Number,
                providerExtraCharges: Number,
                checkInCheckoutFlexibility: String,
              },
            ],
          },
        ],
      },
    ],
    // nearbyUniversities: [
    //   {
    //     name: String,
    //     cityId: Schema.Types.ObjectId,
    //     city: String,
    //     country: String,
    //     slug: String,
    //     hasCampus: Boolean,
    //     placeId: String,
    //     campus: [
    //       {
    //         lat: Number,
    //         lng: Number,
    //         slug: String,
    //         isMainCampus: Boolean,
    //         name: String,
    //         transit: {
    //           walking: String,
    //           driving: String,
    //           public: String,
    //           distance: String,
    //         },
    //       },
    //     ],
    //   },
    // ],
    bookingProcedure: String,
    whatWeLove: String,
    ulPaymentConditions: String,
    activeRateProvider: String,
    availableServiceProvider: Array,
    tags: Array,
    landlordId: String,
    itwId: String,
    iQId: String,
    floorCount: Number,
    paymentConfig: {
      feeRule: {
        type: String,
        default: 'provider',
      },
      tenancyPeriod: Number,
      deposit: Number,
      paymentChargeType: String,
      paymentCharge: Number,
      applicationCharge: Number,
    },
    soldType: {
      type: String,
      default: 'room',
      enum: ['entire', 'room', 'both'],
    },
    entire: {
      price: String,
      tenancy: String,
      checkIn: Date,
      checkOut: Date,
      total: String,
      providerAvailability: String,
      offers: [
        {
          message: String,
          info: String,
          validTill: Date,
        },
      ],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'cmsusers',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    toJSON: {
      transform: function (doc, ret) {
        // if (!ret.paymentConfig) {
        //   ret.paymentConfig = {};
        // }
        ret.propertyId = ret._id;
        // delete ret.location;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

class Property { }

propertySchema.post('find', (result, next) => {
  result.map((foundRecord) => {
    foundRecord.propertyId = foundRecord._id;
    delete foundRecord._id;
    delete foundRecord.__v;
  });
  next();
});

propertySchema.loadClass(Property);
propertySchema.plugin(URLSlugs('name', { field: 'slug' }));

propertySchema.post('findOneAndUpdate', async function (result) {
  await mongoose.models['PropertyHistory'].create({
    operation: 'update',
    d: result._doc,
    propertyId: result._doc._id,
    createdBy: result._doc.updatedBy,
    createdAt: Date.now(),
  });
});

module.exports = mongoose.model('Property', propertySchema);
