import { chai, sinon } from './utils';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(sinonChai);
chai.use(chaiAsPromised);

afterEach(() => {
  sinon.restore();
});
