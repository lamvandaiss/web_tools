// F:\web_tools\backend\definitions\photoGalleryWebsite.js

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
      { name: "bio", type: "String" },
    ],
  },
  {
    tableName: "Album",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "isPublic", type: "Boolean", default: true },
      { name: "coverImage", type: "String" },
    ],
  },
  {
    tableName: "Photo",
    fields: [
      { name: "title", type: "String" },
      { name: "description", type: "String" },
      { name: "url", type: "String", required: true },
      { name: "album", type: "ObjectId", ref: "Album" },
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "tags", type: "Array", of: "String" },
      { name: "metadata", type: "Object" },
    ],
  },
  {
    tableName: "Comment",
    fields: [
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "photo", type: "ObjectId", ref: "Photo", required: true },
    ],
  },
];
