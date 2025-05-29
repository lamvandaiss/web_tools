const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const _ = require("lodash");

// Hàm để sinh mã dựa trên định nghĩa bảng
async function generateCode(tableDefinition) {
  const { tableName, fields } = tableDefinition;
  const capitalizedTableName = _.capitalize(_.camelCase(tableName));
  const camelCaseTableName = _.camelCase(tableName);

  const outputDir = path.join(
    __dirname,
    "..",
    "generated_code",
    camelCaseTableName
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const modelDir = path.join(outputDir, "models");
  const controllerDir = path.join(outputDir, "controllers");
  const routesDir = path.join(outputDir, "routes");

  [modelDir, controllerDir, routesDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });

  const templateData = {
    tableName: camelCaseTableName,
    capitalizedTableName: capitalizedTableName,
    fields: fields,
    _: _,
  };

  // 1. Sinh Model
  const modelTemplatePath = path.join(
    __dirname,
    "../gen_templates",
    "model.js.ejs"
  );
  let modelCode = await ejs.renderFile(modelTemplatePath, templateData);
  fs.writeFileSync(path.join(modelDir, `${camelCaseTableName}.js`), modelCode);
  console.log(`Generated Model: ${modelDir}/${camelCaseTableName}.js`);
  // 2. Sinh Controller
  const controllerTemplatePath = path.join(
    __dirname,
    "../gen_templates",
    "controller.js.ejs"
  );
  let controllerCode = await ejs.renderFile(
    controllerTemplatePath,
    templateData
  );
  fs.writeFileSync(
    path.join(controllerDir, `${camelCaseTableName}Controller.js`),
    controllerCode
  );
  console.log(
    `Generated Controller: ${controllerDir}/${camelCaseTableName}Controller.js`
  ); // Đã sửa

  // 3. Sinh Route
  const routeTemplatePath = path.join(
    __dirname,
    "../gen_templates",
    "route.js.ejs"
  );
  let routeCode = await ejs.renderFile(routeTemplatePath, templateData);
  fs.writeFileSync(
    path.join(routesDir, `${camelCaseTableName}Routes.js`),
    routeCode
  );
  console.log(`Generated Route: ${routesDir}/${camelCaseTableName}Routes.js`); // Đã sửa

  console.log(`\nCode generation completed for table: ${tableName}`);
  console.log(`Output directory: ${outputDir}`);
}

exports.runTests = async (req, res) => {
  const ejs = require("ejs");
  console.log(typeof ejs.renderFile);
  // Định nghĩa mẫu bảng đầu vào
  const userTableDefinition = {
    tableName: "User",
    fields: [
      { name: "username", type: "String", required: true, unique: true },
      { name: "email", type: "String", required: true, unique: true },
      { name: "password", type: "String", required: true },
      { name: "age", type: "Number", required: false },
      { name: "isAdmin", type: "Boolean", default: false },
      { name: "createdAt", type: "Date", default: "Date.now" }, // Lưu ý: default là string, cần xử lý trong model
    ],
  };

  const productTableDefinition = {
    tableName: "Product",
    fields: [
      { name: "name", type: "String", required: true },
      { name: "price", type: "Number", required: true },
      { name: "description", type: "String" },
      { name: "category", type: "String" },
      { name: "stock", type: "Number", default: 0 },
    ],
  };
  console.log("--- Generating code for User table ---");
  await generateCode(userTableDefinition);

  console.log("\n--- Generating code for Product table ---");
  await generateCode(productTableDefinition);

  // Bạn có thể thêm các định nghĩa bảng khác để test
};
