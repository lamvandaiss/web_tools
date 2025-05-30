// F:\web_tools\backend\definitions\newsWebsite.js
module.exports = {
  type: "news",
  name: "Website Tin tức",
  description:
    "Cấu hình backend cho một website tin tức cơ bản với các bảng User, Post, Category, Comment.",
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
          default: "user",
          enum: ["user", "admin"],
        }, // Thêm trường role
        { name: "createdAt", type: "Date", default: "Date.now" },
      ],
    },
    {
      tableName: "Post",
      fields: [
        { name: "title", type: "String", required: true },
        { name: "content", type: "String", required: true },
        { name: "author", type: "ObjectId", ref: "User", required: true }, // Liên kết với User
        { name: "category", type: "ObjectId", ref: "Category" }, // Liên kết với Category
        { name: "tags", type: "Array", of: "String" },
        { name: "publishedDate", type: "Date", default: "Date.now" },
        { name: "imageUrl", type: "String" },
        { name: "views", type: "Number", default: 0 },
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
      tableName: "Comment",
      fields: [
        { name: "content", type: "String", required: true },
        { name: "author", type: "ObjectId", ref: "User" }, // Liên kết với User
        { name: "post", type: "ObjectId", ref: "Post", required: true }, // Liên kết với Post
        { name: "createdAt", type: "Date", default: "Date.now" },
      ],
    },
  ],
};
