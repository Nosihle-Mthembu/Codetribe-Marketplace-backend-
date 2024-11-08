const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const app = express();
app.use(express.json());

let products = [];

// GET / - List products
router.get('/', (req, res) => {
  try {
    const visibleProducts = products.filter((product) => !product.isHidden);
    res.json(visibleProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === parseInt(id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  res.json(product);
});

// POST / - Add a new product
router.post('/', (req, res) => {
  const { name, price, description, image, isHidden } = req.body;

  if (!name || !price || !description || !image) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    description,
    image,
    isHidden: isHidden || false,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/:id/hide', (req, res) => {
  const { id } = req.params;
  
  // Find the product by id
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Toggle the 'isHidden' property
  product.isHidden = !product.isHidden;
  res.json(product);
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;

  if (!name || !price || !description || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, description, image }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});



router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === parseInt(id));
  
  if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });
  
  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
