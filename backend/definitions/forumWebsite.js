// F:\web_tools\backend\definitions\forumWebsite.js

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
        default: "'member'",
        enum: ["member", "moderator", "admin"],
      },
      { name: "avatar", type: "String" },
      { name: "postCount", type: "Number", default: 0 },
    ],
  },
  {
    tableName: "Category", // Các chuyên mục diễn đàn
    fields: [
      { name: "name", type: "String", required: true, unique: true },
      { name: "slug", type: "String", required: true, unique: true },
      { name: "description", type: "String" },
    ],
  },
  {
    tableName: "Thread", // Chủ đề/bài viết chính
    fields: [
      { name: "title", type: "String", required: true },
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "category", type: "ObjectId", ref: "Category", required: true },
      { name: "views", type: "Number", default: 0 },
      { name: "repliesCount", type: "Number", default: 0 },
      { name: "isLocked", type: "Boolean", default: false },
      { name: "isPinned", type: "Boolean", default: false },
    ],
  },
  {
    tableName: "Post", // Các bài trả lời trong chủ đề
    fields: [
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "thread", type: "ObjectId", ref: "Thread", required: true },
      { name: "parentPost", type: "ObjectId", ref: "Post" }, // Cho phép trả lời một bài viết cụ thể
    ],
  },
  {
    tableName: "Reaction", // Like/Dislike bài viết/chủ đề
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      {
        name: "targetType",
        type: "String",
        required: true,
        enum: ["Thread", "Post"],
      },
      {
        name: "targetId",
        type: "ObjectId",
        required: true,
        refPath: "targetType",
      }, // Dùng refPath để tham chiếu động
      {
        name: "type",
        type: "String",
        required: true,
        enum: ["like", "dislike"],
      },
    ],
  },
];
