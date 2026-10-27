/**
 * Reports Feature Constants
 * Extends global definitions with report-form specific constraints.
 */

import {
  REPORT_STATUS,
  SEVERITY_LEVELS,
  SEVERITY_MIN,
  SEVERITY_MAX,
} from '../../constants/index.js';

export { REPORT_STATUS, SEVERITY_LEVELS, SEVERITY_MIN, SEVERITY_MAX };

export const MAX_DESCRIPTION_LENGTH = 280;

export const DEFAULT_REPORT_DRAFT = Object.freeze({
  coordinates: null,
  severity: 3,
  description: '',
});
