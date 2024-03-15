const decorationsModal = require("../../models/decorations");

exports.getDecorations = async (req, res) => {
  try {
    const affordabilities = await decorationsModal.find().populate({
      path: "products",
      populate: {
        path: "productId",
        select: "title price image",
      },
    });
    res.status(200).json(affordabilities);
  } catch (err) {
    console.error("Error fetching affordabilities:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addDecoration = async (req, res) => {
  try {
    const { categorie, title, Description, price, tag, products } = req.body;
    const images = req.files.map((file) => ({ name: file.filename }));

    const newDecoration = new decorationsModal({
      categorie,
      title,
      Description,
      images,
      price,
      tag,
      products,
    });

    const savedDecoration = await newDecoration.save();

    res.status(201).json(savedDecoration);
  } catch (error) {
    console.error("Error adding decoration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateDecoration = async (req, res) => {
  try {
    const { id } = req.params;
    const { categorie, title, Description, price, tag, products } = req.body;

    let images;
    if (req.files?.length !== 0) {
      console.log("inside");
      images = req.files.map((file) => ({ name: file.filename }));
    }

    // Check if the decoration exists
    const decoration = await decorationsModal.findById(id);
    if (!decoration) {
      return res.status(404).json({ error: "Decoration not found" });
    }

    decoration.categorie = categorie;
    decoration.title = title;
    decoration.Description = Description;
    decoration.price = price;
    decoration.tag = tag;
    decoration.products = products;

    if (images) {
      decoration.images = images;
    }

    const updatedDecoration = await decoration.save();

    res.status(200).json(updatedDecoration);
  } catch (error) {
    console.error("Error updating decoration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.toggleSaveDecoration = async (req, res) => {
  try {
    const { decorationId } = req.params;
    const { userId } = req.body;
    if (!decorationId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Decoration ID and User ID are required.",
      });
    }
    const decoration = await decorationsModal.findById(decorationId);
    if (!decoration) {
      return res
        .status(404)
        .json({ success: false, message: "Decoration not found." });
    }
    const index = decoration.isSaved.indexOf(userId);
    if (index === -1) {
      decoration.isSaved.push(userId);
    } else {
      decoration.isSaved.splice(index, 1);
    }

    await decoration.save();

    return res.status(200).json({ success: true, isSaved: decoration.isSaved });
  } catch (error) {
    console.error("Error toggling save status for decoration:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.getSavedDecorations = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const decorations = await decorationsModal.find({ isSaved: userId });
    return res.status(200).json(decorations);
  } catch (error) {
    console.error("Error getting saved decorations:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.RemoveSaveDecoration = async (req, res) => {
  try {
    const { decorationIds, userId } = req.body;
    if (!decorationIds || !userId) {
      return res.status(400).json({
        success: false,
        message: "Decoration IDs and User ID are required.",
      });
    }
    for (const decorationId of decorationIds) {
      const decoration = await decorationsModal.findById(decorationId);

      if (!decoration) {
        return res
          .status(404)
          .json({ success: false, message: "Decoration not found." });
      }

      const index = decoration.isSaved.indexOf(userId);

      if (index !== -1) {
        decoration.isSaved.splice(index, 1);
        await decoration.save();
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error toggling save status for decoration:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
