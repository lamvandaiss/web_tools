// F:\web_tools\backend\definitions\taskManagementWebsite.js

module.exports = [
  {
    tableName: "User",
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      { name: "profilePicture", type: "String" },
    ],
  },
  {
    tableName: "Project",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "owner", type: "ObjectId", ref: "User", required: true },
      { name: "members", type: "Array", of: "ObjectId", ref: "User" },
      {
        name: "status",
        type: "String",
        default: "'active'",
        enum: ["active", "completed", "archived"],
      },
    ],
  },
  {
    tableName: "Task",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "project", type: "ObjectId", ref: "Project" }, // Optional: task can exist without a project
      { name: "assignedTo", type: "ObjectId", ref: "User" },
      { name: "dueDate", type: "Date" },
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "in-progress", "completed", "blocked"],
      },
      {
        name: "priority",
        type: "String",
        default: "'medium'",
        enum: ["low", "medium", "high"],
      },
    ],
  },
  {
    tableName: "Comment", // Comments on tasks/projects
    fields: [
      { name: "content", type: "String", required: true },
      { name: "author", type: "ObjectId", ref: "User", required: true },
      { name: "task", type: "ObjectId", ref: "Task" }, // Can comment on a task
      { name: "project", type: "ObjectId", ref: "Project" }, // Can comment on a project
    ],
  },
];
