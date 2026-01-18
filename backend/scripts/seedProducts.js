// backend/scripts/seedProducts.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product.model');

dotenv.config({ path: './config.env' });

const sampleProducts = [
  // KURTIS
  {
    name: 'Elegant Floral Kurti',
    category: 'kurti',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1583391733981-5ead700c56cd?w=500&auto=format',
    description: 'Beautiful floral printed kurti with comfortable cotton fabric. Perfect for daily wear and casual occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    featured: true
  },
  {
    name: 'Royal Maroon Kurti',
    category: 'kurti',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format',
    description: 'Premium maroon kurti with golden embroidery work. Ideal for festive occasions.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 20,
    featured: true
  },
  // LEHNGAS
  {
    name: 'Bridal Red Lehnga',
    category: 'lehnga',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&auto=format',
    description: 'Stunning red bridal lehnga with heavy embellishments and zari work. Complete with dupatta.',
    sizes: ['S', 'M', 'L'],
    stock: 5,
    featured: true
  },
  {
    name: 'Royal Blue Lehnga',
    category: 'lehnga',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1617530982502-de7a6c1dd72e?w=500&auto=format',
    description: 'Elegant blue lehnga with golden zari work. Perfect for weddings and special occasions.',
    sizes: ['M', 'L', 'XL'],
    stock: 8,
    featured: true
  },
  // SUITES
  {
    name: 'Designer Anarkali Suite',
    category: 'suite',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1583391733981-5ead700c56cd?w=500&auto=format',
    description: 'Elegant Anarkali suite with dupatta. Perfect blend of tradition and style.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 14,
    featured: true
  },
  {
    name: 'Festive Sharara Suite',
    category: 'suite',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1617530982502-de7a6c1dd72e?w=500&auto=format',
    description: 'Stunning sharara suite for festive occasions with intricate detailing.',
    sizes: ['M', 'L', 'XL'],
    stock: 9,
    featured: true
  }
];

const seedProducts = async () => {
  try {
    // Connect to database
    const DB = process.env.DBURI.replace('<db_password>', process.env.DBPASSWORD);
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();