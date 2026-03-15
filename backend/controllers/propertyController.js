const Property = require("../models/Property");

exports.getFilteredProperties = async (req, res) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      constructionStatus,
      location
    } = req.query;

    let filter = {
      status: "approved"   // only approved visible
    };

    if (type) {
      filter.type = type;
    }

    if (constructionStatus) {
      filter.constructionStatus = constructionStatus;
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = Number(minArea);
      if (maxArea) filter.area.$lte = Number(maxArea);
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });

    res.json(properties);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};