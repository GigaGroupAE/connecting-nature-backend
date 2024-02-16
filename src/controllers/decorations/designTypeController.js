const DesignType = require("../../models/designType");

exports.getDesigns = async (req, res) => {
  try {
    const designs = await DesignType.find({});
    res.status(200).json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createDesign = async (req, res) => {
  try {
    const { name } = req.body;
    const newDesign = new DesignType({ name });
    const createdDesign = await newDesign.save();
    res.status(201).json(createdDesign);
  } catch (error) {
    console.error("Error creating design:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateDesign = async (req, res) => {
  try {
    const designId = req.params.id;
    const { name } = req.body;
    const updatedDesign = await DesignType.findByIdAndUpdate(
      designId,
      { name },
      { new: true }
    );
    if (!updatedDesign) {
      return res.status(404).json({ error: "Design not found" });
    }
    res.status(200).json(updatedDesign);
  } catch (error) {
    console.error("Error updating design:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
