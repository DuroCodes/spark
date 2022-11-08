import { Ok, Err } from 'ts-results-es';
import { Controller } from '../types/plugin';

export const controller: Controller = {
  next: () => Ok.EMPTY,
  stop: () => Err.EMPTY,
};
