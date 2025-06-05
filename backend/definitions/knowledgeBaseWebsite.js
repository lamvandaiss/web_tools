// F:\web_tools\backend\definitions\knowledgeBaseWebsite.js

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
        default: "'contributor'",
        enum: ["contributor", "editor", "admin"],
      },
    ],
  },
  {
    tableName: "Category", // Các chuyên mục của bài viết
    fields: [
      { name: "name", type: "String", required: true, unique: true },
      { name: "slug", type: "String", required: true, unique: true },
      { name: "description", type: "String" },
    ],
  },
  {
    tableName: "Article", // Bài viết trong cơ sở tri thức
    fields: [
      { name: "title", type: "String", required: true },
      { name: "slug", type: "String", required: true, unique: true },
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "category", type: "ObjectId", ref: "Category", required: true },
      { name: "tags", type: "Array", of: "String" },
      { name: "isPublished", type: "Boolean", default: false },
      { name: "views", type: "Number", default: 0 },
      { name: "lastEditedBy", type: "ObjectId", ref: "User" },
    ],
  },
  {
    tableName: "Comment", // Bình luận trên bài viết
    fields: [
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "article", type: "ObjectId", ref: "Article", required: true },
    ],
  },
];
