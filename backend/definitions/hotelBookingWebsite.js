// F:\web_tools\backend\definitions\hotelBookingWebsite.js

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
        default: "'guest'",
        enum: ["guest", "hotel_manager", "admin"],
      },
      { name: "phone", type: "String" },
    ],
  },
  {
    tableName: "Hotel",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "address", type: "String", required: true },
      { name: "city", type: "String", required: true },
      { name: "country", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "amenities", type: "Array", of: "String" }, // Wifi, Pool, Parking, etc.
      { name: "images", type: "Array", of: "String" }, // URLs of hotel images
      { name: "manager", type: "ObjectId", ref: "User" }, // User role hotel_manager
    ],
  },
  {
    tableName: "RoomType", // Loại phòng (Standard, Deluxe, Suite)
    fields: [
      { name: "hotel", type: "ObjectId", ref: "Hotel", required: true },
      { name: "name", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "pricePerNight", type: "Number", required: true },
      { name: "capacity", type: "Number", required: true }, // Max guests
      { name: "totalRooms", type: "Number", required: true },
      { name: "availableRooms", type: "Number", required: true },
      { name: "images", type: "Array", of: "String" },
    ],
  },
  {
    tableName: "Booking",
    fields: [
      { name: "guest", type: "ObjectId", ref: "User", required: true },
      { name: "roomType", type: "ObjectId", ref: "RoomType", required: true },
      { name: "hotel", type: "ObjectId", ref: "Hotel", required: true },
      { name: "checkInDate", type: "Date", required: true },
      { name: "checkOutDate", type: "Date", required: true },
      { name: "numberOfGuests", type: "Number", required: true },
      { name: "totalPrice", type: "Number", required: true },
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "confirmed", "cancelled", "completed"],
      },
    ],
  },
];
