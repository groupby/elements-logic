import * as sinonImport from 'sinon';
import * as chaiImport from 'chai';

declare var global: any;

export const sinon = global.sinon || sinonImport;
export const chai = global.chai || chaiImport;
export const expect = chai.expect;
export const stub = sinon.stub;
export const spy = sinon.spy;

// Interface S is the same as interface T if and only if they are assignable to each other.
// This type resolves to the literal type `true` if S = T and `false` if S != T.
export type AssertTypesEqual<S, T> = S extends T ? T extends S ? true : false : false;
