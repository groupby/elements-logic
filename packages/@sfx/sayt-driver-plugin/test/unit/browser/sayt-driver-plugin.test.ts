import { expect, sinon, spy, stub } from '../../utils';
import { SaytDriverPlugin } from '../../../src/index';
import { DomEventsPlugin } from '../../../../dom-events-plugin/src/index';

describe('Sayt Driver Plugin', () => {
  let Driver: any;

  beforeEach(() => {
    Driver = new SaytDriverPlugin();
    Driver.register({
      'dom_events': new DomEventsPlugin(),
      // 'sayt': new SaytPlugin({
      //   subdomain: 'cvshealth',
      //   https: true,
      // }),
      sayt: { autocomplete: (query, config, callback) => {
        return callback();
      }},
    });
  });

  describe.only('.register()', () => {
    beforeEach(() => {
      Driver = {};
    })
    it('should keep a reference to all registered plugins', () => {
      const Plugins = {
        a: () => 'a',
        b: () => true,
      }
      Driver = new SaytDriverPlugin();
      expect(Driver.core).to.be.undefined;
      Driver.register(Plugins);
      expect(Driver.core).to.deep.equal(Plugins);
    });
  });

  describe('.ready()', () => {
    let registerListener: any;
    beforeEach(() => {
      registerListener = spy(Driver.core['dom_events'], 'registerListener');
    });
    it('should register an event listener for receiving sayt API requests', () => {
      Driver.ready();
      registerListener.getCall(0)
        .calledWith(Driver.saytDataEvent, Driver.fetchSaytData)
    });
  });

  describe('.unregister()', () => {
    let unregisterListener;
    beforeEach(() => {
      unregisterListener = spy(Driver.core['dom_events'], 'unregisterListener');
    });
    it('should unregister the sayt event listener', () => {
      Driver.unregister();
      expect(unregisterListener).to.have.been.calledWith(Driver.saytDataEvent, Driver.fetchSaytData);
    });
  });

  describe('.autocompleteCallback', () => {
    const response = {
      result: {
        searchTerms: [
          { value: 'a' , notValue: 'z' },
          { value: 'b' },
          { value: 'c' },
        ],
      },
    };
    it('should return an array of search terms strings from the sayt response', () => {
      expect(Driver.autocompleteCallback(undefined, response))
        .to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('.sendSaytAPIRequest()', () => {
    const saytDataPayload = {
      query: 'soap',
      collection: 'productsLeaf',
    };
    let autocompleteCallback;

    beforeEach(() => {
      autocompleteCallback = stub(Driver, 'autocompleteCallback');
    });
    it('should make a search call through the sayt client', () => {
      // console.log(Driver.core.sayt.autocomplete);
      const autocomplete = stub(Driver.core.sayt, 'autocomplete').returns(true);
      Driver.sendSaytAPIRequest(saytDataPayload);
      expect(autocomplete).to.be.calledWith(saytDataPayload.query, { collection: 'productsLeaf' }, autocompleteCallback);
    });
    it('should return the result of the Sayt API callback', () => {
      autocompleteCallback.returns(['a', 'b']);
      expect(Driver.sendSaytAPIRequest(saytDataPayload)).to.equal(autocompleteCallback());
    });
  });

  describe('.fetchSaytData()', () => {
    const query = {};
    let sendSaytAPIRequest;

    beforeEach(() => {
      sendSaytAPIRequest = stub(Driver, 'sendSaytAPIRequest')
    });
    it('should get a response from API request method', () => {
      Driver.fetchSaytData(query);
      expect(sendSaytAPIRequest).to.be.calledWith(query);
    });
    it('should dispatch the response through the events plugin', () => {
      const dispatch = stub(Driver.core['dom_events'], 'dispatchEvent');
      sendSaytAPIRequest.returns({ a: 'b' });
      const response = sendSaytAPIRequest();
      Driver.fetchSaytData(query);
      expect(dispatch).to.be.calledOnce;
      expect(dispatch.firstCall.args[1]).to.equal(response);
    });
  });
});
