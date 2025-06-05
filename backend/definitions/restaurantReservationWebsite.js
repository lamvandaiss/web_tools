// F:\web_tools\backend\definitions\restaurantReservationWebsite.js

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
        enum: ["customer", "manager", "admin"],
      },
      { name: "phone", type: "String" },
    ],
  },
  {
    tableName: "Restaurant",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "address", type: "String", required: true },
      { name: "city", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "cuisineType", type: "String" }, // e.g., 'Italian', 'Vietnamese'
      { name: "openingHours", type: "Object" }, // e.g., {mon: "9-22", tue: "9-22"}
      { name: "manager", type: "ObjectId", ref: "User" }, // User role manager
      { name: "images", type: "Array", of: "String" },
    ],
  },
  {
    tableName: "Table", // Bàn trong nhà hàng
    fields: [
      {
        name: "restaurant",
        type: "ObjectId",
        ref: "Restaurant",
        required: true,
      },
      { name: "tableNumber", type: "String", required: true },
      { name: "capacity", type: "Number", required: true }, // Số người tối đa
      { name: "location", type: "String" }, // e.g., 'window', 'patio'
    ],
  },
  {
    tableName: "Reservation",
    fields: [
      { name: "customer", type: "ObjectId", ref: "User", required: true },
      {
        name: "restaurant",
        type: "ObjectId",
        ref: "Restaurant",
        required: true,
      },
      { name: "table", type: "ObjectId", ref: "Table" }, // Optional: specific table if assigned
      { name: "date", type: "Date", required: true },
      { name: "time", type: "String", required: true }, // e.g., "19:00"
      { name: "numberOfGuests", type: "Number", required: true },
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
