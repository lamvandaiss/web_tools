// F:\web_tools\backend\definitions\ecommerceWebsite.js
module.exports = {
  type: "ecommerce",
  name: "Website Bán hàng",
  description:
    "Cấu hình backend cho một website bán hàng cơ bản với các bảng Product, Order, User, Category, Review.",
  tables: [
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
        { name: "shippingAddress", type: "Object" }, // Có thể là { street: String, city: String, ... }
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
        { name: "category", type: "ObjectId", ref: "Category" }, // Liên kết với Category
        { name: "images", type: "Array", of: "String" }, // Mảng các URL hình ảnh
        { name: "sku", type: "String", unique: true }, // Mã sản phẩm
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
        { name: "user", type: "ObjectId", ref: "User", required: true }, // Liên kết với User
        { name: "items", type: "Array", of: "Object" }, // Mảng các OrderItem (productId, quantity, price)
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
  ],
};
