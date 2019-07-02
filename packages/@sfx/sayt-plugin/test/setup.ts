import { sinon } from './utils';

afterEach(() => {
  console.error('in after each');
  sinon.restore();
});
