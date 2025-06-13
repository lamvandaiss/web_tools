<template>
  <el-container class="common-layout">
    <el-header class="header">
      <h1>Backend Project Generator</h1>
    </el-header>
    <el-main class="main-content">
      <el-card class="generator-card">
        <template #header>
          <div class="card-header">
            <span>Create New Backend Project</span>
          </div>
        </template>

        <el-form
          :model="form"
          label-width="120px"
          @submit.prevent="generateProject"
        >
          <el-form-item label="Project Type">
            <el-select
              v-model="form.websiteType"
              placeholder="Select a website type"
              style="width: 100%"
            >
              <el-option
                v-for="type in websiteTypes"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Project Name">
            <el-input
              v-model="form.projectName"
              placeholder="Enter project name (e.g., my-ecommerce-app)"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="generateProject"
            >
              {{ loading ? "Generating..." : "Generate Project" }}
            </el-button>
          </el-form-item>
        </el-form>

        <el-alert
          v-if="message"
          :title="message"
          :type="messageType"
          show-icon
          closable
          class="mt-4"
          @close="message = ''"
        />

        <!-- Thêm phần hiển thị danh sách file -->
        <el-card
          v-if="generatedFilePaths.length > 0"
          class="file-list-card mt-4"
        >
          <template #header>
            <div class="card-header">
              <span>Generated Project Files</span>
            </div>
          </template>
          <ul class="file-list">
            <li
              v-for="file in generatedFilePaths"
              :key="file"
              class="file-item"
            >
              {{ file }}
            </li>
          </ul>
          <div class="mt-4 text-center">
            <el-text tag="p" type="info" size="small">
              (Paths are relative to your generated project folder.)
            </el-text>
          </div>
        </el-card>
      </el-card>
    </el-main>
    <el-footer class="footer">
      Developed with ❤️ using Vue.js & Element Plus
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { Download } from "@element-plus/icons-vue";
const form = reactive({
  websiteType: "",
  projectName: "",
});

const loading = ref(false);
const message = ref("");
const messageType = ref("info"); // success, warning, info, error
const generatedFilePaths = ref([]); // Thêm dòng này để lưu các đường dẫn file
const downloadProjectName = ref("");

// Danh sách các loại website (phải khớp với definitions/index.js của backend)
const websiteTypes = [
  { label: "News Website", value: "news" },
  { label: "E-commerce Website", value: "ecommerce" },
  { label: "Photo Gallery Website", value: "photoGallery" },
  { label: "LMS Website", value: "lms" },
  { label: "Booking Website (General)", value: "booking" },
  { label: "Forum Website", value: "forum" },
  { label: "Blog Website", value: "blog" },
  { label: "Job Board Website", value: "jobboard" },
  { label: "Social Media Website", value: "socialMedia" },
  { label: "Real Estate Website", value: "realestate" },
  { label: "Recipe Sharing Website", value: "recipe" },
  { label: "Event Management Website", value: "eventManagement" },
  { label: "Fitness Tracker Website", value: "fitnessTracker" },
  { label: "Task Management Website", value: "taskManagement" },
  { label: "Knowledge Base / Wiki", value: "knowledgeBase" },
  { label: "E-learning Platform", value: "elearning" },
  { label: "Project Management", value: "projectManagement" },
  { label: "Hotel Booking", value: "hotelBooking" },
  { label: "Restaurant Reservation", value: "restaurantReservation" },
  { label: "Online Survey / Polling", value: "surveyPolling" },
  { label: "Ticket Booking", value: "ticketBooking" },
  { label: "Product Review Platform", value: "productReview" },
  { label: "Customer Support / Helpdesk", value: "customerSupport" },
  { label: "Food Delivery", value: "foodDelivery" },
  { label: "Online Auction", value: "onlineAuction" },
  { label: "Portfolio Website", value: "portfolio" },
  { label: "Payment Gateway (Simple)", value: "paymentGateway" },
  { label: "Chat Application (Basic)", value: "chatApplication" },
  { label: "Weather App", value: "weatherApp" },
  { label: "QR Code Generator", value: "qrCodeGenerator" },
];

const formatProjectName = () => {
  form.projectName = form.projectName.replace(/\s+/g, "_").toLowerCase();
};

const handleDownload = () => {
  if (downloadProjectName.value) {
    // Sử dụng window.location.href để kích hoạt tải xuống file
    const downloadUrl = `http://localhost:5000/api/gencodes/download/${downloadProjectName.value}`;
    window.location.href = downloadUrl;
    ElMessage.success(`Downloading ${downloadProjectName.value}.zip...`);
  } else {
    ElMessage.warning("No project available for download.");
  }
};

const generateProject = async () => {
  if (!form.websiteType || !form.projectName) {
    ElMessage.warning("Please select a project type and enter a project name.");
    return;
  }

  loading.value = true;
  message.value = "";
  generatedFilePaths.value = []; // Reset danh sách file khi bắt đầu gen mới
  downloadProjectName.value = "";

  try {
    const response = await axios.post(
      "http://localhost:5000/api/gencodes/be",
      form
    );
    message.value = response.data.message;
    messageType.value = "success";
    ElMessage.success("Project generated successfully!");
    // Lấy danh sách file và gán vào ref
    generatedFilePaths.value = response.data.generatedFilePaths || [];
    downloadProjectName.value = response.data.downloadProjectName; // LƯU TÊN PROJECT ĐỂ TẢI XUỐNG

    // --- DÒNG NÀY ĐỂ TỰ ĐỘNG KÍCH HOẠT TẢI XUỐNG ---
    if (downloadProjectName.value) {
      handleDownload();
    }
    // Reset form sau khi thành công nếu muốn
    // form.websiteType = '';
    // form.projectName = '';
  } catch (error) {
    console.error("Error generating project:", error);
    message.value =
      error.response?.data?.error ||
      "Failed to generate project. Please check console for details.";
    messageType.value = "error";
    ElMessage.error("Failed to generate project!");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.common-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f6f8;
}

.header {
  background-color: #409eff; /* Element Plus Primary Blue */
  color: white;
  text-align: center;
  line-height: 60px;
  font-size: 24px;
  font-weight: bold;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.generator-card {
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.mt-4 {
  margin-top: 1rem;
}

.footer {
  background-color: #f0f2f5;
  color: #606266;
  text-align: center;
  line-height: 60px;
  font-size: 14px;
  border-top: 1px solid #ebeef5;
}
.file-list-card {
  max-height: 300px; /* Giới hạn chiều cao */
  overflow-y: auto; /* Thêm scroll nếu nội dung dài */
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  background-color: #fcfcfc;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  font-family: "SF Mono", "Consolas", "Menlo", monospace; /* Font monospace cho path */
  font-size: 0.85em;
  padding: 4px 0;
  color: #606266;
  border-bottom: 1px dotted #ebeef5;
}

.file-item:last-child {
  border-bottom: none;
}

.text-center {
  text-align: center;
}
</style>
