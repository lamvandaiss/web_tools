// F:\web_tools\backend\definitions\projectManagementWebsite.js

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
        enum: ["member", "manager", "admin"],
      },
      { name: "profilePicture", type: "String" },
    ],
  },
  {
    tableName: "Project",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "startDate", type: "Date" },
      { name: "endDate", type: "Date" },
      {
        name: "status",
        type: "String",
        default: "'active'",
        enum: ["active", "completed", "on-hold", "cancelled"],
      },
      { name: "owner", type: "ObjectId", ref: "User", required: true },
      { name: "members", type: "Array", of: "ObjectId", ref: "User" },
    ],
  },
  {
    tableName: "Task",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "project", type: "ObjectId", ref: "Project", required: true },
      { name: "assignedTo", type: "ObjectId", ref: "User" },
      { name: "dueDate", type: "Date" },
      {
        name: "status",
        type: "String",
        default: "'todo'",
        enum: ["todo", "in-progress", "done", "blocked"],
      },
      {
        name: "priority",
        type: "String",
        default: "'medium'",
        enum: ["low", "medium", "high"],
      },
      { name: "attachments", type: "Array", of: "String" }, // URLs to attached files
    ],
  },
  {
    tableName: "Comment", // Bình luận trên tác vụ hoặc dự án
    fields: [
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "task", type: "ObjectId", ref: "Task" },
      { name: "project", type: "ObjectId", ref: "Project" },
    ],
  },
];
