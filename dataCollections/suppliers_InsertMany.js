db.getCollection('suppliers').insertMany([
{
    "_id" : ObjectId("660dd273d6b67e81edeb31d5"),
    "name" : "ABC Electronics",
    "contactInfo" : "123-456-7890",
    "address" : "123 Main St, City, Country",
    "website" : "www.abcelectronics.com",
    "__v" : 0
},
{
    "_id" : ObjectId("660dd273d6b67e81edeb31d6"),
    "name" : "XYZ Technologies",
    "contactInfo" : "987-654-3210",
    "address" : "456 Park Ave, City, Country",
    "website" : "www.xyztech.com",
    "__v" : 0
},
{
    "_id" : ObjectId("660dd273d6b67e81edeb31d7"),
    "name" : "TechCorp Inc.",
    "contactInfo" : "555-123-4567",
    "address" : "789 Elm St, City, Country",
    "website" : "www.techcorp.com",
    "__v" : 0
}
]);