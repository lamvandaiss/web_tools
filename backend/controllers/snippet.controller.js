const Snippet = require("../models/snippet.model");

const detectLang = require("lang-detector");

function suggestLanguage(code) {
  return detectLang(code) || "unknown";
}

// [GET] /api/snippets?language=javascript&title=button
exports.getAll = async (req, res) => {
  const query = {};

  // Tìm gần đúng theo language (không phân biệt hoa thường)
  if (req.query.language) {
    query.language = new RegExp(req.query.language, "i");
  }

  // Tìm gần đúng theo title (không phân biệt hoa thường)
  if (req.query.title) {
    query.title = new RegExp(req.query.title, "i");
  }

  const snippets = await Snippet.find(query).sort({ createdAt: -1 });
  res.json(snippets);
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
