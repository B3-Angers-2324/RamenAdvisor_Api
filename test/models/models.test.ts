import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';

import Admin from '../../src/models/AdminModel';
import Message from '../../src/models/MessageModel';
import Moderator from '../../src/models/ModeratorModel';
import Owner from '../../src/models/OwnerModel';
import Report from '../../src/models/ReportModel';
import Restaurant from '../../src/models/RestaurantModel';
import User from '../../src/models/UserModel';
import { ObjectId } from 'mongodb';

// test admin model
describe('Test Admin model', () => {
    test('Create new Admin', () => {
        const admin = new Admin('first', 'last', 'password');
        expect(admin.firstName).toBe('first');
        expect(admin.lastName).toBe('last');
        expect(admin.password).toBe('password');
    });
});

// test message model
describe('Test Message model', () => {
    test('Create new Message', () => {
        const message = new Message('userId', 'restaurantId', 'message', 30);
        expect(message.userId).toBe('userId');
        expect(message.restaurantId).toBe('restaurantId');
        expect(message.message).toBe('message');
        expect(message.note).toBe(30);
    });
});

// test moderator model
describe('Test Moderator model', () => {
    test('Create new Moderator', () => {
        const moderator = new Moderator('first', 'last', 'password');
        expect(moderator.firstName).toBe('first');
        expect(moderator.lastName).toBe('last');
        expect(moderator.password).toBe('password');
    });
});

// test owner model
describe('Test Owner model', () => {
    test('Create new Owner', () => {
        const owner = new Owner('first', 'last', 'email', 'password', 'siret', 'companyName', 'socialAdresse');
        expect(owner.firstName).toBe('first');
        expect(owner.lastName).toBe('last');
        expect(owner.password).toBe('password');
        expect(owner.email).toBe('email');
        expect(owner.siret).toBe('siret');
        expect(owner.companyName).toBe('companyName');
        expect(owner.socialAdresse).toBe('socialAdresse');
    });
});

// test report model
describe('Test Report model', () => {
    test('Create new Report', () => {
        const now = new Date();
        const report = new Report(new ObjectId("64a685757acccfac3d045aa1"), new ObjectId("64a685757acccfac3d045aa1"), new ObjectId("64a685757acccfac3d045aa1"), now, 1);
        // test userId and restaurantId with conversion to string
        expect(report.userId.toString()).toBe("64a685757acccfac3d045aa1");
        expect(report.restaurantId.toString()).toBe("64a685757acccfac3d045aa1");
        expect(report.messageId.toString()).toBe("64a685757acccfac3d045aa1");
        expect(report.date_first).toBe(now);
        expect(report.nbReport).toBe(1);
    });
});

// test restaurant model
describe('Test Restaurant model', () => {
    test('Create new Restaurant', () => {
        const restaurant = new Restaurant('name', 'adresse', 30, [49, 50], ["url1", "url2"], "foodtype");
        expect(restaurant.name).toBe('name');
        expect(restaurant.address).toBe('adresse');
        expect(restaurant.note).toBe(30);
        expect(restaurant.position).toStrictEqual([49, 50]);
        expect(restaurant.images).toStrictEqual(["url1", "url2"]);
        expect(restaurant.foodtype).toBe('foodtype');
    });
});