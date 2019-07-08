import { expect, sinon, spy, stub } from '../../utils';
import SaytPlugin from '../../../src/sayt-plugin';

describe('SaytPlugin', () => {
  let saytPlugin: any;

  beforeEach(() => {
    saytPlugin = new SaytPlugin();
  });

  describe('getSaytResults', () => {
    it('should return true', () => {
      expect(saytPlugin.getSaytResults()).to.be.true;
    })
  })
});
