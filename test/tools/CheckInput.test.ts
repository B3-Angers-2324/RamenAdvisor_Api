import CheckInput from '../../src/tools/CheckInput';
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';


describe('Test password function', () => {
    test('should return true for a valid password', () => {
      const validPassword = 'Abc123!@#';
      const result = CheckInput.password(validPassword);
      expect(result).toBe(true);
    });
  
    test('should return false for an invalid password without lowercase letter', () => {
      const invalidPassword = 'ABC123!@#';
      const result = CheckInput.password(invalidPassword);
      expect(result).toBe(false);
    });
  
    test('should return false for an invalid password without uppercase letter', () => {
      const invalidPassword = 'abc123!@#';
      const result = CheckInput.password(invalidPassword);
      expect(result).toBe(false);
    });
  
    test('should return false for an invalid password without digit', () => {
      const invalidPassword = 'Abcdef!@#';
      const result = CheckInput.password(invalidPassword);
      expect(result).toBe(false);
    });
  
    test('should return false for an invalid password without special character', () => {
      const invalidPassword = 'Abc123456';
      const result = CheckInput.password(invalidPassword);
      expect(result).toBe(false);
    });
  });