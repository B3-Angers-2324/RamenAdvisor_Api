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

describe('Test phone function', () => {
  test('should return true for a valid phone number', () => {
    const validPhoneNumber = '1234567890';
    const result = CheckInput.phone(validPhoneNumber);
    expect(result).toBe(true);
  });

  test('should return false for an invalid phone number with less than 10 digits', () => {
    const invalidPhoneNumber = '123456789';
    const result = CheckInput.phone(invalidPhoneNumber);
    expect(result).toBe(false);
  });

  test('should return false for an invalid phone number with more than 10 digits', () => {
    const invalidPhoneNumber = '12345678901';
    const result = CheckInput.phone(invalidPhoneNumber);
    expect(result).toBe(false);
  });

  test('should return false for an invalid phone number with non-digit characters', () => {
    const invalidPhoneNumber = '123456789a';
    const result = CheckInput.phone(invalidPhoneNumber);
    expect(result).toBe(false);
  });
});

describe('Test email function', () => {
  test('should return true for a valid email', () => {
    const validEmail = 'test@example.com';
    const result = CheckInput.email(validEmail);
    expect(result).toBe(true);
  });

  test('should return false for an invalid email without @ symbol', () => {
    const invalidEmail = 'testexample.com';
    const result = CheckInput.email(invalidEmail);
    expect(result).toBe(false);
  });

  test('should return false for an invalid email without domain', () => {
    const invalidEmail = 'test@';
    const result = CheckInput.email(invalidEmail);
    expect(result).toBe(false);
  });

  test('should return false for an invalid email with invalid characters', () => {
    const invalidEmail = 'test!@example.com';
    const result = CheckInput.email(invalidEmail);
    expect(result).toBe(false);
  });
});

describe('Test isNotEmpty function', () => {
  test('should return true for a non-empty string', () => {
    const nonEmptyString = 'test';
    const result = CheckInput.isNotEmpty(nonEmptyString);
    expect(result).toBe(true);
  });

  test('should return false for an empty string', () => {
    const emptyString = '';
    const result = CheckInput.isNotEmpty(emptyString);
    expect(result).toBe(false);
  });
});

describe('Test areNotEmpty function', () => {
  test('should return true for an array of non-empty strings', () => {
    const nonEmptyStrings = ['test1', 'test2'];
    const result = CheckInput.areNotEmpty(nonEmptyStrings);
    expect(result).toBe(true);
  });

  test('should return false for an array of empty strings', () => {
    const emptyStrings = ['', ''];
    const result = CheckInput.areNotEmpty(emptyStrings);
    expect(result).toBe(false);
  });

  test('should return false for an array of empty strings', () => {
    const emptyStrings = ['test1', ''];
    const result = CheckInput.areNotEmpty(emptyStrings);
    expect(result).toBe(false);
  });
});