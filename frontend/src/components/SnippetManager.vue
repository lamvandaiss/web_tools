<!-- src/components/SnippetManager.vue -->
<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>📄 Snippet Manager</span>
      </div>
    </template>

    <el-form
      :model="form"
      label-width="250px"
      @submit.prevent="addSnippet"
      ref="snippetForm"
      :rules="formRules"
    >
      <el-form-item label="Title" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Language">
        <el-input v-model="form.language" />
      </el-form-item>
      <el-form-item label="Code" prop="code">
        <el-input type="textarea" v-model="form.code" rows="4" />
      </el-form-item>
      <el-form-item label="Tags (phân cách bằng dấu phẩy)">
        <el-input v-model="form.tagsRaw" placeholder="js, vue, api" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSnippet">Add Snippet</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <el-input
      v-model="searchLang"
      placeholder="Tìm theo ngôn ngữ hoặc title"
      class="mb-4"
      clearable
      @input="debouncedFetchSnippets()"
    />
    <el-divider />

    <el-table :data="snippets" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="Title" width="200" />
      <el-table-column prop="language" label="Language" width="90" />
      <el-table-column label="Code" min-width="500">
        <template #default="scope">
          <div class="code-container">
            <pre
              :class="`language-${scope.row.language} line-numbers`"
            ><code>{{ scope.row.code }}</code></pre>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Tags" min-width="90">
        <template #default="scope">
          <el-tag
            v-for="tag in scope.row.tags"
            :key="tag"
            size="small"
            class="mr-1"
            type="info"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        width="80"
        header-align="center"
        class="action-group"
      >
        <template #default="scope">
          <div class="action-buttons">
            <el-button
              class="btn-action"
              size="small"
              type="primary"
              @click="copyCode(scope.row.code)"
            >
              Copy
            </el-button>
            <el-button
              class="btn-action"
              size="small"
              type="warning"
              @click="editSnippet(scope.row)"
              >Sửa</el-button
            >
            <el-button
              class="btn-action"
              size="small"
              type="danger"
              @click="confirmDelete(scope.row._id)"
              >Xóa</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="editDialogVisible" title="Chỉnh sửa Snippet">
      <el-form :model="editForm">
        <el-form-item label="Title">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="Language">
          <el-input v-model="editForm.language" />
        </el-form-item>
        <el-form-item label="Code">
          <el-input type="textarea" v-model="editForm.code" rows="4" />
        </el-form-item>
        <el-form-item label="Tags">
          <el-input v-model="editForm.tagsRaw" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submitEdit">Lưu</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { ref, onMounted, nextTick, watch } from "vue";
import axios from "axios";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Hoặc chủ đề khác
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
// Import các ngôn ngữ bạn muốn highlight
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup"; // HTML
import "prismjs/components/prism-json";

const API = "http://localhost:5000/api/snippets";

const snippets = ref([]);
const loading = ref(false);
// --- Biến phân trang ---
const currentPage = ref(1); // Trang hiện tại
const pageSize = ref(10); // Số mục trên mỗi trang
const totalItems = ref(0); // Tổng số mục (từ backend)

const form = ref({
  title: "",
  language: "",
  code: "",
  tagsRaw: "",
});

const searchLang = ref("");

const fetchSnippets = async () => {
  loading.value = true;
  try {
    const res = await axios.get(API, {
      params: {
        search: searchLang.value, // Gửi giá trị tìm kiếm
        page: currentPage.value, // Gửi trang hiện tại
        limit: pageSize.value, // Gửi số mục trên mỗi trang
      },
    });
    // Cập nhật dữ liệu và thông tin phân trang từ response của backend
    snippets.value = res.data.snippets;
    totalItems.value = res.data.totalItems;
    await highlightCode();
  } catch (error) {
    console.error("Error fetching snippets:", error);
    ElMessage.error("Không thể tải dữ liệu.");
  } finally {
    loading.value = false;
  }
};

