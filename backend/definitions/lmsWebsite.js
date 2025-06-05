// F:\web_tools\backend\definitions\lmsWebsite.js

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
        default: "'student'",
        enum: ["student", "instructor", "admin"],
      },
      { name: "bio", type: "String" },
      { name: "profilePicture", type: "String" },
    ],
  },
  {
    tableName: "Course",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String", required: true },
      { name: "instructor", type: "ObjectId", ref: "User", required: true },
      { name: "category", type: "String" },
      { name: "price", type: "Number", default: 0 },
      { name: "isPublished", type: "Boolean", default: false },
      { name: "thumbnail", type: "String" },
      { name: "students", type: "Array", of: "ObjectId", ref: "User" }, // Students enrolled in this course
    ],
  },
  {
    tableName: "Module", // Các chương trong khóa học
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "course", type: "ObjectId", ref: "Course", required: true },
      { name: "order", type: "Number", required: true }, // Thứ tự của module
    ],
  },
  {
    tableName: "Lesson", // Các bài học trong module
    fields: [
      { name: "title", type: "String", required: true },
      { name: "content", type: "String" }, // Nội dung HTML/Markdown của bài học
      { name: "module", type: "ObjectId", ref: "Module", required: true },
      { name: "order", type: "Number", required: true },
      { name: "videoUrl", type: "String" },
      {
        name: "type",
        type: "String",
        default: "'text'",
        enum: ["text", "video", "quiz", "assignment"],
      },
    ],
  },
  {
    tableName: "Enrollment", // Ghi danh học viên vào khóa học
    fields: [
      { name: "student", type: "ObjectId", ref: "User", required: true },
      { name: "course", type: "ObjectId", ref: "Course", required: true },
      { name: "progress", type: "Number", default: 0 }, // Phần trăm hoàn thành khóa học
      {
        name: "status",
        type: "String",
        default: "'in-progress'",
        enum: ["in-progress", "completed", "dropped"],
      },
      { name: "completionDate", type: "Date" },
    ],
  },
];
