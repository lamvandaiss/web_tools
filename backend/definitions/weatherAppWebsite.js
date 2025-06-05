// F:\web_tools\backend\definitions\weatherAppWebsite.js

module.exports = [
  {
    tableName: "User", // Người dùng (có thể lưu vị trí yêu thích)
    fields: [
      { name: "username", type: "String", unique: true }, // Optional for public app
      { name: "email", type: "String", unique: true },
      { name: "password", type: "String" },
      { name: "favoriteLocations", type: "Array", of: "Object" }, // [{ name: String, lat: Number, lon: Number }]
    ],
  },
  {
    tableName: "Location", // Vị trí địa lý
    fields: [
      { name: "name", type: "String", required: true, unique: true }, // E.g., "Ho Chi Minh City"
      { name: "latitude", type: "Number", required: true },
      { name: "longitude", type: "Number", required: true },
      { name: "country", type: "String" },
    ],
  },
  {
    tableName: "WeatherData", // Dữ liệu thời tiết tại một thời điểm
    fields: [
      { name: "location", type: "ObjectId", ref: "Location", required: true },
      { name: "timestamp", type: "Date", required: true, default: "Date.now" },
      { name: "temperatureC", type: "Number" },
      { name: "temperatureF", type: "Number" },
      { name: "condition", type: "String" }, // E.g., "Clear", "Cloudy", "Rainy"
      { name: "humidity", type: "Number" }, // Percentage
      { name: "windSpeedKmh", type: "Number" },
      { name: "pressureMb", type: "Number" },
      { name: "iconCode", type: "String" }, // Code icon thời tiết để hiển thị frontend
    ],
  },
];
