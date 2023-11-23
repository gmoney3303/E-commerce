const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// GET all tags with associated Product data
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one tag by ID with associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });
    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a tag's name by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );
    if (!updatedTag[0]) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json({ message: 'Tag updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a tag by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({
      where: { id: req.params.id },
    });
    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
