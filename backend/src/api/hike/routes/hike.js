'use strict';

/**
 * hike router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::hike.hike');
