import { expect, sinon, spy, stub } from '../../utils';
import SaytPlugin from '../../../src/sayt-plugin';
import * as SaytPackage from 'sayt';

describe('SaytPlugin', () => {
  let saytPlugin: any;

  beforeEach(() => {
    saytPlugin = new SaytPlugin();
  });

  describe('metadata', () => {
    it('sayt should not have a dependancy', () => {
      expect(saytPlugin.metadata.depends).to.deep.equal([]);
    });
  });

  describe('constructor', () => {
    it('should combine default and given options', () => {
      const Sayt = stub(SaytPackage, 'Sayt');

    });
  });

  describe('register()', () => {
    it('should register and return a sayt instance', () => {
      const saytInstance = saytPlugin.sayt = { a: 'a' };
      const registerReturnValue = saytPlugin.register();

      expect(registerReturnValue).to.equal(saytInstance);
    });
  });
});
