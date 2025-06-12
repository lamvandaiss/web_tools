const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const _ = require("lodash");

// Đường dẫn gốc nơi tất cả các project backend được sinh ra sẽ nằm
const GENERATED_PROJECTS_DIR = path.join(
  __dirname,
  "..", // Ra khỏi thư mục 'controllers'
  "generated_projects" // Vào thư mục 'generated_projects'
);
// Biến này sẽ giữ đường dẫn đến thư mục gốc của project đang được sinh ra
let currentProjectRoot = "";
// Hàm trả về đường dẫn đến thư mục 'src' bên trong project đang được sinh ra
const getGeneratedCodeSrcDir = () => path.join(currentProjectRoot, "src");

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

  // Các thư mục con sẽ được tạo bên trong thư mục 'src' của project được sinh ra
  const modelsOutputDir = path.join(getGeneratedCodeSrcDir(), "models");
  const controllersOutputDir = path.join(
    getGeneratedCodeSrcDir(),
    "controllers"
  );
  const routesOutputDir = path.join(getGeneratedCodeSrcDir(), "routes");

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
  const routesOutputDir = path.join(getGeneratedCodeSrcDir(), "routes"); // Sử dụng getGeneratedCodeSrcDir()
  const indexPath = path.join(routesOutputDir, "index.js");
  let indexContent = `const express = require('express');\nconst router = express.Router();\n\n`;

  generatedRouteFiles.forEach((routeFile) => {
    const routerVariableName =
      _.camelCase(routeFile.replace("Routes", "")) + "Router";
    indexContent += `const ${routerVariableName} = require('./${routeFile}');\n`;
    indexContent += `router.use('/${_.kebabCase(routeFile.replace("Routes", ""))}', ${routerVariableName});\n\n`;
  });

  indexContent += `module.exports = router;\n`;

  indexContent = addRandomComment(indexContent);
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Generated Index Route File: ${indexPath}`);
}

// Hàm nội bộ để sinh code cho các models, controllers, routes của một loại website
async function generateWebsiteCodeInternal(websiteType) {
  // Đảm bảo reset mảng generatedRouteFiles cho mỗi lần sinh website mới
  // Điều này rất quan trọng để index.js chỉ chứa các routes của project hiện tại.
  generatedRouteFiles.length = 0;

  let rawDefinition;
  let tablesToProcess;
  let definitionDisplayName = websiteType; // Mặc định dùng websiteType cho tên hiển thị

  try {
    const definitionPath = path.join(
      DEFINITIONS_DIR,
      `${websiteType}Website.js`
    );
    // Tải nội dung định nghĩa từ file
    rawDefinition = require(definitionPath);

    // Kiểm tra cấu trúc của định nghĩa:
    if (Array.isArray(rawDefinition)) {
      // Trường hợp 1: Định nghĩa là một mảng trực tiếp của các bảng (như các định nghĩa mới)
      tablesToProcess = rawDefinition;
    } else if (
      typeof rawDefinition === "object" &&
      rawDefinition !== null &&
      Array.isArray(rawDefinition.tables)
    ) {
      // Trường hợp 2: Định nghĩa là một đối tượng có thuộc tính 'tables' là một mảng (như ecommerceWebsite.js)
      tablesToProcess = rawDefinition.tables;
      if (rawDefinition.name) {
        definitionDisplayName = rawDefinition.name; // Lấy tên "đẹp" từ định nghĩa nếu có
      }
    } else {
      // Trường hợp lỗi: Định dạng file định nghĩa không hợp lệ
      throw new Error(
        `Invalid definition format for '${websiteType}'. Expected an array or an object with a 'tables' array.`
      );
    }

    console.log(
      `\n--- Generating core backend code for '${definitionDisplayName}' website ---`
    );
  } catch (error) {
    console.error(
      `Error: Could not load or parse definition for website type '${websiteType}'.`,
      error
    );
    // Ném lỗi rõ ràng để hàm gọi bên ngoài có thể bắt được và báo về frontend
    throw new Error(
      `Invalid website type or definition format: ${websiteType}. Details: ${error.message}`
    );
  }

  // Duyệt qua từng bảng trong danh sách đã được xác định và sinh code
  for (const table of tablesToProcess) {
    await generateCode(table);
  }

  // Sau khi tất cả các models, controllers, và routes cho các bảng đã được sinh,
  // tạo file index.js để tổng hợp các routes đó.
  await generateIndexRouteFile();

  console.log(
    `\nCore backend code generation for '${definitionDisplayName}' completed.`
  );
}

// --- HÀM MỚI CHÍNH ĐỂ SINH TOÀN BỘ PROJECT BACKEND ---
async function generateFullBackendProject(websiteType, projectName) {
  if (!projectName) {
    throw new Error("Project name is required.");
  }
  // Thiết lập đường dẫn gốc cho project đang được sinh ra
  currentProjectRoot = path.join(GENERATED_PROJECTS_DIR, projectName);

  // Xóa project cũ nếu tồn tại để đảm bảo một bản sinh mới sạch
  if (fs.existsSync(currentProjectRoot)) {
    fs.rmSync(currentProjectRoot, { recursive: true, force: true });
    console.log(`Cleaned up previous project in: ${currentProjectRoot}`);
  }

  // Tạo thư mục gốc của project và thư mục src bên trong
  fs.mkdirSync(currentProjectRoot, { recursive: true });
  fs.mkdirSync(getGeneratedCodeSrcDir(), { recursive: true }); // Tạo thư mục 'src'

  // 1. Sinh file .env
  const envTemplatePath = path.join(TEMPLATES_DIR, "env.ejs");
  let envContent = await ejs.renderFile(envTemplatePath, { projectName });
  envContent = addRandomComment(envContent);
  fs.writeFileSync(path.join(currentProjectRoot, ".env"), envContent);
  console.log(`Generated .env: ${path.join(currentProjectRoot, ".env")}`);

  // 2. Sinh file package.json
  const packageJsonTemplatePath = path.join(TEMPLATES_DIR, "package.json.ejs");
  let packageJsonContent = await ejs.renderFile(packageJsonTemplatePath, {
    projectName,
    websiteType,
    _: _,
  });

  fs.writeFileSync(
    path.join(currentProjectRoot, "package.json"),
    packageJsonContent
  );
  console.log(
    `Generated package.json: ${path.join(currentProjectRoot, "package.json")}`
  );

  // 3. Sinh file app.js (cho project được sinh ra)
  const appJsTemplatePath = path.join(TEMPLATES_DIR, "app.js.ejs");
  let appJsContent = await ejs.renderFile(appJsTemplatePath, {});
  appJsContent = addRandomComment(appJsContent);
  fs.writeFileSync(path.join(getGeneratedCodeSrcDir(), "app.js"), appJsContent);
  console.log(
    `Generated app.js: ${path.join(getGeneratedCodeSrcDir(), "app.js")}`
  );

  // 4. Sinh file server.js (cho project được sinh ra)
  const serverJsTemplatePath = path.join(TEMPLATES_DIR, "server.js.ejs");
  let serverJsContent = await ejs.renderFile(serverJsTemplatePath, {});
  serverJsContent = addRandomComment(serverJsContent);
  fs.writeFileSync(
    path.join(getGeneratedCodeSrcDir(), "server.js"),
    serverJsContent
  );
  console.log(
    `Generated server.js: ${path.join(getGeneratedCodeSrcDir(), "server.js")}`
  );

  // 5. Gọi hàm sinh code core backend (models, controllers, routes)
  await generateWebsiteCodeInternal(websiteType);

  console.log(
    `\nFull backend project '${projectName}' generated successfully in ${currentProjectRoot}`
  );
  return { success: true, projectName, outputDir: currentProjectRoot };
}
function toSlug(text) {
  return text
    .replace(/đ/g, "d") // thay 'đ' thành 'd'
    .replace(/Đ/g, "d")
    .normalize("NFD") // tách các dấu ra khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, "") // xóa các dấu
    .toLowerCase() // chuyển về chữ thường
    .trim() // xóa khoảng trắng đầu/cuối
    .replace(/\s+/g, "_") // thay khoảng trắng bằng dấu gạch nối
    .replace(/[^a-z0-9\_]/g, "") // xóa ký tự đặc biệt (giữ lại a-z, 0-9, và dấu '_')
    .replace(/\-{2,}/g, "_"); // thay nhiều dấu '-' liên tiếp thành 1 dấu
}

// Create code by type
exports.runBE = async (req, res) => {
  let { websiteType, projectName } = req.body;
  if (!websiteType || !projectName) {
    return res.status(400).json({
      message:
        "Both websiteType and projectName are required in the request body.",
    });
  }

  projectName = toSlug(projectName);

  try {
    const result = await generateFullBackendProject(websiteType, projectName);
    res.status(200).json({
      message: `Full backend project '${result.projectName}' generated successfully!`,
      outputDirectory: result.outputDir,
      instructions: [
        `Go to the generated project directory: cd ${result.outputDir}`,
        `Install dependencies: npm install`,
        `Start the server: npm start (or npm run dev for development with nodemon)`,
      ],
      details: result,
    });
  } catch (error) {
    console.error("Error during full backend project generation:", error);
    res.status(500).json({
      message: "Failed to generate full backend project.",
      error: error.message,
    });
  }
};
