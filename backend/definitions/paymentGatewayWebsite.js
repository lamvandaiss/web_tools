// F:\web_tools\backend\definitions\paymentGatewayWebsite.js

module.exports = [
  {
    tableName: "User", // Người dùng hệ thống (có thể là thương gia hoặc admin)
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      {
        name: "role",
        type: "String",
        default: "'merchant'",
        enum: ["merchant", "admin"],
      },
      { name: "balance", type: "Number", default: 0 }, // Số dư ví
    ],
  },
  {
    tableName: "Transaction", // Giao dịch thanh toán
    fields: [
      { name: "amount", type: "Number", required: true },
      {
        name: "currency",
        type: "String",
        default: "'VND'",
        enum: ["VND", "USD", "EUR"],
      },
      { name: "sender", type: "ObjectId", ref: "User" }, // Người gửi tiền (tùy chọn)
      { name: "receiver", type: "ObjectId", ref: "User", required: true }, // Người nhận tiền / Merchant
      {
        name: "type",
        type: "String",
        required: true,
        enum: ["deposit", "withdrawal", "payment", "refund"],
      },
      {
        name: "status",
        type: "String",
        default: "'pending'",
        enum: ["pending", "completed", "failed", "refunded"],
      },
      { name: "referenceId", type: "String", unique: true }, // ID tham chiếu từ bên ngoài (e.g., ID đơn hàng)
      { name: "description", type: "String" },
    ],
  },
  {
    tableName: "PaymentMethod", // Phương thức thanh toán của người dùng/thương gia
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      {
        name: "type",
        type: "String",
        required: true,
        enum: ["card", "bank_transfer", "e_wallet"],
      },
      { name: "details", type: "Object" }, // { cardNumber: String, expiry: String, ... } - THẬN TRỌNG VỚI DỮ LIỆU NHẠY CẢM
      { name: "isDefault", type: "Boolean", default: false },
    ],
  },
];
