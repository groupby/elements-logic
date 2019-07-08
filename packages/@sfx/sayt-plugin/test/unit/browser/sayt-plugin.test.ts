import { expect, sinon, spy, stub } from '../../utils';
import SaytPlugin from '../../../src/sayt-plugin';

describe('SaytPlugin', () => {
  let saytPlugin: any;

  beforeEach(() => {
    saytPlugin = new SaytPlugin();
  });

  describe('getSaytResults', () => {
    it('should return true', () => {
      return saytPlugin.getSaytResults()
        .then(res => {
          console.log('>>> res', res.result)
          expect(res).to.equal(false);
        })
    });
  });
});
// what type of thing - json object
//it is fetching against an edpoint  -res code
