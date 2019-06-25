import { use } from 'chai';
import { restore as sinonRestore } from 'sinon';
import * as sinonChai from 'sinon-chai';

use(sinonChai);

afterEach(() => {
  sinonRestore();
});
