// F:\web_tools\backend\definitions\foodDeliveryWebsite.js

module.exports = [
  {
    tableName: "User",
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      {
        name: "role",
        type: "String",
        default: "'customer'",
        enum: ["customer", "restaurant_owner", "driver", "admin"],
      },
      { name: "phone", type: "String" },
      { name: "address", type: "String" },
      { name: "deliveryAddress", type: "Object" }, // { street: String, city: String, zip: String, lat: Number, lon: Number }
    ],
  },
  {
    tableName: "Restaurant",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "address", type: "String", required: true },
      { name: "cuisineType", type: "String" },
      { name: "openingHours", type: "Object" }, // { mon: "9-22", ... }
      { name: "owner", type: "ObjectId", ref: "User" }, // User role restaurant_owner
      { name: "imageUrl", type: "String" },
      { name: "averageRating", type: "Number", default: 0 },
      { name: "deliveryFee", type: "Number", default: 0 },
      { name: "minOrderValue", type: "Number", default: 0 },
    ],
  },
  {
    tableName: "MenuItem",
    fields: [
      {
        name: "restaurant",
        type: "ObjectId",
        ref: "Restaurant",
        required: true,
      },
      { name: "name", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "price", type: "Number", required: true },
      { name: "category", type: "String" }, // e.g., 'Appetizers', 'Main Course', 'Drinks'
      { name: "imageUrl", type: "String" },
      { name: "isAvailable", type: "Boolean", default: true },
    ],
  },
  {
    tableName: "Order",
    fields: [
      { name: "customer", type: "ObjectId", ref: "User", required: true },
      {
        name: "restaurant",
        type: "ObjectId",
        ref: "Restaurant",
        required: true,
      },
      { name: "items", type: "Array", of: "Object" }, // [{ menuItem: ObjectId, quantity: Number, price: Number }]
      { name: "totalAmount", type: "Number", required: true },
      { name: "deliveryAddress", type: "Object", required: true },
      { name: "driver", type: "ObjectId", ref: "User" }, // User role driver
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "preparing", "on-the-way", "delivered", "cancelled"],
      },
      { name: "paymentMethod", type: "String" },
    ],
  },
  {
    tableName: "Review", // Review nhà hàng hoặc món ăn
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      {
        name: "restaurant",
        type: "ObjectId",
        ref: "Restaurant",
        required: true,
      },
      { name: "rating", type: "Number", min: 1, max: 5, required: true },
      { name: "comment", type: "String" },
    ],
  },
];
