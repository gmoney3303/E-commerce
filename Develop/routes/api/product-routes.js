const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products with associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one product by ID with associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = req.body.tagIds.map((tag_id) => ({
        product_id: newProduct.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTags);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update product by ID
router.put('/:id', async (req, res) => {
  try {
    const [rowsUpdated, [updatedProduct]] = await Product.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      await ProductTag.destroy({ where: { product_id: req.params.id } });

      const productTags = req.body.tagIds.map((tag_id) => ({
        product_id: req.params.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTags);
    }

    if (!rowsUpdated) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
