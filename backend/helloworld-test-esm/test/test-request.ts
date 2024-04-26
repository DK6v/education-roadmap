import * as test from 'node:test'
import assert from 'node:assert/strict'

import fetch from 'node-fetch';

import * as app from '../source/index.ts'


test.describe('Requests', async () => {

    test.before(async () => app.start(true));

    test.it('Send request', async () => {

        let respStr = await fetch('http://localhost:8081')
                            .then(res => res.text())

        assert.deepEqual(respStr, "Hello!")
    });

    test.after(() => app.close());
});
