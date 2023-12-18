
function generateRandomAlphanumericOrderId(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

exports.orderProduct = async (req, res, next) => {
    try {
    //   console.log("request body..... ", req.body);
    //   console.log("user id..... ",  req?.auth);
  
      const { Order,Product } = req.db.models;
  
      const { product_id } = req.body;

      const existingProduct = await Product.findByPk(product_id);
      if (!existingProduct) {
          return res.status(404).send({ status: false, message: 'Product not found.' });
      }

    //   console.log("testing  ..... ", existingProduct)

      console.log("existingProduct  ..... ", existingProduct.soldout)

      if (existingProduct.soldout) {
        return res.status(400).send({ status: false, message: 'Product is sold out.' });
    }

    existingProduct.soldout = true;
    await existingProduct.save();

    //   console.log("testing  ..... ", existingProduct)
      const placedBy = req?.auth?.data?.userId
      

      console.log("placed by  ..... ", placedBy)
  
      const RefId = generateRandomAlphanumericOrderId()

      console.log("RefId ..... ", RefId)

      const orderDate = new Date();

      console.log("Order date ..... ", orderDate)

      const order = await Order.create({
        RefId,
        placedBy,
        product_id,
        orderDate,
    });
      // Create order
    //   const newProduct = new Order({
    //     title,
    //     description,
    //     price,
    //     placedBy,
    //   });

    //   console.log("Created BY Product is ..... ", uploadedBy );
  
      // Save the product to the database
      return res.status(201).send({ status: true, message: 'Order created successfully.', order });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, message: 'Error creating order.', error: err });
    }
  };

  //get orders for admin ..........................

  exports.getOrder = async (req, res, next) => {
    try {
        //   console.log("request body..... ", req.body);
        //   console.log("user id..... ",  req?.auth);
      
          const { Order,Product,User } = req.db.models;
      
          const { RefId,placedBy } = req.query;
    
          let whereCondition = {};

// console.log("Ref id..... ",  whereCondition.orderId); //RefId);

          if (RefId) {
            whereCondition.RefId = RefId;
            // console.log("Ref id..... ",  whereCondition.RefId);
        } else if (placedBy) {
            whereCondition.placedBy = placedBy;

            // console.log("placedBy ///..... ",  whereCondition.placedBy);
        } else {
            return res.status(400).send({ status: false, message: 'Please provide either refId or userId in the query parameters.' });
        }

        const orders = await Order.findAll({
            where: whereCondition,
            include: [
                {
                    model: Product,
                    attributes: ['title', 'description', 'price'],
                },
                {
                    model: User,
                    attributes: ['fullName', 'email'],
                },
            ],
        });

        return res.status(200).send({ status: true, message: 'Orders retrieved successfully.', orders });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, message: 'Error retrieving orders.', error: err });
    }

};

// get order for user......................


exports.getUserOrder = async (req, res, next) => {
    try {
      
          const { Order,Product,User } = req.db.models;
      
          const { placedBy } = req.query;

          if (!placedBy) {
            return res.status(400).send({ status: false, message: 'Please provide a userId in the query parameters.' });
        }

        if (placedBy != req?.auth?.data?.userId) {
            console.log("type", typeof(placedBy), typeof(req?.auth?.data?.userId))
            console.log("Mismatched user IDs. placedBy:", placedBy, "authenticated user:", req?.auth?.data?.userId);
            return res.status(403).send({ status: false, message: "You are not authorized to view this order." });
        }

else{

        const orders = await Order.findAll({
            where: { placedBy },
            include: [
                {
                    model: Product,
                    attributes: ['title', 'description', 'price'],
                },
                {
                    model: User,
                    attributes: ['fullName', 'email'],
                },
            ],
        });

        return res.status(200).send({ status: true, message: 'Orders retrieved successfully.', orders });
}
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, message: 'Error retrieving orders.', error: err });
    }

};

exports.deleteUserOrder = async (req,res)=>{
    try{
        const {Order} = req.db.models;

        const {refId} =req.body;

        // console.log("refId is ...... ",refId)

        const orderToDelete = await Order.findOne({where:{RefId:refId}});


        // console.log("orderToDelete is ...... ",orderToDelete.RefId)

        // console.log("placeBy is ...... ",orderToDelete.placedBy)

        // console.log("UserId is ........." , req?.auth?.data?.userId)


        if(!orderToDelete){
            return res.status(404).send({ status: false, message: "Order not found." });
        }

        if (orderToDelete.placedBy !== req?.auth?.data?.userId ){
            console.log("type", typeof(orderToDelete.placedBy), typeof(req?.auth?.data?.userId))
            return res.status(403).send({ status: false, message: "You are not authorized to delete this order." });
        }
        // await productToDelete.destroy();

        await orderToDelete.destroy();

        return res.status(200).send({ status: true, message: "Order deleted successfully." });


    }
    catch (err){
        console.error(err);
        return res.status(500).send({ status: false, message: "Error deleting product.", error: err });

    }

}

exports.deleteAdminOrder = async(req,res)=>{
    try{
        const{Order} = req.db.models
        const{refId}=req.body

        const orderToDelete = await Order.findOne({where:{RefId:refId}});

        if (!orderToDelete) {

            return res.status(404).send({ status: false, message: "Order not found." });
            
        }
        orderToDelete.destroy()
        return res.status(200).send({ status: true, message: "Order deleted successfully." });

    }
    catch (err){
        console.error(err);
        return res.status(500).send({ status: false, message: "Error deleting product.", error: err });

    }
}