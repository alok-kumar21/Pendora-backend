const { inilizeData } = require("./db/db.connect");
inilizeData();

const Products = require("./models/products.models");
const Categories = require("./models/category.models");
const Cart = require("./models/cart.models");
const Wishlist = require("./models/wishlist.models");

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
    const productIdCategory = await Products.find({ _id: categoryId }).populate(
      "category"
    );
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

// add to cart route

async function addToCart(item) {
  try {
    const product = Cart(item);
    const addProduct = await product.save();
    return addProduct;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.post("/api/addcart", async (req, res) => {
  try {
    const product = await addToCart(req.body);
    if (product) {
      res.status(200).json({ message: "Cart Add Successfully." });
    }
  } catch (error) {
    res.status(404).json({ error: "failed to add cart data" });
  }
});

// get all cart item

async function getAllCartItem() {
  try {
    const product = await Cart.find().populate("product");

    return product;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/api/cart", async (req, res) => {
  try {
    const cartItem = await getAllCartItem();

    if (cartItem) {
      res.json(cartItem);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

// Delete cart item
async function deleteFromCart(productId) {
  try {
    const item = await Cart.findByIdAndDelete(productId);
    return item;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.delete("/api/cart/remove/:productId", async (req, res) => {
  try {
    const deletedProduct = await deleteFromCart(req.params.productId);
    if (deletedProduct) {
      res.status(200).json({ message: "Data deleted successfully." });
    }
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

// add to wishlist

async function addToWishlist(wproduct) {
  try {
    const wishlistItem = Wishlist(wproduct);
    const saveItem = await wishlistItem.save();
    return saveItem;
  } catch (error) {
    console.log("Error:", error);
  }
}
app.post("/api/wishlist", async (req, res) => {
  try {
    const wishitem = await addToWishlist(req.body);
    if (wishitem) {
      res.status(200).json({ message: "wishlist added the item" });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// get all wishlist item
async function showAllWishlist() {
  try {
    const allWishlist = await Wishlist.find().populate("product");
    return allWishlist;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/api/wishlist", async (req, res) => {
  try {
    const showWishlist = await showAllWishlist();
    if (showWishlist) {
      res.json(showWishlist);
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is Running on PORT:", PORT);
});
