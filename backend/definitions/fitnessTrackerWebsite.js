// F:\web_tools\backend\definitions\fitnessTrackerWebsite.js

module.exports = [
  {
    tableName: "User",
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      { name: "age", type: "Number" },
      { name: "gender", type: "String", enum: ["male", "female", "other"] },
      { name: "heightCm", type: "Number" },
      { name: "weightKg", type: "Number" },
      { name: "goal", type: "String" }, // e.g., 'Lose Weight', 'Build Muscle'
    ],
  },
  {
    tableName: "Workout",
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "date", type: "Date", required: true, default: "Date.now" },
      {
        name: "type",
        type: "String",
        enum: ["cardio", "strength", "yoga", "other"],
      },
      { name: "durationMinutes", type: "Number", required: true },
      { name: "caloriesBurned", type: "Number" },
      { name: "notes", type: "String" },
    ],
  },
  {
    tableName: "Exercise", // Các bài tập cụ thể trong một Workout
    fields: [
      { name: "workout", type: "ObjectId", ref: "Workout", required: true },
      { name: "name", type: "String", required: true },
      { name: "sets", type: "Number" },
      { name: "reps", type: "Number" },
      { name: "weightKg", type: "Number" },
      { name: "distanceKm", type: "Number" },
      { name: "durationMinutes", type: "Number" },
    ],
  },
  {
    tableName: "FoodLog", // Nhật ký thức ăn
    fields: [
      { name: "user", type: "ObjectId", ref: "User", required: true },
      { name: "date", type: "Date", required: true, default: "Date.now" },
      { name: "foodItem", type: "String", required: true },
      { name: "calories", type: "Number", required: true },
      { name: "proteinGrams", type: "Number" },
      { name: "carbGrams", type: "Number" },
      { name: "fatGrams", type: "Number" },
      {
        name: "mealType",
        type: "String",
        enum: ["breakfast", "lunch", "dinner", "snack"],
      },
    ],
  },
];
