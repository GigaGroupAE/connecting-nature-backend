const Affordability = require("../../models/affordability");

exports.getAllAffordabilities = async (req, res) => {
  try {
    const affordabilities = await Affordability.find();
    res.status(200).json(affordabilities);
  } catch (err) {
    console.error("Error fetching affordabilities:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createAffordability = async (req, res) => {
  try {
    const { name, minRange, maxRange } = req.body;
    if (!name || !minRange || !maxRange) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAffordability = new Affordability({ name, minRange, maxRange });

    await newAffordability.save();

    res.status(201).json(newAffordability);
  } catch (err) {
    console.error("Error creating affordability:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateAffordability = async (req, res) => {
  try {
    const affordabilityId = req.params.id;

    const { name, minRange, maxRange } = req.body;

    const updatedAffordability = await Affordability.findByIdAndUpdate(
      affordabilityId,
      { name, minRange, maxRange },
      { new: true }
    );

    if (!updatedAffordability) {
      return res.status(404).json({ error: "Affordability not found" });
    }

    res.status(200).json(updatedAffordability);
  } catch (err) {
    console.error("Error updating affordability:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
