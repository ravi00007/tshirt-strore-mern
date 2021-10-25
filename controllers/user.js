const User  =  require("../models/user");
const Order =  require("../models/order");

exports.getUserById =  (req,res,next,id)=>{
  User.findById(id).exec((err,doc)=>{
      if(err || !doc){
          return res.status(400).json({
           err:"no user was found in DB"
          });
      }
      req.profile = doc;
      next()
  })
}

exports.getUser = (req,res)=>{
    
    req.profile.salt = undefined;
    req.profile.encry_password =  undefined;
    return res.json(req.profile); 
}

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
     (err,doc)=>{
         if(err){
             res.status(400).json({
                 err: "You are not Authorized to update this user"
             })
         }
         doc.salt = undefined;
         doc.encry_password = undefined;
         res.json(doc)
     }
        )
}


exports.userPurchasedList = (req,res)=>{

    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err,order)=>{
       if(err){
           return res.status(400).json({
               err: "No order in this account"
           })
       }
       res.json(order)
    })

}

exports.pushOrderInPurchaseList = (req,res,next)=>{
      
    let purchases;
    req.body.order.products.forEach(element => {
        purchases.push({
            _id: element._id,
            name: element.name,
            description: element.description,
            category: element.category,
            quantity: element.quantity,
            amount: req.body.order.amount,
            trancsactionId: req.body.order.trancsactionId
        })
        // store into db
        User.findOneAndUpdate(
            {_id: req.profile._id},
            {$push:{purchases: purchases}},
            {new: true},
            (err,doc)=>{
              if(err) {
                  return res.status(400).json({
                  error: "unable to save purchases"
              })
            }
            next()
            }   
            )
    });


}