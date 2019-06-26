/**
 * This test comment _supports_ [Markdown and other fun stuff](https://typedoc.org/guides/doccomments/)
 */
const testObj = {
  label: 'test text',
}

export const testFunc = (text: DummyInterface) => {
  console.log(`I am logging out ${ text.label }`);
  return text.label;
}

testFunc(testObj);

export interface DummyInterface {
  label: string;
}
