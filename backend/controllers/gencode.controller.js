const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const _ = require("lodash");
const archiver = require("archiver"); // THÊM DÒNG NÀY

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

// Mảng tạm thời để lưu trữ tên các route file đã sinh ra cho index.js
let generatedRouteNamesForIndexFile = [];

// Mảng tổng hợp tất cả các đường dẫn file đã được sinh ra (đường dẫn tương đối với project root)
let allGeneratedFilePaths = [];

// Đường dẫn đến thư mục chứa các định nghĩa website mới
const DEFINITIONS_DIR = path.join(
  __dirname,
  "..", // Ra khỏi 'controllers'
  "definitions" // Vào thư mục 'definitions'
);

// Hàm tạo chuỗi ngẫu nhiên cho comment
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
  return `/* Generated on: ${timestamp} - ID: ${randomId} */\n` + code;
}

// Hàm để sinh mã dựa trên định nghĩa bảng (Model, Controller, Route)
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

  // Helper để ghi file và thu thập đường dẫn
  const writeAndCollect = (filePath, content, message) => {
    fs.writeFileSync(filePath, content);
    allGeneratedFilePaths.push(path.relative(currentProjectRoot, filePath)); // Lưu đường dẫn tương đối
    console.log(message);
  };

  // 1. Sinh Model
  const modelTemplatePath = path.join(TEMPLATES_DIR, "model.js.ejs");
  let modelCode = await ejs.renderFile(modelTemplatePath, templateData);
  modelCode = addRandomComment(modelCode);
  writeAndCollect(
    path.join(modelsOutputDir, `${camelCaseTableName}.js`),
    modelCode,
    `Generated Model: <span class="math-inline">\{modelsOutputDir\}/</span>{camelCaseTableName}.js`
  );

  // 2. Sinh Controller
  const controllerTemplatePath = path.join(TEMPLATES_DIR, "controller.js.ejs");
  let controllerCode = await ejs.renderFile(
    controllerTemplatePath,
    templateData
  );
  controllerCode = addRandomComment(controllerCode);
  writeAndCollect(
    path.join(controllersOutputDir, `${camelCaseTableName}Controller.js`),
    controllerCode,
    `Generated Controller: <span class="math-inline">\{controllersOutputDir\}/</span>{camelCaseTableName}Controller.js`
  );

  // 3. Sinh Route
  const routeTemplatePath = path.join(TEMPLATES_DIR, "route.js.ejs");
  let routeCode = await ejs.renderFile(routeTemplatePath, templateData);
  routeCode = addRandomComment(routeCode);
  writeAndCollect(
    path.join(routesOutputDir, `${camelCaseTableName}Routes.js`),
    routeCode,
    `Generated Route: <span class="math-inline">\{routesOutputDir\}/</span>{camelCaseTableName}Routes.js`
  );

  // Thêm tên file route đã sinh vào mảng tạm thời cho index.js
  generatedRouteNamesForIndexFile.push(`${camelCaseTableName}Routes`);
  console.log(`\nCode generation completed for table: ${tableName}`);
}

// Hàm để sinh ra file index.js tổng hợp các routes
async function generateIndexRouteFile() {
  const routesOutputDir = path.join(getGeneratedCodeSrcDir(), "routes");
  const indexPath = path.join(routesOutputDir, "index.js");

  let indexContent = `const express = require('express');\nconst router = express.Router();\n\n`;

  generatedRouteNamesForIndexFile.forEach((routeFile) => {
    const routerVariableName =
      _.camelCase(routeFile.replace("Routes", "")) + "Router";
    indexContent += `const <span class="math-inline">\{routerVariableName\} \= require\('\./</span>{routeFile}');\n`;
    indexContent += `router.use('/${_.kebabCase(routeFile.replace("Routes", ""))}', ${routerVariableName});\n\n`;
  });

  indexContent += `module.exports = router;\n`;

  indexContent = addRandomComment(indexContent);
  // Ghi file và thêm đường dẫn vào danh sách tổng hợp
  fs.writeFileSync(indexPath, indexContent);
  allGeneratedFilePaths.push(path.relative(currentProjectRoot, indexPath));
  console.log(`Generated Index Route File: ${indexPath}`);
}

