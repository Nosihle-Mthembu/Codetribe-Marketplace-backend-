const { db } = require("../config/firebase");

const addProduct = async (req, res) => {
  const { title, description, price } = req.body;
  const { email } = req.user;

  try {
    const productRef = db.collection("products").doc();
    await productRef.set({
      title,
      description,
      price,
      available: true,
      owner: email,
    });
    res.status(201).send("Product added");
  } catch (error) {
    res.status(500).send("Error adding product");
  }
};

const getProducts = async (req, res) => {
  try {
    const productsSnapshot = await db.collection("products").get();
    const products = productsSnapshot.docs.map((doc) => doc.data());
    res.json(products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
};

module.exports = { addProduct, getProducts };
