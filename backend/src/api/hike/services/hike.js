'use strict';

/**
 * hike service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::hike.hike');
