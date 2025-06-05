// F:\web_tools\backend\definitions\chatApplicationWebsite.js

module.exports = [
  {
    tableName: "User",
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      {
        name: "status",
        type: "String",
        default: "'offline'",
        enum: ["online", "offline", "busy"],
      },
      { name: "profilePicture", type: "String" },
      { name: "lastActive", type: "Date" },
    ],
  },
  {
    tableName: "Conversation", // Cuộc trò chuyện (riêng tư hoặc nhóm)
    fields: [
      {
        name: "participants",
        type: "Array",
        of: "ObjectId",
        ref: "User",
        required: true,
      },
      {
        name: "type",
        type: "String",
        default: "'private'",
        enum: ["private", "group"],
      },
      { name: "name", type: "String" }, // Tên nhóm nếu là nhóm
      { name: "lastMessage", type: "ObjectId", ref: "Message" }, // Tham chiếu đến tin nhắn cuối cùng
    ],
  },
  {
    tableName: "Message", // Tin nhắn
    fields: [
      {
        name: "conversation",
        type: "ObjectId",
        ref: "Conversation",
        required: true,
      },
      { name: "sender", type: "ObjectId", ref: "User", required: true },
      { name: "content", type: "String", required: true },
      {
        name: "type",
        type: "String",
        default: "'text'",
        enum: ["text", "image", "video", "file"],
      },
      { name: "imageUrl", type: "String" }, // Nếu là ảnh
      { name: "readBy", type: "Array", of: "ObjectId", ref: "User" }, // Những ai đã đọc
    ],
  },
];
