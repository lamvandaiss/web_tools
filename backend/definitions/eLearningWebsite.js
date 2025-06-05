// F:\web_tools\backend\definitions\eLearningWebsite.js

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
      { name: "profilePicture", type: "String" },
      { name: "bio", type: "String" },
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
      { name: "thumbnail", type: "String" },
      {
        name: "status",
        type: "String",
        default: "'draft'",
        enum: ["draft", "published", "archived"],
      },
    ],
  },
  {
    tableName: "Section", // Các phần/chương trong khóa học
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "course", type: "ObjectId", ref: "Course", required: true },
      { name: "order", type: "Number", required: true },
    ],
  },
  {
    tableName: "Lesson", // Các bài học cụ thể (video, text, quiz)
    fields: [
      { name: "title", type: "String", required: true },
      { name: "content", type: "String" }, // HTML or text
      { name: "videoUrl", type: "String" },
      {
        name: "type",
        type: "String",
        default: "'text'",
        enum: ["text", "video", "quiz", "assignment"],
      },
      { name: "section", type: "ObjectId", ref: "Section", required: true },
      { name: "order", type: "Number", required: true },
    ],
  },
  {
    tableName: "Enrollment", // Ghi danh của học viên
    fields: [
      { name: "student", type: "ObjectId", ref: "User", required: true },
      { name: "course", type: "ObjectId", ref: "Course", required: true },
      { name: "progress", type: "Number", default: 0 }, // percentage completion
      {
        name: "status",
        type: "String",
        default: "'in-progress'",
        enum: ["in-progress", "completed", "dropped"],
      },
    ],
  },
  {
    tableName: "QuizResult", // Kết quả bài kiểm tra
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "lesson", type: "ObjectId", ref: "Lesson", required: true }, // Referencing a 'quiz' type lesson
      { name: "score", type: "Number", required: true },
      { name: "totalQuestions", type: "Number", required: true },
      { name: "passed", type: "Boolean", default: false },
    ],
  },
];
