import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { Sayt } from 'sayt';

export default class SaytPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt-plugin',
      depends: [],
    };
  }

  core: SaytPlugin;
  // exposedValue: TBD

  // A TypeScript Module that:
  //
  // Exposes methods that will take in request objects and then return relevant Search-data based around the request sent in.
  //
  // Can be consumed by 3rd-party application.
  //
  // Can be used in the browser, and on the server (ie. within a Node-based environment).
  //
  // Can be transpiled down to 'vanilla' JavaScript.
  //
  // A series of tests that encompass the functionality of a Data-source plugin.


// driver on front end makes request

// method to take in request obj possible helper method
// buildRequest(data) {
//
// }

// method that wraps the api
// method that when invoked returns the response
//  -- take in request objs
// -- return rel data

// make sayt call
getSaytResults() {
  let clientTarget = 'cvshealth-cors';
  let groupbyAPI = `https://${clientTarget}.groupbycloud.com/api/v1/search`;

  let autoConfig = {
    // language: en,
    numSearchTerms: 20,
    // numNavigations: 10,
    // sortAlphabetically: boolean,
    // fuzzyMatch: boolean,
  }

  let config = {
    subdomain: clientTarget,
    collection: 'ProductsLeaf',
  }

  let sayt = new Sayt(config);

  return sayt.autocomplete('red', autoConfig)
  // return fetch(groupbyAPI).then((res: any) => {
  //   console.log('>>> res', res);
  //   return res;
  // })
}


  constructor() {
    console.log('yo shawna')
  }
  // recieve obj through which other plugins can be accessed but cannot access at this time?
  register() {

  }
  //init lifecycle - do as much setup as possible
  init() {

  }
  // can safely use other plugins
  ready() {

  }
}
