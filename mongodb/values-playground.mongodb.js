const database = "Ramen";

const MessageCollection = "messages";
const RestaurantCollection = "restaurants";
const UserCollection = "users";
const OwnerCollection = "owners";
const ModeratorCollection = "moderators";
const AdminCollection = "admins";

use(database);

db.getCollection(MessageCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045acf"), "userId": ObjectId("64a685757acccfac3d045ae0"), "restaurantId": ObjectId("64a685757acccfac3d045ad9"), "message": "C'est délicieux !", "note": 1 },
  { "_id": ObjectId("64a685757acccfac3d045ad0"), "userId": ObjectId("64a685757acccfac3d045ae1"), "restaurantId": ObjectId("64a685757acccfac3d045ada"), "message": "Service impeccable.", "note": 4 },
  { "_id": ObjectId("64a685757acccfac3d045ad1"), "userId": ObjectId("64a685757acccfac3d045ae2"), "restaurantId": ObjectId("64a685757acccfac3d045adb"), "message": "J'adore ce lieu !", "note": 5 },
  { "_id": ObjectId("64a685757acccfac3d045ad2"), "userId": ObjectId("64a685757acccfac3d045ae3"), "restaurantId": ObjectId("64a685757acccfac3d045adc"), "message": "Mauvaise expérience.", "note": 2 },
  { "_id": ObjectId("64a685757acccfac3d045ad3"), "userId": ObjectId("64a685757acccfac3d045ae4"), "restaurantId": ObjectId("64a685757acccfac3d045add"), "message": "Pas mal du tout.", "note": 3 },
  { "_id": ObjectId("64a685757acccfac3d045ad4"), "userId": ObjectId("64a685757acccfac3d045ae5"), "restaurantId": ObjectId("64a685757acccfac3d045ade"), "message": "C'est excellent !", "note": 4 },
  { "_id": ObjectId("64a685757acccfac3d045ad5"), "userId": ObjectId("64a685757acccfac3d045ae6"), "restaurantId": ObjectId("64a685757acccfac3d045adf"), "message": "Service rapide.", "note": 2 },
  { "_id": ObjectId("64a685757acccfac3d045ad6"), "userId": ObjectId("64a685757acccfac3d045ae7"), "restaurantId": ObjectId("64a685757acccfac3d045adc"), "message": "Nourriture savoureuse.", "note": 4 },
  { "_id": ObjectId("64a685757acccfac3d045ad7"), "userId": ObjectId("64a685757acccfac3d045ae8"), "restaurantId": ObjectId("64a685757acccfac3d045ada"), "message": "Je n'ai pas aimé du tout.", "note": 1 },
  { "_id": ObjectId("64a685757acccfac3d045ad8"), "userId": ObjectId("64a685757acccfac3d045ae9"), "restaurantId": ObjectId("64a685757acccfac3d045ade"), "message": "C'est correct.", "note": 3 }
]);

db.getCollection(RestaurantCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045ad9"), "ownerId": ObjectId("64a685757acccfac3d045af3"), "name": "McDonald's Champs-Élysées", "position": [48.87287753220859, 2.299091242896418], "adresse": "15 rue du tertre", foodtype:"local_pizza", "note": 38 },
  { "_id": ObjectId("64a685757acccfac3d045ada"), "ownerId": ObjectId("64a685757acccfac3d045af3"), "name": "McDonald's Montmartre", "position": [48.873452, 2.297869], "adresse": "15 avenue des Champs-Élysées", foodtype:"lunch_dining", "note": 42 },
  { "_id": ObjectId("64a685757acccfac3d045adb"), "ownerId": ObjectId("64a685757acccfac3d045af4"), "name": "Burger King Champs-Élysées", "position": [48.871365, 2.300729], "adresse": "15 rue du Chêne", foodtype:"fastfood", "note": 45 },
  { "_id": ObjectId("64a685757acccfac3d045adc"), "ownerId": ObjectId("64a685757acccfac3d045af4"), "name": "Burger King Montmartre", "position": [48.884597, 2.339918], "adresse": "165 avenue des Bizneuil", foodtype:"restaurant", "note": 31 },
  { "_id": ObjectId("64a685757acccfac3d045add"), "ownerId": ObjectId("64a685757acccfac3d045af5"), "name": "KFC Montmartre", "position": [48.890217, 2.346131], "adresse": "1 avenue du Monmartre", foodtype:"restaurant","note": 39 },
  { "_id": ObjectId("64a685757acccfac3d045ade"), "ownerId": ObjectId("64a685757acccfac3d045af6"), "name": "Kebab Express", "position": [48.875621, 2.337450], "adresse": "35 avenue du kebab", foodtype:"local_pizza", "note": 46 },
  { "_id": ObjectId("64a685757acccfac3d045adf"), "ownerId": ObjectId("64a685757acccfac3d045af7"), "name": "Pizza Express", "position": [48.871916, 2.329340], "adresse": "15 rue de la pizza", foodtype:"lunch_dining", "note": 40 }
]);

