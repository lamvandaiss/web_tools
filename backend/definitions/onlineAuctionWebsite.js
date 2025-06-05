// F:\web_tools\backend\definitions\onlineAuctionWebsite.js

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
        default: "'bidder'",
        enum: ["bidder", "seller", "admin"],
      },
      { name: "address", type: "String" },
    ],
  },
  {
    tableName: "Item", // Sản phẩm đấu giá
    fields: [
      { name: "name", type: "String", required: true },
      { name: "description", type: "String" },
      { name: "seller", type: "ObjectId", ref: "User", required: true },
      { name: "startPrice", type: "Number", required: true },
      { name: "currentBid", type: "Number", default: 0 },
      { name: "buyItNowPrice", type: "Number" }, // Tùy chọn: giá mua ngay
      { name: "startTime", type: "Date", required: true },
      { name: "endTime", type: "Date", required: true },
      {
        name: "status",
        type: "String",
        default: "'active'",
        enum: ["active", "closed", "cancelled"],
      },
      { name: "images", type: "Array", of: "String" },
      { name: "category", type: "String" },
      { name: "highestBidder", type: "ObjectId", ref: "User" },
    ],
  },
  {
    tableName: "Bid", // Lịch sử các lượt đấu giá
    fields: [
      { name: "item", type: "ObjectId", ref: "Item", required: true },
      { name: "bidder", type: "ObjectId", ref: "User", required: true },
      { name: "amount", type: "Number", required: true },
      { name: "isWinningBid", type: "Boolean", default: false },
    ],
  },
  {
    tableName: "Order", // Đơn hàng sau khi đấu giá thành công
    fields: [
      { name: "item", type: "ObjectId", ref: "Item", required: true },
      { name: "buyer", type: "ObjectId", ref: "User", required: true },
      { name: "seller", type: "ObjectId", ref: "User", required: true },
      { name: "finalPrice", type: "Number", required: true },
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      },
      { name: "shippingAddress", type: "Object" }, // { street, city, zip }
    ],
  },
];