const highlightCode = async () => {
  await nextTick();
  Prism.highlightAll(); // Highlight tất cả các block code với class 'language-xxx'
};
const addSnippet = async () => {
  // Sử dụng validate của form
  snippetForm.value.validate(async (valid) => {
    if (valid) {
      // Nếu form hợp lệ, tiến hành thêm snippet
      try {
        await axios.post(API, {
          title: form.value.title,
          language: form.value.language,
          code: form.value.code,
          tags: form.value.tagsRaw.split(",").map((t) => t.trim()),
        });
        form.value = { title: "", language: "", code: "", tagsRaw: "" };
        // Reset validation state sau khi thêm thành công
        snippetForm.value.resetFields();
        ElMessage.success("Đã thêm snippet thành công!");
        fetchSnippets();
      } catch (error) {
        console.error("Error adding snippet:", error);
        ElMessage.error("Thêm snippet thất bại.");
      }
    } else {
      // Nếu form không hợp lệ, hiển thị thông báo lỗi (Element Plus sẽ tự động hiển thị)
      ElMessage.warning("Vui lòng điền đầy đủ các trường bắt buộc.");
      return false; // Ngăn không cho form submit
    }
  });
};

const editDialogVisible = ref(false);
const editForm = ref({
  _id: "",
  title: "",
  language: "",
  code: "",
  tagsRaw: "",
});

const editSnippet = (snippet) => {
  editForm.value = {
    _id: snippet._id,
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
    tagsRaw: snippet.tags.join(", "),
  };
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  await axios.put(`${API}/${editForm.value._id}`, {
    title: editForm.value.title,
    language: editForm.value.language,
    code: editForm.value.code,
    tags: editForm.value.tagsRaw.split(",").map((t) => t.trim()),
  });
  editDialogVisible.value = false;
  fetchSnippets();
};

onMounted(fetchSnippets);

const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      "Bạn có chắc muốn xóa đoạn mã này không?",
      "Xác nhận",
      {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
      }
    );

    await axios.delete(`${API}/${id}`);
    ElMessage.success("Đã xóa thành công.");
    fetchSnippets();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("Xóa thất bại.");
    }
  }
};

const copyCode = (code) => {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      ElMessage.success("Đã sao chép đoạn code!");
    })
    .catch((err) => {
      ElMessage.error("Không thể sao chép!");
      console.error(err);
    });
};

// --- Validation Rules ---
const snippetForm = ref(null); // Tạo ref để truy cập form component
const formRules = {
  title: [{ required: true, message: "Vui lòng nhập Title", trigger: "blur" }],
  code: [{ required: true, message: "Vui lòng nhập Code", trigger: "blur" }],
};

// Debounce setup
let debounceTimer = null;
const debouncedFetchSnippets = (delay = 500) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    // Reset về trang 1 khi thực hiện tìm kiếm mới
    currentPage.value = 1;
    fetchSnippets();
  }, delay);
};

// --- Hàm xử lý sự kiện phân trang ---
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // Reset về trang 1 khi thay đổi số mục trên trang
  fetchSnippets();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchSnippets();
};
</script>

<style>
.box-card {
  max-width: 100%;
  margin: 40px auto;
}
.wide-card {
  width: 80%;
}
.code-block {
  background-color: #1e1e1e;
  color: #dcdcdc;
  padding: 8px;
  border-radius: 4px;
  max-height: 150px;
  overflow: auto;
  font-family: Consolas, "Courier New", monospace;
  white-space: pre-wrap;
  word-break: break-word;
}
.code-block.line-numbers {
  counter-reset: linenumber;
  padding-left: 2.5em;
  position: relative;
}

.code-block.line-numbers code {
  display: block;
}

.code-block.line-numbers code span {
  display: block;
  position: relative;
  padding-left: 0.5em;
}

.code-block.line-numbers code span::before {
  counter-increment: linenumber;
  content: counter(linenumber);
  position: absolute;
  left: -2.5em;
  width: 2em;
  text-align: right;
  color: #999;
  font-size: 0.9em;
}
.action-group {
}
.btn-action {
  width: 50px;
  display: block;
  text-align: center;
  margin-left: 0 !important;
  outline: none;
}
.action-buttons {
  display: flex;
  justify-content: center;
  row-gap: 10px;
  flex-direction: column;
}
.code-container {
  max-height: 200px;
  overflow: auto;
  border-radius: 4px;
  background: #1e1e1e;
  padding: 8px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
}

/* Cải thiện thanh cuộn */
.code-container::-webkit-scrollbar {
  width: 8px;
}
.code-container::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
}
.code-container::-webkit-scrollbar-track {
  background-color: #2c2c2c;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