db.getCollection(UserCollection).insertMany([
  {"_id": ObjectId("64a685757acccfac3d045ae0"), "firstName": "Paul", "lastName": "Dupont", "birthDay": "01/01/2000", "email": "paul.dupont@gmail.com", "phone": "0678986745", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Angers", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae1"), "firstName": "Sophie", "lastName": "Lefebvre", "birthDay": "05/12/1995", "email": "sophie.lefebvre@gmail.com", "phone": "0678123456", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Paris", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae2"), "firstName": "David", "lastName": "Martin", "birthDay": "10/03/1988", "email": "david.martin@gmail.com", "phone": "0678234567", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Lyon", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae3"), "firstName": "Camille", "lastName": "Roux", "birthDay": "15/07/1993", "email": "camille.roux@gmail.com", "phone": "0678345678", "sexe": "femme", "password": "p@9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Marseille", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae4"), "firstName": "Thomas", "lastName": "Bernard", "birthDay": "20/11/1985", "email": "thomas.bernard@gmail.com", "phone": "0678456789", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Toulouse", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae5"), "firstName": "Sarah", "lastName": "Pierre", "birthDay": "02/04/1991", "email": "sarah.pierre@gmail.com", "phone": "0678567890", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Bordeaux", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae6"), "firstName": "Luc", "lastName": "Leroy", "birthDay": "19/09/1982", "email": "luc.leroy@gmail.com", "phone": "0678678901", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Lille", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae7"), "firstName": "Marie", "lastName": "Girard", "birthDay": "12/12/1996", "email": "marie.girard@gmail.com", "phone": "0678789012", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Nantes", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae8"), "firstName": "Antoine", "lastName": "Lambert", "birthDay": "25/05/1990", "email": "antoine.lambert@gmail.com", "phone": "0678890123", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Strasbourg", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045ae9"), "firstName": "Elodie", "lastName": "Moreau", "birthDay": "03/08/1987", "email": "elodie.moreau@gmail.com", "phone": "0678901234", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Rennes", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045aea"), "firstName": "Nicolas", "lastName": "Andre", "birthDay": "18/06/1999", "email": "nicolas.andre@gmail.com", "phone": "0678012345", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Nice", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045aeb"), "firstName": "Julie", "lastName": "Gauthier", "birthDay": "14/02/1983", "email": "julie.gauthier@gmail.com", "phone": "0678123456", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Montpellier", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045aec"), "firstName": "Hugo", "lastName": "Muller", "birthDay": "27/03/1992", "email": "hugo.muller@gmail.com", "phone": "0678234567", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Dijon", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045aed"), "firstName": "Clara", "lastName": "Vidal", "birthDay": "21/09/1984", "email": "clara.vidal@gmail.com", "phone": "0678345678", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Brest", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045aef"), "firstName": "Arthur", "lastName": "Sanchez", "birthDay": "11/07/1980", "email": "arthur.sanchez@gmail.com", "phone": "0678456789", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Avignon", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045af0"), "firstName": "Charlotte", "lastName": "Fournier", "birthDay": "09/10/1994", "email": "charlotte.fournier@gmail.com", "phone": "0678567890", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Limoges", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045af1"), "firstName": "Théo", "lastName": "Legrand", "birthDay": "04/06/1981", "email": "theo.legrand@gmail.com", "phone": "0678678901", "sexe": "homme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Reims", "ban": false},
  {"_id": ObjectId("64a685757acccfac3d045af2"), "firstName": "Marine", "lastName": "Renaud", "birthDay": "07/11/1997", "email": "marine.renaud@gmail.com", "phone": "0678789012", "sexe": "femme", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "ville": "Caen", "ban": false},
]);

