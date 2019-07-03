/**
 * This test comment _supports_ [Markdown and other fun stuff](https://typedoc.org/guides/doccomments/)
 */
const testObj = {
  label: 'test text',
  number: 6,
}

export const testFunc = (data: DummyInterface) => {
  return exports.getLabel(data).toUpperCase();
}

export const getLabel = (data: DummyInterface) => {
  return data.label;
}

export interface DummyInterface {
  label: string;
  number: number;
}
