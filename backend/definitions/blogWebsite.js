// F:\web_tools\backend\definitions\blogWebsite.js

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
        default: "'reader'",
        enum: ["reader", "author", "admin"],
      },
      { name: "bio", type: "String" },
      { name: "profilePicture", type: "String" },
    ],
  },
  {
    tableName: "Category",
    fields: [
      { name: "name", type: "String", required: true, unique: true },
      { name: "slug", type: "String", required: true, unique: true },
      { name: "description", type: "String" },
    ],
  },
  {
    tableName: "Post",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "slug", type: "String", required: true, unique: true },
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "categories", type: "Array", of: "ObjectId", ref: "Category" },
      { name: "tags", type: "Array", of: "String" },
      {
        name: "status",
        type: "String",
        default: "'draft'",
        enum: ["draft", "published", "archived"],
      },
      { name: "publishedAt", type: "Date" },
      { name: "featuredImage", type: "String" },
      { name: "views", type: "Number", default: 0 },
    ],
  },
  {
    tableName: "Comment",
    fields: [
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "post", type: "ObjectId", ref: "Post", required: true },
      { name: "parentComment", type: "ObjectId", ref: "Comment" }, // Để comment trả lời
    ],
  },
];
