const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI no definida');
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Atlas conectado');
  } catch (err) {
    console.error('❌ Error conectando MongoDB:', err);
    process.exit(1);
  }
};

mongoose.connection.on('error', err => console.error('MongoDB error:', err));

module.exports = { connectDB };
