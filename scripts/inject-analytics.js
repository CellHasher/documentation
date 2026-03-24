/**
 * inject-analytics.js  —  SUPERSEDED
 *
 * This script has been replaced by the two-step pipeline:
 *
 *   1. scripts/generate-config.js  (pre-build, writes analytics-config.js)
 *   2. honkit-plugin-add-js        (injects scripts during honkit build)
 *
 * The old post-build HTML injection approach is no longer used.
 * This file is kept only as a reference and is NOT called by npm run build.
 *
 * To manually regenerate docs/assets/js/analytics-config.js run:
 *   node scripts/generate-config.js
 */

'use strict';

console.warn(
  '[inject-analytics] This script is no longer part of the build pipeline.\n' +
  '  Use: node scripts/generate-config.js  (pre-build config generation)\n' +
  '  See: book.json → pluginsConfig.add-js  (script injection via plugin)'
);
