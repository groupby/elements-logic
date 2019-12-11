import { AssertTypesEqual, expect } from '../../utils';
import {
  quickStart as quickStartExport,
  QuickStartOptions as QuickStartOptionsExport,
} from '../../../src';
import quickStart, { QuickStartOptions } from '../../../src/quick-start';

describe('Entry point', () => {
  it('should export the quickStart function', () => {
    expect(quickStartExport).to.equal(quickStart);
  });

  it('should export the QuickStartOptions interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<QuickStartOptions<{}>, QuickStartOptionsExport<{}>> = true;
  });
});
