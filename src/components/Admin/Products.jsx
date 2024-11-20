// eslint-disable-next-line no-unused-vars
import React from 'react';
import BgImage from '../../assets/BgImage.jpg';
import cheesebg from '../../assets/chesesbg.png';
import cheesehd from '../../assets/Cheesedg.png';
import beefbg from '../../assets/beefbg.png';
import hungchiz from '../../assets/hungchiz.png';
import footlong from '../../assets/footlong.png';
import eggsw from '../../assets/eggsw.png';
import bacon from '../../assets/baconsw.png';
import pepsi from '../../assets/pepsi.jpg';
import mountainDew from '../../assets/MountainDew.jpg'
import mineral from '../../assets/mineral.jpg'

// Styling for the background
const BgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const Products = () => {
  // Updated product list with images
  const products = [
    {
      name: 'Cheese Burger',
      description: 'Beef patty with melted cheese, catsup and mayonnaise',
      price: '50 PHP',
      image: cheesebg, // Replace with actual image path
    },
    {
      name: 'Cheesy Hotdog',
      description: 'Grilled cheesy hotdog with catsup and mayonnaise',
      price: '37 PHP',
      image: cheesehd, // Replace with actual image path
    },
    {
      name: 'Beef Burger',
      description: 'Classic beef patty with catsup and mayonnaise',
      price: '40 PHP',
      image: beefbg, // Replace with actual image path
    },
    {
      name: 'Hungarian Sausage Burger',
      description: 'Hungarian sausage with lettuce and special sauce',
      price: '70 PHP',
      image: hungchiz, // Replace with actual image path
    },
    {
      name: 'Footlong Hotdog Sandwich',
      description: 'Footlong sausage with catsup and mayonnaise',
      price: '56 PHP',
      image: footlong, // Replace with actual image path
    },
    {
      name: 'Egg Sandwich',
      description: 'Fried egg with catsup and mayonnaise',
      price: '20 PHP',
      image: eggsw, // Replace with actual image path
    },
    {
      name: 'Bacon Burger',
      description: 'Beef patty with crispy bacon, catsup and mayonnaise',
      price: '50 PHP',
      image: bacon, // Replace with actual image path
    },
    {
      name: 'Mineral Water',
      description: '500ml bottled water',
      price: '25 PHP',
      image: mineral, // Replace with actual image path
    },
    {
      name: 'Pepsi',
      description: 'Soft Drink',
      price: '25 PHP',
      image: pepsi, // Replace with actual image path
    },
    {
      name: 'Mountain Dew',
      description: 'Soft Drink',
      price: '25 PHP',
      image: mountainDew, // Replace with actual image path
    },
  ];

  return (
    <div style={BgStyle} className="min-h-screen overflow-hidden flex items-center justify-center">
      <div className="min-h-screen bg-white/60 backdrop-blur-xl p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-black text-center mb-10">Angels Burger Product List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full">
          {products.map((product, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-yellow-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <h2 className="text-xl font-semibold text-yellow-700 mb-2 text-center">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-4 text-sm text-center">
                {product.description}
              </p>
              <p className="text-yellow-800 font-bold text-lg text-center">
                {product.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
