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

const form = reactive({
  websiteType: "",
  projectName: "",
});

const loading = ref(false);
const message = ref("");
const messageType = ref("info"); // success, warning, info, error

// Danh sách các loại website (phải khớp với definitions/index.js của backend)
const websiteTypes = [
  { label: "News Website", value: "news" },
  { label: "E-commerce Website", value: "ecommerce" },
  { label: "Photo Gallery Website", value: "gallery" },
  { label: "LMS Website", value: "lms" },
  { label: "Booking Website (General)", value: "booking" },
  { label: "Forum Website", value: "forum" },
  { label: "Blog Website", value: "blog" },
  { label: "Job Board Website", value: "jobboard" },
  { label: "Social Media Website", value: "social" },
  { label: "Real Estate Website", value: "realestate" },
  { label: "Recipe Sharing Website", value: "recipe" },
  { label: "Event Management Website", value: "event" },
  { label: "Fitness Tracker Website", value: "fitness" },
  { label: "Task Management Website", value: "task" },
  { label: "Knowledge Base / Wiki", value: "wiki" },
  { label: "E-learning Platform", value: "elearning" },
  { label: "Project Management", value: "project_management" },
  { label: "Hotel Booking", value: "hotel" },
  { label: "Restaurant Reservation", value: "restaurant" },
  { label: "Online Survey / Polling", value: "survey" },
  { label: "Ticket Booking", value: "ticket" },
  { label: "Product Review Platform", value: "review" },
  { label: "Customer Support / Helpdesk", value: "support" },
  { label: "Food Delivery", value: "food_delivery" },
  { label: "Online Auction", value: "auction" },
  { label: "Portfolio Website", value: "portfolio" },
  { label: "Payment Gateway (Simple)", value: "payment" },
  { label: "Chat Application (Basic)", value: "chat" },
  { label: "Weather App", value: "weather" },
  { label: "QR Code Generator", value: "qrcode" },
];

const generateProject = async () => {
  if (!form.websiteType || !form.projectName) {
    ElMessage.warning("Please select a project type and enter a project name.");
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const response = await axios.post(
      "http://localhost:5000/api/gencodes/be",
      form
    );
    message.value = response.data.message;
    messageType.value = "success";
    ElMessage.success("Project generated successfully!");
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
</style>
