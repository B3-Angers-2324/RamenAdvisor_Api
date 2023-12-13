const database = "Ramen";

const MessageCollection = "messages";
const RestaurantCollection = "restaurants";
const UserCollection = "users";
const OwnerCollection = "owners";
const ModeratorCollection = "moderators";
const AdminCollection = "admins";
const FoodtypeCollection = "foodtypes";
const ImageCollection = "images";

use(database);

db.getCollection(FoodtypeCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045b02"), "name": "feux", "imgId": ObjectId("64a685757acccfac3d045b03") },
]);

db.getCollection(ImageCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045b03"), "mimetype": "image/svg+xml", "binary": BinData(0, 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHBhdGggZD0iTTE0LjUgMTAuMDAwM0MxNC41IDkuMjA4NzUgMTUuNTUyOCA4Ljk5ODk1IDE1LjgzMjEgOS43Mzk1N0MxNi41MDc3IDExLjUzMTEgMTcgMTMuMTMzNyAxNyAxNC4wMDAyQzE3IDE2Ljc2MTYgMTQuNzYxNCAxOS4wMDAyIDEyIDE5LjAwMDJDOS4yMzg1OCAxOS4wMDAyIDcgMTYuNzYxNiA3IDE0LjAwMDJDNyAxMy4wNjkzIDcuNTY4MjIgMTEuMjg4NyA4LjMyMTU2IDkuMzM2OThDOS4yOTc0MyA2LjgwODc5IDkuNzg1MzYgNS41NDQ2OSAxMC4zODc3IDUuNDc2NkMxMC41ODA0IDUuNDU0ODIgMTAuNzkwNyA1LjQ5Mzk5IDEwLjk2MjYgNS41ODM3MUMxMS41IDUuODY0MTMgMTEuNSA3LjI0Mjg1IDExLjUgMTAuMDAwM0MxMS41IDEwLjgyODcgMTIuMTcxNiAxMS41MDAzIDEzIDExLjUwMDNDMTMuODI4NCAxMS41MDAzIDE0LjUgMTAuODI4NyAxNC41IDEwLjAwMDNaIiBzdHJva2U9IiMzMzM2M0YiIHN0cm9rZS13aWR0aD0iMiIvPg0KPHBhdGggZD0iTTExIDE5TDEwLjczNzIgMTguMzQzQzEwLjI4MTYgMTcuMjA0IDEwLjQ3MzcgMTUuOTA3OSAxMS4yNCAxNC45NVYxNC45NUMxMS42Mjk2IDE0LjQ2MyAxMi4zNzA0IDE0LjQ2MyAxMi43NiAxNC45NVYxNC45NUMxMy41MjYzIDE1LjkwNzkgMTMuNzE4NCAxNy4yMDQgMTMuMjYyOCAxOC4zNDNMMTMgMTkiIHN0cm9rZT0iIzMzMzYzRiIgc3Ryb2tlLXdpZHRoPSIyIi8+DQo8L3N2Zz4=')},
]);

