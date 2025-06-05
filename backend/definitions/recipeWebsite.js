// F:\web_tools\backend\definitions\recipeWebsite.js

module.exports = [
  {
    tableName: "User",
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      { name: "bio", type: "String" },
      { name: "profilePicture", type: "String" },
    ],
  },
  {
    tableName: "Category", // Ví dụ: Món khai vị, Món chính, Tráng miệng
    fields: [
      { name: "name", type: "String", required: true, unique: true },
      { name: "description", type: "String" },
    ],
  },
  {
    tableName: "Recipe",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "ingredients", type: "Array", of: "String", required: true },
      { name: "instructions", type: "Array", of: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "category", type: "ObjectId", ref: "Category" },
      { name: "prepTime", type: "Number" }, // In minutes
      { name: "cookTime", type: "Number" }, // In minutes
      { name: "servings", type: "Number" },
      { name: "imageUrl", type: "String" },
      { name: "averageRating", type: "Number", default: 0 },
      { name: "reviewsCount", type: "Number", default: 0 },
    ],
  },
  {
    tableName: "Review",
    fields: [
      { name: "recipe", type: "ObjectId", ref: "Recipe", required: true },
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "rating", type: "Number", min: 1, max: 5, required: true },
      { name: "comment", type: "String" },
    ],
  },
];
