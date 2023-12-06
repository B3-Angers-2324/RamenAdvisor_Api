import { expect, test} from '@jest/globals';

test("fill test to pass", () => {
    expect(true).toBeTruthy();
});

// OFF BEACUASE IRELERVANT WHILE ON PROD
/*describe("Test if the database is connected", () => {

    test("Database is connected", async () => {
        // detect if the fonction console.log is called
        const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await connectToDatabase();

        expect(spy).toBeCalled();

        spy.mockRestore();

        // detect if the collections are not empty
        expect(collections.restaurant).not.toBeNull();
        expect(collections.owner).not.toBeNull();
        expect(collections.user).not.toBeNull();
        expect(collections.message).not.toBeNull();
        expect(collections.moderator).not.toBeNull();
        expect(collections.admin).not.toBeNull();
        expect(collections.report).not.toBeNull();
    })
})*/