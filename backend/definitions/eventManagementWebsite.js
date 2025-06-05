// F:\web_tools\backend\definitions\eventManagementWebsite.js

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
        default: "'attendee'",
        enum: ["attendee", "organizer", "admin"],
      },
      { name: "phone", type: "String" },
    ],
  },
  {
    tableName: "Event",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String", required: true },
      { name: "organizer", type: "ObjectId", ref: "User", required: true },
      { name: "startDate", type: "Date", required: true },
      { name: "endDate", type: "Date", required: true },
      { name: "location", type: "String", required: true },
      { name: "price", type: "Number", default: 0 },
      { name: "capacity", type: "Number" },
      { name: "registeredAttendees", type: "Number", default: 0 },
      { name: "imageUrl", type: "String" },
      { name: "isPublished", type: "Boolean", default: false },
    ],
  },
  {
    tableName: "Ticket", // Vé đăng ký tham gia sự kiện
    fields: [
      { name: "event", type: "ObjectId", ref: "Event", required: true },
      { name: "attendee", type: "ObjectId", ref: "User", required: true },
      { name: "ticketType", type: "String" }, // e.g., 'VIP', 'Standard'
      { name: "pricePaid", type: "Number" },
      { name: "isPaid", type: "Boolean", default: false },
      { name: "checkInTime", type: "Date" }, // Thời gian check-in tại sự kiện
    ],
  },
];
