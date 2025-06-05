// F:\web_tools\backend\definitions\ticketBookingWebsite.js

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
        enum: ["customer", "organizer", "admin"],
      },
      { name: "phone", type: "String" },
    ],
  },
  {
    tableName: "Event", // Có thể là phim, buổi hòa nhạc, chuyến bay, v.v.
    fields: [
      { name: "title", type: "String", required: true },
      { name: "description", type: "String" },
      {
        name: "type",
        type: "String",
        required: true,
        enum: ["movie", "concert", "flight", "sports", "other"],
      },
      { name: "location", type: "String", required: true },
      { name: "startTime", type: "Date", required: true },
      { name: "endTime", type: "Date" },
      { name: "organizer", type: "ObjectId", ref: "User" }, // Nếu là organizer
      { name: "imageUrl", type: "String" },
      { name: "totalTickets", type: "Number" },
      { name: "availableTickets", type: "Number" },
    ],
  },
  {
    tableName: "TicketType", // Loại vé (Standard, VIP, Economy, Business)
    fields: [
      { name: "event", type: "ObjectId", ref: "Event", required: true },
      { name: "name", type: "String", required: true },
      { name: "price", type: "Number", required: true },
      { name: "quantity", type: "Number", required: true }, // Số lượng vé loại này
      { name: "description", type: "String" },
    ],
  },
  {
    tableName: "Order", // Đơn hàng chứa các vé đã đặt
    fields: [
      { name: "customer", type: "ObjectId", ref: "User", required: true },
      { name: "event", type: "ObjectId", ref: "Event", required: true },
      { name: "items", type: "Array", of: "Object" }, // e.g., [{ ticketType: ObjectId, quantity: Number, price: Number }]
      { name: "totalAmount", type: "Number", required: true },
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "confirmed", "cancelled", "completed"],
      },
      { name: "paymentMethod", type: "String" },
    ],
  },
];
