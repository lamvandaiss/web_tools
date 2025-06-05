// F:\web_tools\backend\definitions\bookingWebsite.js

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
        enum: ["customer", "provider", "admin"],
      },
      { name: "phone", type: "String" },
      { name: "address", type: "String" },
    ],
  },
  {
    tableName: "Service", // Các dịch vụ có thể đặt lịch
    fields: [
      { name: "name", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "price", type: "Number", required: true },
      { name: "duration", type: "Number", required: true }, // Thời lượng dịch vụ (phút)
      { name: "provider", type: "ObjectId", ref: "User", required: true }, // Người cung cấp dịch vụ
      { name: "category", type: "String" },
    ],
  },
  {
    tableName: "Availability", // Thời gian khả dụng của nhà cung cấp
    fields: [
      { name: "provider", type: "ObjectId", ref: "User", required: true },
      { name: "date", type: "Date", required: true }, // Ngày khả dụng
      { name: "startTime", type: "String", required: true }, // "HH:MM"
      { name: "endTime", type: "String", required: true }, // "HH:MM"
      { name: "isBooked", type: "Boolean", default: false }, // Cho biết slot này đã được đặt chưa
    ],
  },
  {
    tableName: "Booking", // Đơn đặt lịch
    fields: [
      { name: "customer", type: "ObjectId", ref: "User", required: true },
      { name: "service", type: "ObjectId", ref: "Service", required: true },
      { name: "provider", type: "ObjectId", ref: "User", required: true },
      { name: "bookingDate", type: "Date", required: true }, // Ngày đặt lịch
      { name: "bookingTime", type: "String", required: true }, // "HH:MM"
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "confirmed", "cancelled", "completed"],
      },
      { name: "notes", type: "String" },
    ],
  },
];
