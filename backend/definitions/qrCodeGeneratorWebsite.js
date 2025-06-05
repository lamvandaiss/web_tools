// F:\web_tools\backend\definitions\qrCodeGeneratorWebsite.js

module.exports = [
  {
    tableName: "User", // Người dùng tạo mã QR
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      {
        name: "plan",
        type: "String",
        default: "'free'",
        enum: ["free", "premium"],
      },
    ],
  },
  {
    tableName: "QRCode", // Mã QR đã tạo
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "data", type: "String", required: true }, // Dữ liệu được mã hóa (URL, text, etc.)
      {
        name: "type",
        type: "String",
        default: "'url'",
        enum: ["url", "text", "wifi", "vcard", "email", "phone"],
      },
      { name: "imageUrl", type: "String", required: true }, // URL đến ảnh QR đã tạo
      { name: "shortUrl", type: "String", unique: true }, // URL rút gọn để truy cập QR
      { name: "scans", type: "Number", default: 0 }, // Số lượt quét
      { name: "expiresAt", type: "Date" }, // Ngày hết hạn của QR (tùy chọn)
    ],
  },
  {
    tableName: "ScanLog", // Nhật ký quét mã QR (để theo dõi hiệu suất)
    fields: [
      { name: "qrCode", type: "ObjectId", ref: "QRCode", required: true },
      { name: "scanTime", type: "Date", required: true, default: "Date.now" },
      { name: "ipAddress", type: "String" },
      { name: "userAgent", type: "String" }, // Thông tin thiết bị/trình duyệt của người quét
      { name: "location", type: "Object" }, // { lat: Number, lon: Number }
    ],
  },
];
