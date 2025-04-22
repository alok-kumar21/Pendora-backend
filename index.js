const { inilizeData } = require("./db/db.connect");
inilizeData();
const Products = require("./models/products.models");
const Categories = require("./models/category.models");
const Cart = require("./models/cart.models");

const cors = require("cors");
const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: true,
};
app.use(cors(corsOptions));

// add All Product
async function addProductDetails(addProduct) {
  try {
    const products = Products(addProduct);
    const addproduct = await products.save();
    return addproduct;
  } catch (error) {
    console.log("Adding Product Error:", error);
  }
}

app.post("/products", async (req, res) => {
  try {
    const product = await addProductDetails(req.body);

    if (product) {
      res.status(200).json({ message: "Product added Successfully" });
    } else {
      res.status(404).json({ error: "Product not added" });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// show all Product
async function showAllProducts() {
  try {
    const Product = await Products.find().populate("category");
    return Product;
  } catch (error) {
    console.log("error:", error);
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const product = await showAllProducts();
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// API gets product by productId from the DB

async function showProductsById(productId) {
  try {
    const product = await Products.findById(productId).populate("category");
    return product;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/api/products/:productId", async (req, res) => {
  try {
    const productById = await showProductsById(req.params.productId);
    if (productById) {
      res.json(productById);
    } else {
      res.status(404).json({ error: "ProductId not found" });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

//This API call POst all category data to Db

async function addCategory(category) {
  try {
    const addcategory = Categories(category);
    const Category = await addcategory.save();
    return Category;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.post("/categories", async (req, res) => {
  try {
    const saveCategory = await addCategory(req.body);

    if (saveCategory) {
      res.status(200).json({ message: "Data added successfully" });
    } else {
      res.status(404).json({ error: "data not add " });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// This API call gets all category from DB

async function showProductByCategory() {
  try {
    const productByCategory = await Categories.find();

    return productByCategory;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/api/categories", async (req, res) => {
  try {
    const productCategory = await showProductByCategory();

    if (productCategory) {
      res.json(productCategory);
    } else {
      res.status(404).json({ error: "Categories not found" });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// This APi call gets category by categoryId from the DB
async function showProductCategoryById(categoryId) {
  try {
    const productIdCategory = await Products.find({ _id: categoryId });
    return productIdCategory;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/api/categories/:categoryId", async (req, res) => {
  try {
    const categoryId = await showProductCategoryById(req.params.categoryId);
    if (categoryId) {
      res.json(categoryId);
    } else {
      res.status(404).json({ error: "categoryId not found." });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// add item to cart

// async function addItemCart(cartId) {
//   try {
//     const cartItem = Products.findById(cartId);

//     const savingProduct = Cart(cartItem);

//     const savedItem = await savingProduct.save();
//     return savedItem;
//   } catch (error) {
//     console.log("Error:", error);
//   }
// }

// app.post("/api/cart", async (req, res) => {
//   try {
//     const { item } = addItemCart(req.body);
//     Cart.push(item);
//     res.json(Cart);

//     if (item) {
//       res.status(200).json({ message: "Product save Successfully" });
//     }
//   } catch (error) {
//     console.log("Error", error);
//   }
// });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is Running on PORT:", PORT);
});
