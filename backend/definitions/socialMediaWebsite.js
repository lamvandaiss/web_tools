// F:\web_tools\backend\definitions\socialMediaWebsite.js

module.exports = [
  {
    tableName: "User",
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      { name: "fullName", type: "String" },
      { name: "profilePicture", type: "String" },
      { name: "bio", type: "String" },
      { name: "followers", type: "Array", of: "ObjectId", ref: "User" },
      { name: "following", type: "Array", of: "ObjectId", ref: "User" },
    ],
  },
  {
    tableName: "Post",
    fields: [
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "imageUrl", type: "String" },
      { name: "likesCount", type: "Number", default: 0 },
      { name: "commentsCount", type: "Number", default: 0 },
    ],
  },
  {
    tableName: "Comment",
    fields: [
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "post", type: "ObjectId", ref: "Post", required: true },
    ],
  },
  {
    tableName: "Like", // Để lưu trữ ai đã like bài nào
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "post", type: "ObjectId", ref: "Post", required: true },
    ],
  },
];
