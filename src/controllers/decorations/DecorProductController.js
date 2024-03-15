const DecorProduct = require("../../models/decoreProduct");

exports.getDecorProducts = async (req, res) => {
  try {
    const products = await DecorProduct.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching decor products:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getDecorProductswithTitle = async (req, res) => {
  try {
    const query = req.query.search;

    const searchCriteria = query
      ? { title: { $regex: query, $options: "i" } }
      : {};

    const products = await DecorProduct.find(searchCriteria);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching decor products:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { title, price } = req.body;
    const image = req.file;

    if (!title || !price || !image) {
      return res
        .status(400)
        .json({ error: "Title, price, and image are required" });
    }

    const newProduct = new DecorProduct({
      title,
      price,
      image: image.filename,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, price } = req.body;
    const image = req.file;

    if (!title && !price) {
      return res.status(400).json({
        error:
          "At least one field (title, price, image) is required for update",
      });
    }

    const product = await DecorProduct.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (title) {
      product.title = title;
    }
    if (price) {
      product.price = price;
    }
    if (image) {
      product.image = image.filename;
    }

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await DecorProduct.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
