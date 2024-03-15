const router = require("express").Router();
const verify = require("../middlewares/Auth");
const upload = require("../middlewares/ImageUploader/ImageUploader");

const {
  getAllAffordabilities,
  createAffordability,
  updateAffordability,
  deleteAffordability,
} = require("../controllers/decorations/affordabilityController");

const {
  getDesigns,
  updateDesign,
  createDesign,
  deleteDesign,
} = require("../controllers/decorations/designTypeController");

const {
  getDecorProducts,
  getDecorProductswithTitle,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/decorations/DecorProductController");
const {
  addDecoration,
  getDecorations,
  updateDecoration,
  toggleSaveDecoration,
  getSavedDecorations,
  RemoveSaveDecoration,
} = require("../controllers/decorations/Decorations");

// Define routes
router.get("/get-affordabilities", verify, getAllAffordabilities);
router.post("/post-affordabilities", verify, createAffordability);
router.put("/update-affordabilities/:id", verify, updateAffordability);
router.delete("/delete-affordability/:id", verify, deleteAffordability);

router.get("/get-design", verify, getDesigns);
router.post("/post-design", verify, createDesign);
router.put("/update-design/:id", verify, updateDesign);
router.delete("/delete-design/:id", verify, deleteDesign);

router.get("/getDecorProducts", verify, getDecorProducts);
router.get("/search-decorProduct", getDecorProductswithTitle);
router.post("/add-decor-product", verify, upload.single("image"), addProduct);
router.put(
  "/update-decor-product/:id",
  verify,
  upload.single("image"),
  updateProduct
);
router.delete("/delete-decor-product/:id", verify, deleteProduct);

router.post(
  "/add-decoration",
  verify,
  upload.array("images", 10),
  addDecoration
);
router.get("/get-decoration", verify, getDecorations);
upload.array("images", 10),
  router.put(
    "/update-decoration/:id",
    upload.array("images", 10),
    verify,
    updateDecoration
  );

router.post("/toggleSave/:decorationId", verify, toggleSaveDecoration);
router.get("/saved/:userId", verify, getSavedDecorations);
router.post("/remove-saved", verify, RemoveSaveDecoration);
module.exports = router;
