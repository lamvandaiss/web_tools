// F:\web_tools\backend\definitions\jobBoardWebsite.js

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
        default: "'job_seeker'",
        enum: ["job_seeker", "employer", "admin"],
      },
      { name: "companyName", type: "String" }, // For employers
      { name: "bio", type: "String" },
    ],
  },
  {
    tableName: "JobPosting",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String", required: true },
      { name: "company", type: "ObjectId", ref: "User", required: true }, // Employer ID
      { name: "location", type: "String" },
      { name: "salaryRange", type: "String" },
      {
        name: "jobType",
        type: "String",
        enum: ["full-time", "part-time", "contract", "internship"],
      },
      { name: "skillsRequired", type: "Array", of: "String" },
      { name: "applicationDeadline", type: "Date" },
      { name: "isPublished", type: "Boolean", default: false },
    ],
  },
  {
    tableName: "Application",
    fields: [
      { name: "jobSeeker", type: "ObjectId", ref: "User", required: true },
      {
        name: "jobPosting",
        type: "ObjectId",
        ref: "JobPosting",
        required: true,
      },
      { name: "resumeUrl", type: "String" },
      { name: "coverLetterUrl", type: "String" },
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "reviewed", "interview", "rejected", "hired"],
      },
    ],
  },
];
