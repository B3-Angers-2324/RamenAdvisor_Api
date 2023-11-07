const database = "Ramen";

const MessageCollection = "messages";
const RestaurantCollection = "restaurants";
const UserCollection = "users";
const OwnerCollection = "owners";
const ModeratorCollection = "moderators";
const AdminCollection = "admins";

use(database);

db.dropDatabase();

db.createCollection(
    MessageCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["userId", "restaurantId", "message", "note"],
            properties: {
                userId: {
                    bsonType: "objectId",
                    description: "must be a int and is required"
                },
                restaurantId: {
                    bsonType: "objectId",
                    description: "must be a int and is required"
                },
                message: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                note: {
                    bsonType: "int",
                    description: "must be a int and is required"
                }
            }
        }}
    }
);

db.createCollection(
    RestaurantCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["ownerId", "name", "position", "adresse", "foodtype", "note"],
            properties: {
                ownerId: {
                    bsonType: "objectId",
                    description: "must be a int and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                position: {
                    bsonType: "array",
                    description: "must be a array and is required"
                },
                adresse: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                foodtype:{
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                note: {
                    bsonType: "int",
                    minimum: 0,
                    maximum: 50,
                    description: "must be a int and is required"
                }
            }
        }}
    }
);

db.createCollection(
    UserCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "birthDay", "email", "phone", "sexe", "password", "ville", "ban"],
            properties: {
                firstName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                lastName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                birthDay: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                phone: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                sexe: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                ville: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                ban: {
                    bsonType: "bool",
                    description: "must be a bool and is required"
                }
            }
        }}
    }
);

db.createCollection(
    OwnerCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "email", "password", "siret", "companyName", "socialAdresse"],
            properties: {
                firstName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                lastName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                siret: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                companyName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                socialAdresse: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }}
    }
);

db.createCollection(
    ModeratorCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "email", "password"],
            properties: {
                firstName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                lastName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }}
    }
);

db.createCollection(
    AdminCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "email", "password"],
            properties: {
                firstName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                lastName: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }}
    }
);