/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */

import firebase from 'firebase/app';
import 'firebase/functions';
import { httpsCallable } from '../dist/functions';
import { default as TEST_PROJECT, functionsEmulatorPort } from './config';

const rando = (): string => Math.random().toString(36).substring(5);

describe('RxFire Functions', () => {
  let app: firebase.app.App;
  let functions: firebase.functions.Functions;

  beforeEach(() => {
    app = firebase.initializeApp(TEST_PROJECT, rando());
    functions = app.functions();
    functions.useEmulator('localhost', functionsEmulatorPort);
  });

  afterEach(() => {
    app.delete().catch();
  });

  describe('httpsCallable', () => {
      it('should work', (done: jest.DoneCallback) => {
        const string = rando();
        const reverseString = (it:String) => (it === '') ? '' : reverseString(it.substr(1)) + it.charAt(0);
        httpsCallable<{string: String}, {reversed: String}>(functions, 'reverseString')({string}).subscribe(it => {
          expect(it).toEqual({ reversed: reverseString(string) });
          done();
        });
      });
  });

});
