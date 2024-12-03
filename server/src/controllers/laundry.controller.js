const LaundryItem = require('../models/laundry-item.model');

exports.getAllItems = async (req, res) => {
  try {
    const items = await LaundryItem.find().sort('category name');
    res.json(items);
  } catch (error) {
    console.error('Get laundry items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const item = new LaundryItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Add laundry item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await LaundryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Update laundry item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};