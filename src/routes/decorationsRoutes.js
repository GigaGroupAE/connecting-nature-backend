const router = require("express").Router();
const verify = require("../middlewares/Auth");
const upload = require("../middlewares/ImageUploader/ImageUploader");

const {
  getAllAffordabilities,
  createAffordability,
  updateAffordability,
} = require("../controllers/decorations/affordabilityController");

const {
  getDesigns,
  updateDesign,
  createDesign,
} = require("../controllers/decorations/designTypeController");

const {
  getDecorProducts,
  getDecorProductswithTitle,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/decorations/DecorProductController");

// Define routes
router.get("/get-affordabilities", verify, getAllAffordabilities);
router.post("/post-affordabilities", verify, createAffordability);
router.put("/update-affordabilities/:id", verify, updateAffordability);

router.get("/get-design", getDesigns);
router.post("/post-design", createDesign);
router.put("/update-design/:id", updateDesign);

router.get("/getDecorProducts", verify, getDecorProducts);
router.get("/search-decorProduct", getDecorProductswithTitle);
router.post("/add-decor-product", verify, upload.single("media", addProduct));
router.put(
  "/update-decor-product",
  verify,
  upload.single("media"),
  updateProduct
);
router.delete("/delete-decor-product", verify, deleteProduct);

module.exports = router;
