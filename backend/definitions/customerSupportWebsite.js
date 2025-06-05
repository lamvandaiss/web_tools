// F:\web_tools\backend\definitions\customerSupportWebsite.js

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
        default: "'customer'",
        enum: ["customer", "agent", "admin"],
      },
      { name: "phone", type: "String" },
    ],
  },
  {
    tableName: "Ticket", // Yêu cầu hỗ trợ
    fields: [
      { name: "subject", type: "String", required: true },
      { name: "description", type: "String", required: true },
      { name: "customer", type: "ObjectId", ref: "User", required: true },
      { name: "agent", type: "ObjectId", ref: "User" }, // Agent được gán
      {
        name: "status",
        type: "String",
        default: "'open'",
        enum: ["open", "in-progress", "resolved", "closed"],
      },
      {
        name: "priority",
        type: "String",
        default: "'medium'",
        enum: ["low", "medium", "high", "urgent"],
      },
      { name: "category", type: "String" }, // e.g., 'Technical', 'Billing', 'General'
      { name: "attachments", type: "Array", of: "String" }, // URLs của file đính kèm
    ],
  },
  {
    tableName: "Message", // Các tin nhắn trong một Ticket
    fields: [
      { name: "ticket", type: "ObjectId", ref: "Ticket", required: true },
      { name: "sender", type: "ObjectId", ref: "User", required: true },
      { name: "content", type: "String", required: true },
    ],
  },
  {
    tableName: "FAQ", // Các câu hỏi thường gặp
    fields: [
      { name: "question", type: "String", required: true },
      { name: "answer", type: "String", required: true },
      { name: "category", type: "String" },
      { name: "tags", type: "Array", of: "String" },
      { name: "views", type: "Number", default: 0 },
    ],
  },
];
