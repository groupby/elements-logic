import { expect, sinon, stub } from '../../utils';
import SearchDriverPlugin from '../../../src/search-driver-plugin';
import * as SearchDriverPackage from 'sayt';

describe('SearchDriverPlugin', () => {
  let searchDriverPlugin: any;

  beforeEach(() => {
    searchDriverPlugin = new SearchDriverPlugin();
  });

  describe('metadata getter', () => {
    it('should have the name `sayt`', () => {
      expect(searchDriverPlugin.metadata.name).to.equal('search-driver');
    });

    it('should not specify any dependencies', () => {
      expect(searchDriverPlugin.metadata.depends).to.deep.equal([
        'dom_events',
        'search_data_source',
      ]);
    });
  });

  describe('constructor()', () => {
    // it('should create a new instance of Sayt with options', () => {
    //   const saytInstance = { a: 'a' };
    //   const Sayt = stub(SearchDriverPackage, 'Sayt').returns(saytInstance);
    //   const options: any = { b: 'b' };
    //   searchDriverPlugin = new searchDriverPlugin(options);

    //   expect(Sayt).to.be.calledWith(options);
    //   expect(Sayt.calledWithNew()).to.be.true;
    //   expect(searchDriverPlugin.sayt).to.equal(saytInstance);
    // });
  });

  describe('register()', () => {
    // it('should return the sayt instance', () => {
    //   const saytInstance = searchDriverPlugin.sayt = { a: 'a' };
    //   const registerReturnValue = searchDriverPlugin.register();

    //   expect(registerReturnValue).to.equal(saytInstance);
    // });
  });
});
