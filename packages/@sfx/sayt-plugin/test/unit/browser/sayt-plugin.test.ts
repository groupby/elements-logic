import { expect, sinon, spy, stub } from '../../utils';
import SaytPlugin from '../../../src/sayt-plugin';

describe('SaytPlugin', () => {
  let saytPlugin: any;

  beforeEach(() => {
    saytPlugin = new SaytPlugin();
  });

  describe('getSayt', () => {
    it('should set a given client target into sayt instance', () => {
      const sayt = saytPlugin.getSayt('example-client');

      expect(sayt.config.subdomain).to.equal('example-client');
    });
  });


});
