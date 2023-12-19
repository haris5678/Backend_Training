exports.createCategory = async (req, res, next) => {
    try {

      const { Category } = req.db.models;
  
      // Extract product details from the request body
      const { title, type } = req.body;
  
      // Extract the user ID of the authenticated user from the request
      const createdBy = req?.auth?.data?.userId;
      const role = req?.auth?.data?.roleId;
  
      // Validate that required fields are present
      if (!title || !type ) {
        return res.status(400).send({ status: false, message: "Title and type are required." });
      }

      if (role !== "admin") {
        return res.status(403).send({ status: false, message: "You are not authorized to update this product." });
    }
  
      // Create a new product instance
      const newCategory = new Category({
        title,
        type,
      });

    //   console.log("Created BY Product is ..... ", uploadedBy );
  
      // Save the product to the database
      const savedCategory = await newCategory.save();
    //   console.log("Saved Product is ..... ", savedProduct );
  
      return res.status(201).send({ status: true, message: "category created successfully.", category: savedCategory });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: "Error creating category.", error: err });
    }
  };