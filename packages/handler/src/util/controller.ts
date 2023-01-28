import { Ok, Err } from 'ts-results-es';
import { Controller } from '../types/plugin';

/**
 * Controller for plugins.
 * Controller.next() -> continues plugin execution.
 * Controller.stop() -> stops plugin execution.
 */
export const controller: Controller = {
  /**
   * Continues plugin execution, runs the next plugin.
   */
  next: () => Ok.EMPTY,
  /**
   * Stops plugin execution, doesn't run the next plugin.
   */
  stop: () => Err.EMPTY,
};
