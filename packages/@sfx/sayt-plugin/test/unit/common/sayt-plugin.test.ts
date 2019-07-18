import { expect, sinon, stub } from '../../utils';
import SaytPlugin from '../../../src/sayt-plugin';
import * as SaytPackage from 'sayt';

describe('SaytPlugin', () => {
  let saytPlugin: any;

  beforeEach(() => {
    saytPlugin = new SaytPlugin();
  });

  describe('metadata getter', () => {
    it('should have the name `sayt`', () => {
      expect(saytPlugin.metadata.name).to.equal('sayt');
    });

    it('should not specify any dependencies', () => {
      expect(saytPlugin.metadata.depends).to.deep.equal([]);
    });
  });

  describe('constructor()', () => {
    it('should create a new instance of Sayt with options', () => {
      const saytInstance = { a: 'a' };
      const Sayt = stub(SaytPackage, 'Sayt').returns(saytInstance);
      const options: any = { b: 'b' };
      saytPlugin = new SaytPlugin(options);

      expect(Sayt).to.be.calledWith(options);
      expect(Sayt.calledWithNew()).to.be.true;
      expect(saytPlugin.sayt).to.equal(saytInstance);
    });
  });

  describe('register()', () => {
    it('should return the sayt instance', () => {
      const saytInstance = saytPlugin.sayt = { a: 'a' };
      const registerReturnValue = saytPlugin.register();

      expect(registerReturnValue).to.equal(saytInstance);
    });
  });
});
