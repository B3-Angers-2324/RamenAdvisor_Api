import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';

import Admin from '../../src/models/AdminModel';
import Message from '../../src/models/MessageModel';
import Moderator from '../../src/models/ModeratorModel';
import Owner from '../../src/models/OwnerModel';
import Report from '../../src/models/ReportModel';
import Restaurant from '../../src/models/RestaurantModel';
import User from '../../src/models/UserModel';
import FoodType from '../../src/models/FoodtypeModel';
import Image from '../../src/models/ImageModel';
import { ObjectId } from 'mongodb';

// test admin model
describe('Test Admin model', () => {
    test('Create new Admin', () => {
        const admin = new Admin('email');
        expect(admin.email).toBe('email');
    });
});

// test message model
describe('Test Message model', () => {
    test('Create new Message', () => {
        const message = new Message(new ObjectId("64a685757acccfac3d045aa1"), new ObjectId("64a685757acccfac3d045aa1"), 'message', 30);
        expect(message.userId.toString()).toBe("64a685757acccfac3d045aa1");
        expect(message.restaurantId.toString()).toBe("64a685757acccfac3d045aa1");
        expect(message.message).toBe('message');
        expect(message.note).toBe(30);
    });
});

// test moderator model
describe('Test Moderator model', () => {
    test('Create new Moderator', () => {
        const moderator = new Moderator('email');
        expect(moderator.email).toBe('email');
    });
});

// test owner model
describe('Test Owner model', () => {
    test('Create new Owner', () => {
        const owner = new Owner('first', 'last', 'email', 'password', 'companyName', 'socialAdresse');
        expect(owner.firstName).toBe('first');
        expect(owner.lastName).toBe('last');
        expect(owner.password).toBe('password');
        expect(owner.email).toBe('email');
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

// test user model
describe('Test User model', () => {
    test('Create new User', () => {
        const user = new User('first', 'last', new Date(), 'email', 'phone', 'sexe', new ObjectId("64a685757acccfac3d045aa1"), false, 'ville', 'address', 'password');
        expect(user.firstName).toBe('first');
        expect(user.lastName).toBe('last');
        expect(user.birthDay).toBeInstanceOf(Date);
        expect(user.email).toBe('email');
        expect(user.phone).toBe('phone');
        expect(user.sexe).toBe('sexe');
        expect(user.image?.toString()).toBe("64a685757acccfac3d045aa1");
        expect(user.ban).toBe(false);
        expect(user.ville).toBe('ville');
        expect(user.address).toBe('address');
        expect(user.password).toBe('password');
    });
});

// test FoodType model
describe('Test FoodType model', () => {
    test('Create new FoodType', () => {
        const foodtype = new FoodType('name', "64a685757acccfac3d045aa1");
        expect(foodtype.name).toBe('name');
        expect(foodtype.imgId).toBe("64a685757acccfac3d045aa1");
    });
});

// test Image model
describe('Test Image model', () => {
    test('Create new Image', () => {
        // binary is a Buffer, mimetype is a string
        const binary = Buffer.from('binary');
        const image = new Image(binary, 'image/svg+xml');
        expect(image.binary).toBeInstanceOf(Buffer);
        expect(image.mimetype).toBe('image/svg+xml');
    });
});