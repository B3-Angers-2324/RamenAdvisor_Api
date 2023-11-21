const database = "Ramen";

const MessageCollection = "messages";
const RestaurantCollection = "restaurants";
const UserCollection = "users";
const OwnerCollection = "owners";
const ModeratorCollection = "moderators";
const AdminCollection = "admins";
const ReportCollection = "reports";

use(database);

db.dropDatabase();

db.createCollection(
    MessageCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["userId", "restaurantId", "message", "note", "date"],
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
                },
                date: {
                    bsonType: "date",
                    description: "must be a date and is required"
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
            required: ["ownerId", "name", "position", "address", "foodtype", "note"],
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
                address: {
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
                },
                //Need to be changed to Images type
                images: {
                    bsonType: "array",
                    description: "must be a array of string"
                },
            }
        }}
    }
);

db.createCollection(
    UserCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "birthDay", "email", "phone", "sexe", "password", "ville", "ban", "image"],
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
                },
                image: {
                    bsonType: "string",
                    description: "must be a string and is required"
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

db.createCollection(
    ReportCollection,
    {
        validator: { $jsonSchema: {
            bsonType: "object",
            required: ["userId", "restaurantId", "messageId", "date_first", "nbReport"],
            properties: {
                userId: {
                    bsonType: "objectId",
                    description: "The Id of the user who wrote the message, must be a int and is required"
                },
                restaurantId: {
                    bsonType: "objectId",
                    description: "The id of the restaurant where the message is written ,must be a int and is required"
                },
                messageId: {
                    bsonType: "objectId",
                    description: "The id of the message ,must be a int and is required"
                },
                date_first: {
                    bsonType: "date",
                    description: "The date of the first report, must be a date and is required"
                },
                nbReport: {
                    bsonType: "int",
                    description: "The number of report, must be a int and is required"
                }
            }
        }}
    }
);