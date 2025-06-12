// F:\web_tools\backend\definitions\ecommerceWebsite.js
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
        default: "'user'",
        enum: ["user", "admin"],
      },
      { name: "shippingAddress", type: "Object" },
      { name: "billingAddress", type: "Object" },
      { name: "createdAt", type: "Date", default: "Date.now" },
    ],
  },
  {
    tableName: "Product",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "price", type: "Number", required: true },
      { name: "stock", type: "Number", default: 0 },
      { name: "category", type: "ObjectId", ref: "Category" },
      { name: "images", type: "Array", of: "String" },
      { name: "sku", type: "String", unique: true },
      { name: "createdAt", type: "Date", default: "Date.now" },
    ],
  },
  {
    tableName: "Category",
    fields: [
      { name: "name", type: "String", required: true, unique: true },
      { name: "slug", type: "String", required: true, unique: true },
    ],
  },
  {
    tableName: "Order",
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      {
        name: "items",
        type: "Array",
        of: "Object",
        schemaDefinition: [
          { name: "product", type: "ObjectId", ref: "Product", required: true },
          { name: "quantity", type: "Number", required: true, min: 1 },
          { name: "price", type: "Number", required: true, min: 0 },
        ],
      },
      { name: "totalAmount", type: "Number", required: true },
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
      { name: "orderDate", type: "Date", default: "Date.now" },
    ],
  },
  {
    tableName: "Review",
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "product", type: "ObjectId", ref: "Product", required: true },
      { name: "rating", type: "Number", min: 1, max: 5, required: true },
      { name: "comment", type: "String" },
      { name: "createdAt", type: "Date", default: "Date.now" },
    ],
  },
];
