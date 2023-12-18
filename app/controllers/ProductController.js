// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');

// exports.createProduct = (req, res, next) => {
//   console.log("request body..... ", req.body);
//   const { Product } = req.db.models;
//   const title = req.body;
//   const description = req.body;
//   const price = req.body;
//     const uploadedBy = req?.auth?.data?.user_id;
// };

exports.createProduct = async (req, res, next) => {
    try {
      console.log("request body..... ", req.body);
      console.log("user id..... ",  req?.auth);
  
      const { Product } = req.db.models;
  
      // Extract product details from the request body
      const { title, description, price } = req.body;
  
      // Extract the user ID of the authenticated user from the request
      const uploadedBy = req?.auth?.data?.userId;
  
      // Validate that required fields are present
      if (!title || !price) {
        return res.status(400).send({ status: false, message: "Title, price, and user information are required." });
      }
  
      // Create a new product instance
      const newProduct = new Product({
        title,
        description,
        price,
        uploadedBy,
      });

    //   console.log("Created BY Product is ..... ", uploadedBy );
  
      // Save the product to the database
      const savedProduct = await newProduct.save();
    //   console.log("Saved Product is ..... ", savedProduct );
  
      return res.status(201).send({ status: true, message: "Product created successfully.", product: savedProduct });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: "Error creating product.", error: err });
    }
  };

// update functionality//


  exports.updateProduct = async (req, res, next) => {
    try {
        const { Product } = req.db.models;
        // const { productId } = req.body; 

        const { productId,title, description, price } = req.body;

        if (!title || !price) {
            return res.status(400).send({ status: false, message: "Title and price are required for updating a product." });
        }

        const productToUpdate = await Product.findByPk(productId);
        // const productToUpdate = await Product.findOne({where:{productId:productId}})
        // findOne({where:{RefId:refId}})

        // console.log("the product id is ............. ",productToUpdate )
        // console.log("productToUpdate.createdBy:", productToUpdate.uploadedBy);
        // console.log("req.auth.data.userId:", req.auth.data.userId);


        // Check if the product exists
        if (!productToUpdate) {
            return res.status(404).send({ status: false, message: "Product not found." });
        }

        if (productToUpdate.uploadedBy !== req?.auth?.data?.userId) {
            return res.status(403).send({ status: false, message: "You are not authorized to update this product." });
        }

        if (title) {
            productToUpdate.title = title;
        }

        if (description !== undefined) {
            productToUpdate.description = description;
        }

        if (price !== undefined) {
            productToUpdate.price = price;
        }

        const updatedProduct = await productToUpdate.save();

        return res.status(200).send({ status: true, message: "Product updated successfully.", product: updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, message: "Error updating product.", error: err });
    }
};
  

exports.deleteProduct = async (req, res, next) => {
    try {
        const { Product,User} = req.db.models;
        // const { productId } = req.body; 

        const { productId } = req.body;
        // console.log("hello my role id is...... ",req?.auth?.data?.roleId)

        const roleId=req?.auth?.data?.roleId;
        console.log("type of  role Id is ...... ", typeof(roleId))


        // if (!title || !price) {
        //     return res.status(400).send({ status: false, message: "Title and price are required for updating a product." });
        // }

        const productToDelete = await Product.findByPk(productId)

      // console.log("user id...... ",req?.auth?.data?.userId)

      // userRole=req.auth.data.userId;
      // console.log("user role id...... ",productToDelete.User.roleId)
      // console.log("user is...... ",productToDelete)

      // const roleId = UserRole.roleId;
        // const roleId = await User.findByPk(uploadedBy)
        // , {
      //     include: [
      //         {
      //             model: User,
      //             attributes: ['roleId'], // Include only the roleId field
      //         },
      //     ],
      // });

        // console.log("roleId.......... " ,roleId )

        // console.log("the product id is ............. ",productToUpdate )
        // console.log("productToUpdate.createdBy:", productToDelete);
        // console.log("req.auth.data.userId:", req.auth.data.userId);


        // Check if the product exists
        if (!productToDelete) {
            return res.status(404).send({ status: false, message: "Product not found." });
        }

        if (productToDelete.uploadedBy != req?.auth?.data?.userId) {
          if(roleId === "admin"){
            await productToDelete.destroy();
            return res.status(200).send({ status: true, message: "Product deleted successfully by Admin.", roleId });

          }
          else{
            return res.status(403).send({ status: false, message: "You are not authorized to delete this product." });

          }
            
            // await productToDelete.destroy();

        }




        // if (productToDelete.roleId ) {
          
        // }



        // if (title) {
        //     productToUpdate.title = title;
        // }

        // if (description !== undefined) {
        //     productToUpdate.description = description;
        // }

        // if (price !== undefined) {
        //     productToUpdate.price = price;
        // }

// if (roleId === "admin") {
//             // Delete the product
//             await productToDelete.destroy();
//             return res.status(200).send({ status: true, message: "Product deleted successfully by Admin.", roleId });
//         } else {
//             return res.status(403).send({ status: false, message: "You are not authorized to delete this product." });
//         }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, message: "Error deleting product.", error: err });
    }
};


exports.getAllProducts = async (req, res, next) => {
    try {
        const { Product } = req.db.models;
        const page = req.query.page || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;

        // Calculate the offset based on the page and pageSize
        const offset = (page - 1) * pageSize;

        // Fetch products with pagination from the database
        const products = await Product.findAll({
            offset,
            limit: pageSize,
        });

        //const products = await Product.findAll();

        return res.status(200).send({ status: true, message: "Products retrieved successfully.", products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, message: "Error retrieving products.", error: err });
    }
};
