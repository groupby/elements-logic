import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';

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

getSaytResults() {
  let clientTarget = 'cvshealth-cors';
  let groupbyAPI = `https://${clientTarget}.groupbycloud.com/api/v1/search`;

  // return fetch(groupbyAPI).then((res: any) => {
  //   console.log('>>> res', res);
  //   return res;
  // })

  return Promise.resolve({});
}


// method that when invoked returns the response

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
