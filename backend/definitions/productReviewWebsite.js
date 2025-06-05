// F:\web_tools\backend\definitions\productReviewWebsite.js

module.exports = [
  {
    tableName: "User",
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      { name: "profilePicture", type: "String" },
    ],
  },
  {
    tableName: "Product", // Sản phẩm được đánh giá
    fields: [
      { name: "name", type: "String", required: true, unique: true },
      { name: "brand", type: "String" },
      { name: "description", type: "String" },
      { name: "category", type: "String" },
      { name: "imageUrl", type: "String" },
      { name: "averageRating", type: "Number", default: 0 },
      { name: "totalReviews", type: "Number", default: 0 },
    ],
  },
  {
    tableName: "Review",
    fields: [
      { name: "product", type: "ObjectId", ref: "Product", required: true },
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "rating", type: "Number", min: 1, max: 5, required: true },
      { name: "comment", type: "String" },
      { name: "pros", type: "Array", of: "String" }, // Ưu điểm
      { name: "cons", type: "Array", of: "String" }, // Nhược điểm
      { name: "isRecommended", type: "Boolean" },
      { name: "likes", type: "Number", default: 0 }, // Số lượt thích review này
      { name: "dislikes", type: "Number", default: 0 }, // Số lượt không thích review này
    ],
  },
];