// Hàm nội bộ để sinh code cho các models, controllers, routes của một loại website
async function generateWebsiteCodeInternal(websiteType) {
  // Reset mảng tên routes cho index.js khi bắt đầu sinh một loại website mới
  generatedRouteNamesForIndexFile = [];

  let rawDefinition;
  let tablesToProcess;
  let definitionDisplayName = websiteType;

  try {
    const definitionPath = path.join(
      DEFINITIONS_DIR,
      `${websiteType}Website.js`
    );
    rawDefinition = require(definitionPath);

    if (Array.isArray(rawDefinition)) {
      tablesToProcess = rawDefinition;
    } else if (
      typeof rawDefinition === "object" &&
      rawDefinition !== null &&
      Array.isArray(rawDefinition.tables)
    ) {
      tablesToProcess = rawDefinition.tables;
      if (rawDefinition.name) {
        definitionDisplayName = rawDefinition.name;
      }
    } else {
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
    throw new Error(
      `Invalid website type or definition format: ${websiteType}. Details: ${error.message}`
    );
  }

  for (const table of tablesToProcess) {
    await generateCode(table);
  }

  await generateIndexRouteFile();

  console.log(
    `\nCore backend code generation for '${definitionDisplayName}' completed.`
  );
}

// --- HÀM CHÍNH ĐỂ SINH TOÀN BỘ PROJECT BACKEND ---
async function generateFullBackendProject(websiteType, projectName) {
  if (!projectName) {
    throw new Error("Project name is required.");
  }

  // Reset mảng tổng hợp đường dẫn file khi bắt đầu sinh project mới
  allGeneratedFilePaths = [];

  // Thiết lập đường dẫn gốc cho project đang được sinh ra
  currentProjectRoot = path.join(GENERATED_PROJECTS_DIR, projectName);

  // Xóa project cũ nếu tồn tại
  if (fs.existsSync(currentProjectRoot)) {
    fs.rmSync(currentProjectRoot, { recursive: true, force: true });
    console.log(`Cleaned up previous project in: ${currentProjectRoot}`);
  }

  // Tạo thư mục gốc của project và thư mục src bên trong
  fs.mkdirSync(currentProjectRoot, { recursive: true });
  fs.mkdirSync(getGeneratedCodeSrcDir(), { recursive: true }); // Tạo thư mục 'src'

  // 1. Sinh file .env (thêm vào allGeneratedFilePaths)
  const envTemplatePath = path.join(TEMPLATES_DIR, "env.ejs");
  let envContent = await ejs.renderFile(envTemplatePath, { projectName });
  envContent = addRandomComment(envContent);
  fs.writeFileSync(path.join(currentProjectRoot, ".env"), envContent);
  allGeneratedFilePaths.push(
    path.relative(currentProjectRoot, path.join(currentProjectRoot, ".env"))
  );
  console.log(`Generated .env: ${path.join(currentProjectRoot, ".env")}`);

  // 2. Sinh file package.json (thêm vào allGeneratedFilePaths)
  const packageJsonTemplatePath = path.join(TEMPLATES_DIR, "package.json.ejs");
  let packageJsonContent = await ejs.renderFile(packageJsonTemplatePath, {
    projectName,
    websiteType,
    _: _, // Đảm bảo _ được truyền vào nếu template cần
  });
  packageJsonContent = addRandomComment(packageJsonContent); // Thêm comment vào package.json cũng được
  fs.writeFileSync(
    path.join(currentProjectRoot, "package.json"),
    packageJsonContent
  );
  allGeneratedFilePaths.push(
    path.relative(
      currentProjectRoot,
      path.join(currentProjectRoot, "package.json")
    )
  );
  console.log(
    `Generated package.json: ${path.join(currentProjectRoot, "package.json")}`
  );

  // 3. Sinh file app.js
  const appJsTemplatePath = path.join(TEMPLATES_DIR, "app.js.ejs");
  let appJsContent = await ejs.renderFile(appJsTemplatePath, {});
  appJsContent = addRandomComment(appJsContent);
  const appJsPath = path.join(getGeneratedCodeSrcDir(), "app.js");
  fs.writeFileSync(appJsPath, appJsContent);
  allGeneratedFilePaths.push(path.relative(currentProjectRoot, appJsPath));
  console.log(`Generated app.js: ${appJsPath}`);

  // 4. Sinh file server.js
  const serverJsTemplatePath = path.join(TEMPLATES_DIR, "server.js.ejs");
  let serverJsContent = await ejs.renderFile(serverJsTemplatePath, {});
  serverJsContent = addRandomComment(serverJsContent);
  const serverJsPath = path.join(getGeneratedCodeSrcDir(), "server.js");
  fs.writeFileSync(serverJsPath, serverJsContent);
  allGeneratedFilePaths.push(path.relative(currentProjectRoot, serverJsPath));
  console.log(`Generated server.js: ${serverJsPath}`);

  // 5. Gọi hàm sinh code core backend (models, controllers, routes)
  await generateWebsiteCodeInternal(websiteType);

  console.log(
    `\nFull backend project '${projectName}' generated successfully in ${currentProjectRoot}`
  );
  // Trả về danh sách đường dẫn file đã tạo và tên project để tải xuống
  return {
    success: true,
    projectName,
    outputDir: currentProjectRoot,
    generatedFilePaths: allGeneratedFilePaths,
  };
}

function toSlug(text) {
  return text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_{2,}/g, "_");
}

// --- HÀM MỚI ĐỂ TẢI XUỐNG SOURCE CODE ---
exports.downloadProject = async (req, res) => {
  const projectName = req.params.projectName;
  const projectPath = path.join(GENERATED_PROJECTS_DIR, projectName);
  const zipFileName = `${projectName}.zip`;
  const zipFilePath = path.join(GENERATED_PROJECTS_DIR, zipFileName);

  if (!fs.existsSync(projectPath)) {
    return res.status(404).json({ message: "Project not found." });
  }

  // Tạo một luồng nén
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Mức độ nén tối đa
  });

  // Đặt các header phản hồi để trình duyệt biết đây là file tải xuống
  res.writeHead(200, {
    "Content-Type": "application/zip",
    "Content-Disposition": `attachment; filename="${zipFileName}"`,
  });

  // Xử lý lỗi nén
  archive.on("error", function (err) {
    console.error("Archiver error:", err);
    res.status(500).send({ error: err.message });
  });

  // Khi quá trình nén hoàn tất, kết thúc phản hồi
  archive.on("end", function () {
    console.log("Archive wrote %d bytes", archive.pointer());
    // Không cần đóng res ở đây vì pipe đã làm điều đó
  });

  // Pipe dữ liệu nén trực tiếp đến phản hồi HTTP
  archive.pipe(res);

  // Thêm thư mục project vào tệp nén
  archive.directory(projectPath, false); // false để không thêm thư mục gốc vào trong zip

  // Hoàn tất quá trình nén
  archive.finalize();
};

// Create code by type (đã có)
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
      generatedFilePaths: result.generatedFilePaths,
      downloadProjectName: result.projectName, // Thêm tên project để tải xuống
    });
  } catch (error) {
    console.error("Error during full backend project generation:", error);
    res.status(500).json({
      message: "Failed to generate full backend project.",
      error: error.message,
    });
  }
};
