import { equals, complement } from 'ramda';

export const notEquals = complement(equals);
