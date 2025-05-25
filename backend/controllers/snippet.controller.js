const Snippet = require("../models/snippet.model");

const detectLang = require("lang-detector");

function suggestLanguage(code) {
  return detectLang(code) || "unknown";
}

// [GET] /api/snippets?search=javascript&page=1&limit=10
exports.getAll = async (req, res) => {
  const query = {};
  const searchTerm = req.query.search; // Từ khóa tìm kiếm

  // Phân trang
  const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
  const limit = parseInt(req.query.limit) || 10; // Số mục trên mỗi trang, mặc định là 10
  const skip = (page - 1) * limit; // Số lượng mục cần bỏ qua

  if (searchTerm) {
    query.$or = [
      { language: new RegExp(searchTerm, "i") },
      { title: new RegExp(searchTerm, "i") },
    ];
  }

  try {
    // Đếm tổng số lượng snippet khớp với điều kiện tìm kiếm (nếu có)
    const totalSnippets = await Snippet.countDocuments(query);

    // Lấy snippet cho trang hiện tại
    const snippets = await Snippet.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Trả về dữ liệu cùng với thông tin phân trang
    res.json({
      snippets,
      currentPage: page,
      totalPages: Math.ceil(totalSnippets / limit),
      totalItems: totalSnippets,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [POST] /api/snippets
exports.create = async (req, res) => {
  let { code, language } = req.body;
  if (!language) {
    try {
      const detected = suggestLanguage(code);
      if (detected) {
        language = detected;
        console.log(language);
      }
    } catch (err) {
      // Nếu lỗi, giữ nguyên language, không báo lỗi
      console.warn("Language detection failed:", err.message);
    }
  }

  const snippet = new Snippet({ ...req.body, language });
  await snippet.save();
  res.status(201).json(snippet);
};

// PUT /api/snippets/:id
exports.update = async (req, res) => {
  const updated = await Snippet.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      language: req.body.language,
      code: req.body.code,
      tags: req.body.tags,
    },
    { new: true }
  );
  res.json(updated);
};

// [DELETE] /api/snippets/:id
exports.remove = async (req, res) => {
  await Snippet.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
