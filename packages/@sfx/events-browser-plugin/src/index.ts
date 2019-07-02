/**
 * This test comment _supports_ [Markdown and other fun stuff](https://typedoc.org/guides/doccomments/)
 */
const testObj = {
  label: 'test text',
}

const testFunc = (text: TestInterface) => {
  console.log(`I am logging out ${text.label}`);
}

testFunc(testObj);

interface TestInterface {
  label: string;
}

/*
 This is the events plugin designed for a browser based environment
 It needs to include the following methods:
  Listen (aka a register listener method).
     The listen method should accept the following parameters:
      type: this parameter informs the method of the event that needs to be listened for.
      name: An alternative parameter to type, it informs the method of the name of the event.
      callback: This is a function that informs the listen method what should be registered to be invoked in response to "hearing" the provided event.
  Unlisten (aka an unregister listener method).
    The unlisten method should accept the following parameters:
      type: this parameter informs the method of event needs to be unregistered.
      name: An alternative parameter to type, it informs the method of the name of the event to unregister.
      callback: This is the event handler function that was meant to handle the event that is being removed.
  Dispatch (aka an event dispatching method).
    The dispatch method should accept the following parameters:
      type: this parameter informs the method of the event that needs to be dispatched.
      name: An alternative parameter to type, it informs the method of the name of the event.
      payload: The information meant to be sent along with the event that is being dispatched.
    Note: the Dispatch method will be dispatching customEvents in order to attach custom data to any given event.
*/
