const CarDetails = require('../models/CarDetails');

exports.addCarDetails = async (req, res) => {
  try {
    const { make, model, year, variant, bodyType } = req.body;

    if (!make || !model || !year || !variant || !bodyType) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newCar = new CarDetails({ make, model, year, variant, bodyType });
    await newCar.save();

    res.status(201).json({ message: '✅ Car details added successfully.', car: newCar });
  } catch (err) {
    console.error('Add Car Error:', err);
    res.status(500).json({ message: '❌ Server error while adding car details.' });
  }
};


exports.getAllCarDetails = async (req, res) => {
  try {
    const cars = await CarDetails.find();
    res.status(200).json({ cars });
  } catch (error) {
    res.status(500).json({ message: '❌ Error fetching car details' });
  }
};

exports.deleteCarDetail = async (req, res) => {
  try {
    const car = await CarDetails.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: '❌ Car not found' });

    res.status(200).json({ message: '✅ Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: '❌ Error deleting car' });
  }
};