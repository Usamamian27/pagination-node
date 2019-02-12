var router = require("express").Router();
var faker = require("faker");
var Product = require("../model/Product");

router.get("/", function(req, res, next) {
  res.render("index");
});
router.get("/add-product", function(req, res, next) {
  res.render("main/add-product");
});

router.post("/add-product", function(req, res, next) {
  var product = new Product();

  product.category = req.body.category_name;
  product.name = req.body.product_name;
  product.price = req.body.product_price;
  product.cover = faker.image.image();

  product.save(function(err) {
    if (err) throw err;
    res.redirect("/add-product");
  });
});

router.get("/generate-fake-data", function(req, res, next) {
  for (var i = 0; i < 90; i++) {
    var product = new Product();

    product.category = faker.commerce.department();
    product.name = faker.commerce.productName();
    product.price = faker.commerce.price();
    product.cover = faker.image.image();

    product.save(function(err) {
      if (err) throw err;
    });
  }
  res.redirect("/add-product");
});
router.get("/products/:page", function(req, res, next) {
  // perpage is the max items on each page
  var perPage = 9;
  //page variable contains current page number.
  var page = req.params.page || 1;
  //or each page we need to skip ((perPage * page) - perPage) values
  // (on the first page the value of the skip should be 0):

  Product.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(function(err, products) {
      Product.count().exec(function(err, count) {
        if (err) return next(err);
        res.render("main/products", {
          products: products,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
});

module.exports = router;
