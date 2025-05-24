<!-- src/components/SnippetManager.vue -->
<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>📄 Snippet Manager</span>
      </div>
    </template>

    <el-form :model="form" label-width="100px" @submit.prevent="addSnippet">
      <el-form-item label="Title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Language">
        <el-input v-model="form.language" />
      </el-form-item>
      <el-form-item label="Code">
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
      placeholder="Tìm theo ngôn ngữ"
      class="mb-4"
      clearable
      @input="fetchSnippets"
    />
    <el-divider />

    <el-table :data="snippets" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="language" label="Language" />
      <el-table-column prop="code" label="Code" />
      <el-table-column label="Tags">
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
      <el-table-column label="Actions" width="120">
        <template #default="scope">
          <el-button size="small" type="warning" @click="editSnippet(scope.row)"
            >Sửa</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="confirmDelete(scope.row._id)"
            >Xóa</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
import { ref, onMounted } from "vue";
import axios from "axios";

const API = "http://localhost:5000/api/snippets";

const snippets = ref([]);
const loading = ref(false);

const form = ref({
  title: "",
  language: "",
  code: "",
  tagsRaw: "",
});

const searchLang = ref("");

const fetchSnippets = async () => {
  loading.value = true;
  const res = await axios.get(API, {
    params: { language: searchLang.value },
  });
  snippets.value = res.data;
  loading.value = false;
};

const addSnippet = async () => {
  if (!form.value.title || !form.value.code) return;
  await axios.post(API, {
    title: form.value.title,
    language: form.value.language,
    code: form.value.code,
    tags: form.value.tagsRaw.split(",").map((t) => t.trim()),
  });
  form.value = { title: "", language: "", code: "", tagsRaw: "" };
  fetchSnippets();
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
</script>

<style>
.box-card {
  max-width: 1170px;
  margin: 40px auto;
}
</style>
