const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const _ = require("lodash");

const GENERATED_CODE_ROOT_DIR = path.join(
  __dirname,
  "..", // Ra khỏi thư mục 'controllers'
  "generated_code" // Vào thư mục 'generated_code'
);

// Đường dẫn đến thư mục chứa các template (model.js.ejs, controller.js.ejs, etc.)
const TEMPLATES_DIR = path.join(__dirname, "../gen_templates");
// Một mảng để lưu trữ tên các route file đã sinh ra
const generatedRouteFiles = [];
// Đường dẫn đến thư mục chứa các định nghĩa website mới
const DEFINITIONS_DIR = path.join(
  __dirname,
  "..", // Ra khỏi 'controllers'
  "definitions" // Vào thư mục 'definitions'
);
// Hàm tạo chuỗi ngẫu nhiên cho comment (để code sinh ra "khác" nhau mỗi lần)
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Hàm thêm comment ngẫu nhiên vào đầu file
function addRandomComment(code) {
  const timestamp = new Date().toISOString();
  const randomId = generateRandomString(8);
  return `/* Generated on: ${timestamp} - ID: ${randomId} */\n\n` + code;
}

// Hàm để sinh mã dựa trên định nghĩa bảng
async function generateCode(tableDefinition) {
  const { tableName, fields } = tableDefinition;
  const capitalizedTableName = _.capitalize(_.camelCase(tableName));
  const camelCaseTableName = _.camelCase(tableName);

  // Tạo các thư mục con trong generated_code nếu chưa tồn tại
  const modelsOutputDir = path.join(GENERATED_CODE_ROOT_DIR, "models");
  const controllersOutputDir = path.join(
    GENERATED_CODE_ROOT_DIR,
    "controllers"
  );
  const routesOutputDir = path.join(GENERATED_CODE_ROOT_DIR, "routes");

  [modelsOutputDir, controllersOutputDir, routesOutputDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const templateData = {
    tableName: camelCaseTableName,
    capitalizedTableName: capitalizedTableName,
    fields: fields,
    _: _,
  };

  // 1. Sinh Model
  const modelTemplatePath = path.join(TEMPLATES_DIR, "model.js.ejs");
  let modelCode = await ejs.renderFile(modelTemplatePath, templateData);
  modelCode = addRandomComment(modelCode);
  fs.writeFileSync(
    path.join(modelsOutputDir, `${camelCaseTableName}.js`),
    modelCode
  );
  console.log(`Generated Model: ${modelsOutputDir}/${camelCaseTableName}.js`);

  // 2. Sinh Controller
  const controllerTemplatePath = path.join(TEMPLATES_DIR, "controller.js.ejs");
  let controllerCode = await ejs.renderFile(
    controllerTemplatePath,
    templateData
  );
  controllerCode = addRandomComment(controllerCode);
  fs.writeFileSync(
    path.join(controllersOutputDir, `${camelCaseTableName}Controller.js`),
    controllerCode
  );
  console.log(
    `Generated Controller: ${controllersOutputDir}/${camelCaseTableName}Controller.js`
  );

  // 3. Sinh Route
  const routeTemplatePath = path.join(TEMPLATES_DIR, "route.js.ejs");
  let routeCode = await ejs.renderFile(routeTemplatePath, templateData);
  routeCode = addRandomComment(routeCode);
  fs.writeFileSync(
    path.join(routesOutputDir, `${camelCaseTableName}Routes.js`),
    routeCode
  );
  console.log(
    `Generated Route: ${routesOutputDir}/${camelCaseTableName}Routes.js`
  );

  // Thêm tên file route đã sinh vào mảng
  generatedRouteFiles.push(`${camelCaseTableName}Routes`);

  console.log(`\nCode generation completed for table: ${tableName}`);
}

// Hàm để sinh ra file index.js tổng hợp các routes
async function generateIndexRouteFile() {
  const routesOutputDir = path.join(GENERATED_CODE_ROOT_DIR, "routes");
  const indexPath = path.join(routesOutputDir, "index.js");

  let indexContent = `const express = require('express');\nconst router = express.Router();\n\n`;

  generatedRouteFiles.forEach((routeFile) => {
    // Đảm bảo tên biến cho router là duy nhất và dễ đọc
    const routerVariableName =
      _.camelCase(routeFile.replace("Routes", "")) + "Router";
    indexContent += `const ${routerVariableName} = require('./${routeFile}');\n`;
    indexContent += `router.use('/${_.kebabCase(routeFile.replace("Routes", ""))}', ${routerVariableName});\n\n`;
  });

  indexContent += `module.exports = router;\n`;

  fs.writeFileSync(indexPath, indexContent);
  console.log(`Generated Index Route File: ${indexPath}`);
}

// --- HÀM MỚI ĐỂ SINH CODE THEO LOẠI WEBSITE ---
async function generateWebsiteCode(websiteType) {
  // Xóa tất cả các route đã sinh ra trước đó để chuẩn bị cho lần sinh mới
  generatedRouteFiles.length = 0; // Reset mảng

  let websiteDefinition;
  try {
    const definitionPath = path.join(
      DEFINITIONS_DIR,
      `${websiteType}Website.js`
    );
    websiteDefinition = require(definitionPath);
    console.log(
      `\n--- Generating code for ${websiteDefinition.name} website ---`
    );
  } catch (error) {
    console.error(
      `Error: Could not load definition for website type '${websiteType}'.`
    );
    throw new Error(`Invalid website type: ${websiteType}`);
  }

  // Xóa thư mục generated_code trước khi sinh mới để tránh file rác
  // Cần cẩn thận khi sử dụng, đảm bảo bạn không xóa nhầm thư mục quan trọng!
  if (fs.existsSync(GENERATED_CODE_ROOT_DIR)) {
    fs.rmSync(GENERATED_CODE_ROOT_DIR, { recursive: true, force: true });
    console.log(
      `Cleaned up previous generated code in: ${GENERATED_CODE_ROOT_DIR}`
    );
  }

  // Duyệt qua từng bảng trong định nghĩa website và sinh code
  for (const table of websiteDefinition.tables) {
    await generateCode(table);
  }

  // Sau khi tất cả các bảng đã được sinh code, tạo file index.js cho routes
  await generateIndexRouteFile();

  console.log(
    `\nCode generation for ${websiteDefinition.name} completed successfully.`
  );
  return {
    success: true,
    websiteType: websiteDefinition.type,
    outputDir: GENERATED_CODE_ROOT_DIR,
  };
}

// Create code by table
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

  // Gọi hàm sinh file index.js sau khi tất cả routes đã được tạo
  await generateIndexRouteFile();

  console.log('\nTests completed. Check the "generated_code" folder.');
};
// Create code by type
exports.runTestType = async (req, res) => {
  generateWebsiteCode("ecommerce");
};