db.getCollection(ModeratorCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045af8"), "firstName": "Jean", "lastName": "Eude", "email": "jean.eude@gmail.com", "password": "grospassword" },
  { "_id": ObjectId("64a685757acccfac3d045af9"), "firstName": "Marie", "lastName": "Lacroix", "email": "marie.lacroix@gmail.com", "password": "secret123" },
  { "_id": ObjectId("64a685757acccfac3d045afa"), "firstName": "Pierre", "lastName": "Dumas", "email": "pierre.dumas@gmail.com", "password": "securepass" },
  { "_id": ObjectId("64a685757acccfac3d045afb"), "firstName": "Sophie", "lastName": "Gagnon", "email": "sophie.gagnon@gmail.com", "password": "myp@ssword" },
  { "_id": ObjectId("64a685757acccfac3d045afc"), "firstName": "Luc", "lastName": "Martel", "email": "luc.martel@gmail.com", "password": "letmein" },
  { "_id": ObjectId("64a685757acccfac3d045afd"), "firstName": "Isabelle", "lastName": "Leblanc", "email": "isabelle.leblanc@gmail.com", "password": "changeme" },
  { "_id": ObjectId("64a685757acccfac3d045afe"), "firstName": "Antoine", "lastName": "Rousseau", "email": "antoine.rousseau@gmail.com", "password": "easytohack" }
]);

db.getCollection(AdminCollection).insertMany([
  { "_id": ObjectId("64a685757acccfac3d045aff"), "firstName": "Bernard", "lastName": "Tapis", "email": "bernard.tapis@gmail.com", "password": "Argent" },
  { "_id": ObjectId("64a685757acccfac3d045b00"), "firstName": "Marie", "lastName": "Pierre", "email": "marie.pierre@gmail.com", "password": "Secret123" },
  { "_id": ObjectId("64a685757acccfac3d045b01"), "firstName": "Philippe", "lastName": "Leroux", "email": "philippe.leroux@gmail.com", "password": "Confidentiel" },
]);

db.getCollection(OwnerCollection).insertMany([
  {"_id": ObjectId("64a685757acccfac3d045af3"), "firstName": "John", "lastName": "Doe", "email": "john.doe@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "0123456789", "siret": "56823782398", "companyName": "Mcdonalds", "socialAdresse": "15 rue du tertre"},
  {"_id": ObjectId("64a685757acccfac3d045af4"), "firstName": "Jane", "lastName": "Smith", "email": "jane.smith@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "9876543210", "siret": "12345678901", "companyName": "Burger King", "socialAdresse": "42 Avenue des Champs-Élysées"},
  {"_id": ObjectId("64a685757acccfac3d045af5"), "firstName": "Michael", "lastName": "Johnson", "email": "michael.johnson@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "5555555555", "siret": "99999999999", "companyName": "KFC", "socialAdresse": "8 King's Road"},
  {"_id": ObjectId("64a685757acccfac3d045af6"), "firstName": "Maria", "lastName": "Garcia", "email": "maria.garcia@gmail.com", "password": "p@9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "1231231234", "siret": "77777777777", "companyName": "KEBAB", "socialAdresse": "5 Pizzeria Lane"},
  {"_id": ObjectId("64a685757acccfac3d045af7"), "firstName": "Alice", "lastName": "Smith", "email": "alice.smith@gmail.com", "password": "9adfb0a6d03beb7141d8ec2708d6d9fef9259d12cd230d50f70fb221ae6cabd5", "phone": "9876543210", "siret": "12345678901", "companyName": "PIZZA", "socialAdresse": "123 Main Street"},
]);