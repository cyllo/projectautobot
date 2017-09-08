import { merge } from 'ramda';

import { GlobalQueryFilters, PaginationParams } from '../../models';

export const convertToGlobalQueryFilters = ({ next = 1, current, previous }: PaginationParams, params = {}): GlobalQueryFilters => {
  let filter;

  if (previous) {
    filter = { before: current || 0, last: previous };
  } else if (current) {
    filter = { after: current, first: next };
  } else {
    filter = { first: next };
  }

  return merge(params, filter);
};

export const convertToGlobalQueryLatestFilters = ({ next = 1, current, previous }: PaginationParams, params = {}): GlobalQueryFilters => {
  let filter;

  if (previous) {
    filter = { after: current || 0, first: next };
  } else if (current) {
    filter = { before: current, last: next };
  } else {
    filter = { last: next };
  }

  return merge(params, filter);
};