db.getCollection(RestaurantCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045ad9"), "ownerId": ObjectId("64a685757acccfac3d045af3"), "name": "Loin du Pot", "position": [47.472270716783584, -0.556831383954351], "address": "9, Rue Baudriere, Angers", foodtype:"local_pizza", "note": 10, "images": ["https://picsum.photos/1000/1000","https://picsum.photos/1000/1000"], "detailNote": [{"percentage": 100, "nbNote": 1}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}]},
  { "_id": ObjectId("64a685757acccfac3d045ada"), "ownerId": ObjectId("64a685757acccfac3d045af3"), "name": "La Course", "position": [47.465884959324995, -0.5569305540171575], "address": "9 rue de la Gare, Angers", foodtype:"lunch_dining", "note": 25 , "images": ["https://picsum.photos/1000/1000","https://picsum.photos/1000/1000"],  "detailNote": [{"percentage": 50, "nbNote": 1}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 50, "nbNote": 1}, {"percentage": 0, "nbNote": 0}]},
  { "_id": ObjectId("64a685757acccfac3d045adb"), "ownerId": ObjectId("64a685757acccfac3d045af4"), "name": "Molly Beackfast", "position": [47.471407460309784, -0.5544236067793293], "address": "2 Pl. Mondain Chanlouineau, Angers", foodtype:"fastfood", "note": 50 , "images": ["https://picsum.photos/1000/1000","https://picsum.photos/1000/1000"],  "detailNote": [{"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 100, "nbNote": 1}]},
  { "_id": ObjectId("64a685757acccfac3d045adc"), "ownerId": ObjectId("64a685757acccfac3d045af4"), "name": "Le brew kebad", "position": [47.47416851912331, -0.5599750188096418], "address": "27 Rue Beaurepaire, Angers", foodtype:"restaurant", "note": 30 , "images": ["https://picsum.photos/1000/1000","https://picsum.photos/1000/1000"],  "detailNote": [{"percentage": 0, "nbNote": 0}, {"percentage": 50, "nbNote": 1}, {"percentage": 0, "nbNote": 0}, {"percentage": 50, "nbNote": 1}, {"percentage": 0, "nbNote": 0}]},
  { "_id": ObjectId("64a685757acccfac3d045add"), "ownerId": ObjectId("64a685757acccfac3d045af5"), "name": "Les filles de Papa", "position": [47.47333902728544, -0.5498840627712355], "address": "Pl. du Pilori, Angers", foodtype:"restaurant","note": 30 , "images": ["https://picsum.photos/1000/1000","https://picsum.photos/1000/1000"],  "detailNote": [{"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 100, "nbNote": 1}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}]},
  { "_id": ObjectId("64a685757acccfac3d045ade"), "ownerId": ObjectId("64a685757acccfac3d045af6"), "name": "Au grand Fast-food", "position": [47.476579004732294, -0.5581208663843726], "address": "18 Bd Arago, Angers", foodtype:"local_pizza", "note": 35 , "images": ["https://picsum.photos/1000/1000","https://picsum.photos/1000/1000"],  "detailNote": [{"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 50, "nbNote": 1}, {"percentage": 50, "nbNote": 1}, {"percentage": 0, "nbNote": 0}]},
  { "_id": ObjectId("64a685757acccfac3d045adf"), "ownerId": ObjectId("64a685757acccfac3d045af7"), "name": "La chaise 42", "position": [47.47822415636451, -0.5455933154765314], "address": "33 Av. Besnardière, Angers", foodtype:"lunch_dining", "note": 20 , "images": ["https://picsum.photos/1000/1000","https://picsum.photos/1000/1000"],  "detailNote": [{"percentage": 0, "nbNote": 0}, {"percentage": 100, "nbNote": 1}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}, {"percentage": 0, "nbNote": 0}]}
]);

db.getCollection(MessageCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045acf"), "userId": ObjectId("64a685757acccfac3d045ae0"), "restaurantId": ObjectId("64a685757acccfac3d045ad9"), "message": "C'est délicieux !", "note": 1 , "date": new Date("2021-01-01")},
  { "_id": ObjectId("64a685757acccfac3d045ad0"), "userId": ObjectId("64a685757acccfac3d045ae1"), "restaurantId": ObjectId("64a685757acccfac3d045ada"), "message": "Service impeccable.", "note": 4, "date": new Date("2021-01-02") },
  { "_id": ObjectId("64a685757acccfac3d045ad1"), "userId": ObjectId("64a685757acccfac3d045ae2"), "restaurantId": ObjectId("64a685757acccfac3d045adb"), "message": "J'adore ce lieu !", "note": 5 , "date": new Date("2021-01-03")},
  { "_id": ObjectId("64a685757acccfac3d045ad2"), "userId": ObjectId("64a685757acccfac3d045ae3"), "restaurantId": ObjectId("64a685757acccfac3d045adc"), "message": "Mauvaise expérience.", "note": 2 , "date": new Date("2021-01-04")},
  { "_id": ObjectId("64a685757acccfac3d045ad3"), "userId": ObjectId("64a685757acccfac3d045ae4"), "restaurantId": ObjectId("64a685757acccfac3d045add"), "message": "Pas mal du tout.", "note": 3, "date": new Date("2021-01-05") },
  { "_id": ObjectId("64a685757acccfac3d045ad4"), "userId": ObjectId("64a685757acccfac3d045ae5"), "restaurantId": ObjectId("64a685757acccfac3d045ade"), "message": "C'est excellent !", "note": 4, "date": new Date("2021-01-06") },
  { "_id": ObjectId("64a685757acccfac3d045ad5"), "userId": ObjectId("64a685757acccfac3d045ae6"), "restaurantId": ObjectId("64a685757acccfac3d045adf"), "message": "Service rapide.", "note": 2, "date": new Date("2021-01-07") },
  { "_id": ObjectId("64a685757acccfac3d045ad6"), "userId": ObjectId("64a685757acccfac3d045ae7"), "restaurantId": ObjectId("64a685757acccfac3d045adc"), "message": "Nourriture savoureuse.", "note": 4, "date": new Date("2021-01-08") },
  { "_id": ObjectId("64a685757acccfac3d045ad7"), "userId": ObjectId("64a685757acccfac3d045ae8"), "restaurantId": ObjectId("64a685757acccfac3d045ada"), "message": "Je n'ai pas aimé du tout.", "note": 1, "date": new Date("2021-01-09") },
  { "_id": ObjectId("64a685757acccfac3d045ad8"), "userId": ObjectId("64a685757acccfac3d045ae9"), "restaurantId": ObjectId("64a685757acccfac3d045ade"), "message": "C'est correct.", "note": 3, "date": new Date("2021-01-10") }
]);

db.getCollection(UserCollection).insertMany([
  {"_id": ObjectId("64a685757acccfac3d045ae0"), "firstName": "Paul", "lastName": "Dupont", "birthDay": new Date('1999-01-01'), "email": "paul.dupont@gmail.com", "phone": "0678986745", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Angers", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae1"), "firstName": "Sophie", "lastName": "Lefebvre", "birthDay": new Date('1999-01-01'), "email": "sophie.lefebvre@gmail.com", "phone": "0678123456", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Paris", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae2"), "firstName": "David", "lastName": "Martin", "birthDay": new Date('1999-01-01'), "email": "david.martin@gmail.com", "phone": "0678234567", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Lyon", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae3"), "firstName": "Camille", "lastName": "Roux", "birthDay": new Date('1999-01-01'), "email": "camille.roux@gmail.com", "phone": "0678345678", "sexe": "femme", "password": "p@9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Marseille", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae4"), "firstName": "Thomas", "lastName": "Bernard", "birthDay": new Date('1999-01-01'), "email": "thomas.bernard@gmail.com", "phone": "0678456789", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Toulouse", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae5"), "firstName": "Sarah", "lastName": "Pierre", "birthDay": new Date('1999-01-01'), "email": "sarah.pierre@gmail.com", "phone": "0678567890", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Bordeaux", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae6"), "firstName": "Luc", "lastName": "Leroy", "birthDay": new Date('1999-01-01'), "email": "luc.leroy@gmail.com", "phone": "0678678901", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Lille", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae7"), "firstName": "Marie", "lastName": "Girard", "birthDay": new Date('1999-01-01'), "email": "marie.girard@gmail.com", "phone": "0678789012", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Nantes", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae8"), "firstName": "Antoine", "lastName": "Lambert", "birthDay": new Date('1999-01-01'), "email": "antoine.lambert@gmail.com", "phone": "0678890123", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Strasbourg", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045ae9"), "firstName": "Elodie", "lastName": "Moreau", "birthDay": new Date('1999-01-01'), "email": "elodie.moreau@gmail.com", "phone": "0678901234", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Rennes", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045aea"), "firstName": "Nicolas", "lastName": "Andre", "birthDay": new Date('1999-01-01'), "email": "nicolas.andre@gmail.com", "phone": "0678012345", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Nice", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045aeb"), "firstName": "Julie", "lastName": "Gauthier", "birthDay": new Date('1999-01-01'), "email": "julie.gauthier@gmail.com", "phone": "0678123456", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Montpellier", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045aec"), "firstName": "Hugo", "lastName": "Muller", "birthDay": new Date('1999-01-01'), "email": "hugo.muller@gmail.com", "phone": "0678234567", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Dijon", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045aed"), "firstName": "Clara", "lastName": "Vidal", "birthDay": new Date('1999-01-01'), "email": "clara.vidal@gmail.com", "phone": "0678345678", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Brest", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045aef"), "firstName": "Arthur", "lastName": "Sanchez", "birthDay": new Date('1999-01-01'), "email": "arthur.sanchez@gmail.com", "phone": "0678456789", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Avignon", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045af0"), "firstName": "Charlotte", "lastName": "Fournier", "birthDay": new Date('1999-01-01'), "email": "charlotte.fournier@gmail.com", "phone": "0678567890", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Limoges", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045af1"), "firstName": "Théo", "lastName": "Legrand", "birthDay": new Date('1999-01-01'), "email": "theo.legrand@gmail.com", "phone": "0678678901", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Reims", "ban": false, "image":new ObjectId("000000000000000000000000")},
  {"_id": ObjectId("64a685757acccfac3d045af2"), "firstName": "Marine", "lastName": "Renaud", "birthDay": new Date('1999-01-01'), "email": "marine.renaud@gmail.com", "phone": "0678789012", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Caen", "ban": false, "image":new ObjectId("000000000000000000000000")},
]);

db.getCollection(ModeratorCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045af8"), "email": "jean.eude@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
  { "_id": ObjectId("64a685757acccfac3d045af9"), "email": "marie.lacroix@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
  { "_id": ObjectId("64a685757acccfac3d045afa"), "email": "pierre.dumas@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
  { "_id": ObjectId("64a685757acccfac3d045afb"), "email": "sophie.gagnon@gmail.com", "password": "myp@9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
  { "_id": ObjectId("64a685757acccfac3d045afc"), "email": "luc.martel@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
  { "_id": ObjectId("64a685757acccfac3d045afd"), "email": "isabelle.leblanc@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
  { "_id": ObjectId("64a685757acccfac3d045afe"), "email": "antoine.rousseau@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" }
]);

db.getCollection(AdminCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045aff"), "firstName": "Bernard", "lastName": "Tapis", "email": "bernard.tapis@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
  { "_id": ObjectId("64a685757acccfac3d045b00"), "firstName": "Marie", "lastName": "Pierre", "email": "marie.pierre@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
  { "_id": ObjectId("64a685757acccfac3d045b01"), "firstName": "Philippe", "lastName": "Leroux", "email": "philippe.leroux@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5" },
]);

db.getCollection(OwnerCollection).insertMany([
  {"_id": ObjectId("64a685757acccfac3d045af3"), "firstName": "John", "lastName": "Doe", "email": "john.doe@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "0123456789", "siret": "56823782398", "companyName": "Mcdonalds", "socialAdresse": "15 rue du tertre"},
  {"_id": ObjectId("64a685757acccfac3d045af4"), "firstName": "Jane", "lastName": "Smith", "email": "jane.smith@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "9876543210", "siret": "12345678901", "companyName": "Burger King", "socialAdresse": "42 Avenue des Champs-Élysées"},
  {"_id": ObjectId("64a685757acccfac3d045af5"), "firstName": "Michael", "lastName": "Johnson", "email": "michael.johnson@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "5555555555", "siret": "99999999999", "companyName": "KFC", "socialAdresse": "8 King's Road"},
  {"_id": ObjectId("64a685757acccfac3d045af6"), "firstName": "Maria", "lastName": "Garcia", "email": "maria.garcia@gmail.com", "password": "p@9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "1231231234", "siret": "77777777777", "companyName": "KEBAB", "socialAdresse": "5 Pizzeria Lane"},
  {"_id": ObjectId("64a685757acccfac3d045af7"), "firstName": "Alice", "lastName": "Smith", "email": "alice.smith@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "9876543210", "siret": "12345678901", "companyName": "PIZZA", "socialAdresse": "123 Main Street"},
]);


//Add reports

db.getCollection("reports").insertMany([
  { "_id": ObjectId("64a685757acccaac3d045b02"), "userId": ObjectId("64a685757acccfac3d045ae0"), "restaurantId": ObjectId("64a685757acccfac3d045adb"), "messageId": ObjectId("64a685757acccfac3d045ad4") ,"date_first": new Date("2022-01-01") ,"nbReport":3},
]);