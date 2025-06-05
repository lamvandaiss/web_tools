// F:\web_tools\backend\definitions\realEstateWebsite.js

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
        default: "'buyer'",
        enum: ["buyer", "agent", "admin"],
      },
      { name: "phone", type: "String" },
      { name: "companyName", type: "String" }, // For agents
    ],
  },
  {
    tableName: "Property",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String", required: true },
      { name: "address", type: "String", required: true },
      { name: "city", type: "String", required: true },
      { name: "state", type: "String" },
      { name: "zipCode", type: "String" },
      { name: "price", type: "Number", required: true },
      { name: "bedrooms", type: "Number" },
      { name: "bathrooms", type: "Number" },
      { name: "squareFootage", type: "Number" },
      {
        name: "propertyType",
        type: "String",
        enum: ["house", "apartment", "condo", "land"],
      },
      { name: "listingAgent", type: "ObjectId", ref: "User", required: true },
      { name: "images", type: "Array", of: "String" }, // URLs of images
      { name: "isAvailable", type: "Boolean", default: true },
    ],
  },
  {
    tableName: "Inquiry", // Yêu cầu thông tin/đặt lịch xem
    fields: [
      { name: "customer", type: "ObjectId", ref: "User", required: true },
      { name: "property", type: "ObjectId", ref: "Property", required: true },
      { name: "message", type: "String" },
      { name: "contactMethod", type: "String" },
      {
        name: "status",
        type: "String",
        default: "'new'",
        enum: ["new", "contacted", "resolved"],
      },
    ],
  },
];
