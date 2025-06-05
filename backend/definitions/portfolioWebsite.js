// F:\web_tools\backend\definitions\portfolioWebsite.js

module.exports = [
  {
    tableName: "User", // Đại diện cho chủ sở hữu portfolio
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      { name: "fullName", type: "String" },
      { name: "title", type: "String" }, // E.g., "Web Developer", "Graphic Designer"
      { name: "bio", type: "String" },
      { name: "profilePicture", type: "String" },
      { name: "resumeUrl", type: "String" },
      { name: "socialLinks", type: "Object" }, // { linkedin: String, github: String, ... }
    ],
  },
  {
    tableName: "Project", // Các dự án/công việc trong portfolio
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String", required: true },
      { name: "imageUrl", type: "String" }, // Ảnh đại diện của dự án
      { name: "projectUrl", type: "String" }, // Link đến dự án trực tiếp
      { name: "githubUrl", type: "String" }, // Link GitHub
      { name: "technologies", type: "Array", of: "String" },
      { name: "category", type: "String" }, // E.g., "Web Development", "Mobile App", "Graphic Design"
      { name: "user", type: "ObjectId", ref: "User", required: true }, // Chủ sở hữu dự án
    ],
  },
  {
    tableName: "Skill", // Kỹ năng của chủ sở hữu
    fields: [
      { name: "name", type: "String", required: true, unique: true },
      {
        name: "level",
        type: "String",
        enum: ["beginner", "intermediate", "advanced", "expert"],
      },
      { name: "user", type: "ObjectId", ref: "User", required: true },
    ],
  },
  {
    tableName: "Testimonial", // Lời chứng thực
    fields: [
      { name: "authorName", type: "String", required: true },
      { name: "authorTitle", type: "String" },
      { name: "content", type: "String", required: true },
      { name: "user", type: "ObjectId", ref: "User", required: true }, // Người được chứng thực
    ],
  },
];
