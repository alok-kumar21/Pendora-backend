const { inilizeData } = require("./db/db.connect");
inilizeData();

const Products = require("./models/products.models");
const Categories = require("./models/category.models");
const Cart = require("./models/cart.models");
const Wishlist = require("./models/wishlist.models");
const Address = require("./models/address.model");

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

// API get product by title
async function showProductByTitle(productName) {
  try {
    const item = await Products.find({ name: productName });

    return item;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/v1/product/search/:producttitle", async (req, res) => {
  try {
    const product = await showProductByTitle(req.params.producttitle);
    if (product) {
      res.json(product);
    } else {
      res.status(500).json({ error: "Product not Found!" });
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

//  update cart Quantity

async function updateQuantity(productId, product) {
  try {
    const item = await Cart.findByIdAndUpdate(productId, product, {
      new: true,
    });
    return item;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.post("/api/cart/update/:cartItemId", async (req, res) => {
  try {
    const product = await updateQuantity(req.params.cartItemId, req.body);
    if (product) {
      res.status(200).json({ message: "quantity updated successfully." });
    }
  } catch (error) {
    console.log("Error:", error);
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

//  wishlist remove item
async function removeFromWishlist(productId) {
  try {
    const deletedData = await Wishlist.findByIdAndDelete(productId);
    return deletedData;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.delete("/api/wishlist/remove/:wishlistId", async (req, res) => {
  try {
    const dProduct = await removeFromWishlist(req.params.wishlistId);
    if (dProduct) {
      res.status(200).json({ message: "Product Deleted Successfully." });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

//  address Management

//  add address

async function addAddress(addaddress) {
  try {
    const address = Address(addaddress);
    const saveAddress = await address.save();
    return saveAddress;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.post("/api/v1/address", async (req, res) => {
  try {
    const Address = addAddress(req.body);
    if (Address) {
      res.status(200).json({ message: "Addresss Save Successfully." });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// get all addresses

async function showAllAddress() {
  try {
    const allAddress = await Address.find();
    return allAddress;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/api/v2/address", async (req, res) => {
  try {
    const showAddress = await showAllAddress();
    if (!showAddress) {
      res.status(404).json({ error: "address not found." });
    }
    {
      res.json(showAddress);
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// update address
async function updateAddressDetails(addressId, newAddress) {
  try {
    const updateAddress = await Address.findByIdAndUpdate(
      addressId,
      newAddress,
      { new: true }
    );
    return updateAddress;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.post("/api/v3/address/:addressId", async (req, res) => {
  try {
    const newAddress = await updateAddressDetails(
      req.params.addressId,
      req.body
    );
    if (newAddress) {
      res.status(200).json({ message: "Address updated successfully" });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

//  api for deleting address

async function addressDelete(addressId) {
  try {
    const deleteAddress = await Address.findByIdAndDelete(addressId);
    return deleteAddress;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.delete("/api/v3/address/:addressId", async (req, res) => {
  try {
    const deleteAddress = await addressDelete(req.params.addressId);
    if (deleteAddress) {
      res.status(200).json({ message: "address deleted successfully." });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is Running on PORT:", PORT);
});
