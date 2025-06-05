// F:\web_tools\backend\definitions\surveyPollingWebsite.js

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
        default: "'participant'",
        enum: ["participant", "creator", "admin"],
      },
    ],
  },
  {
    tableName: "Survey", // Hoặc Poll
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "creator", type: "ObjectId", ref: "User", required: true },
      {
        name: "type",
        type: "String",
        default: "'survey'",
        enum: ["survey", "poll"],
      },
      {
        name: "status",
        type: "String",
        default: "'draft'",
        enum: ["draft", "active", "closed"],
      },
      { name: "startDate", type: "Date" },
      { name: "endDate", type: "Date" },
      { name: "isAnonymous", type: "Boolean", default: false },
      { name: "totalResponses", type: "Number", default: 0 },
    ],
  },
  {
    tableName: "Question",
    fields: [
      { name: "survey", type: "ObjectId", ref: "Survey", required: true },
      { name: "text", type: "String", required: true },
      {
        name: "type",
        type: "String",
        required: true,
        enum: ["text", "single-choice", "multi-choice", "rating"],
      },
      { name: "options", type: "Array", of: "String" }, // For single/multi-choice questions
      { name: "isRequired", type: "Boolean", default: false },
      { name: "order", type: "Number", required: true },
    ],
  },
  {
    tableName: "Response", // Câu trả lời của người tham gia
    fields: [
      { name: "survey", type: "ObjectId", ref: "Survey", required: true },
      { name: "user", type: "ObjectId", ref: "User" }, // Có thể null nếu khảo sát ẩn danh
      { name: "answers", type: "Array", of: "Object" }, // Array of { questionId: ObjectId, value: String/Array/Number }
      // Ví dụ: answers: [{ question: 'questionId1', value: 'Option A' }, { question: 'questionId2', value: ['Option X', 'Option Y'] }]
    ],
  },
];
