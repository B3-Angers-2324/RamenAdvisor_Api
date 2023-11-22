import {describe, expect, test, beforeAll, afterAll, beforeEach, afterEach, jest} from '@jest/globals';

import ModeratorController from '../../src/controllers/ModeratorController';

describe("1+1=2", () => {
    test("1+1=2", () => {
        ModeratorController.nothing();
        expect(1+1).toBe(2);
    });
});