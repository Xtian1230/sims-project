// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import BgImage from '../../assets/BgImage.jpg';
import cheesebg from '../../assets/chesesbg.png';
import cheesehd from '../../assets/Cheesedg.png';
import beefbg from '../../assets/beefbg.png';
import hungchiz from '../../assets/hungchiz.png';
import footlong from '../../assets/footlong.png';
import eggsw from '../../assets/eggsw.png';
import bacon from '../../assets/baconsw.png';
import pepsi from '../../assets/pepsi.jpg';
import mountainDew from '../../assets/MountainDew.jpg';
import mineral from '../../assets/mineral.jpg';

// Styling for the background
const BgStyle = {
    backgroundImage: `url(${BgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
};

const Products = () => {
    const [cart, setCart] = useState({}); // Tracks quantities of items and add-ons
    const [history, setHistory] = useState([]); // Tracks purchase history
    const [isHistoryVisible, setIsHistoryVisible] = useState(true); // Controls visibility of the side panel

    // Product categories
    const mainProducts = [
        {
            name: 'Cheese Burger', description: 'Beef patty with melted cheese, catsup and mayonnaise', price: 50, image: cheesebg,
            addOns: [
                { name: 'Cheese', price: 5 },
                { name: 'Bacon', price: 25 },
                { name: 'Egg', price: 15 },
            ],
        },
        {
            name: 'Cheesy Hotdog', description: 'Grilled cheesy hotdog with catsup and mayonnaise', price: 37, image: cheesehd,
            addOns: [
                { name: 'Cheese', price: 5 },
                { name: 'Bacon', price: 25 },
                { name: 'Egg', price: 15 },
            ],
        },
        {
            name: 'Beef Burger', description: 'Classic beef patty with catsup and mayonnaise', price: 40, image: beefbg,
            addOns: [
                { name: 'Cheese', price: 5 },
                { name: 'Bacon', price: 25 },
                { name: 'Egg', price: 15 },
            ],
        },
        {
            name: 'Hungarian Sausage Burger', description: 'Hungarian sausage with lettuce and special sauce', price: 70, image: hungchiz,
            addOns: [
                { name: 'Cheese', price: 5 },
                { name: 'Bacon', price: 25 },
                { name: 'Egg', price: 15 },
            ],
        },
        {
            name: 'Footlong Hotdog Sandwich', description: 'Footlong sausage with catsup and mayonnaise', price: 56, image: footlong,
            addOns: [
                { name: 'Cheese', price: 5 },
                { name: 'Bacon', price: 25 },
                { name: 'Egg', price: 15 },
            ],
        },
        {
            name: 'Egg Sandwich', description: 'Fried egg with catsup and mayonnaise', price: 20, image: eggsw,
            addOns: [
                { name: 'Cheese', price: 5 },
                { name: 'Bacon', price: 25 },
                { name: 'Egg', price: 15 },
            ],
        },
        {
            name: 'Bacon Sandwich', description: 'Beef patty with crispy bacon, catsup and mayonnaise', price: 50, image: bacon, addOns: [
                { name: 'Cheese', price: 5 },
                { name: 'Bacon', price: 25 },
                { name: 'Egg', price: 15 },
            ],
        },
    ];

    const beverages = [
        { name: 'Mineral Water', description: '500ml bottled water', price: 16, image: mineral },
        { name: 'Lipton', description: 'Lipton Red Tea', price: 35 },
        { name: 'Pepsi', description: 'Soft Drink', price: 25, image: pepsi },
        { name: 'Miranda', description: 'Refreshing soft drink', price: 25, image: mountainDew },
        { name: 'Rootbeer', description: 'Classic rootbeer soda', price: 25 },
        { name: 'Tropicana', description: 'Delicious fruit juice', price: 25 },
        { name: 'Sting', description: 'Energy drink', price: 25 },
        { name: 'Gatorade', description: 'Electrolyte drink', price: 25 },
    ];


    // Calculate the grand total of all finalized items
    const calculateGrandTotal = () => {
        return history.reduce((total, entry) => total + entry.totalPrice, 0);
    };

    // Add finalized item with add-ons to history
    const finalizeItem = (itemName) => {
        const relevantCartItems = Object.keys(cart).filter((key) => key.startsWith(itemName));
        const finalItem = relevantCartItems.map((key) => ({
            name: key,
            quantity: cart[key].quantity,
            price: cart[key].price,
        }));

        const totalPrice = finalItem.reduce((sum, item) => sum + item.quantity * item.price, 0);

        setHistory((prev) => [
            ...prev,
            { itemName, totalPrice, details: finalItem },
        ]);

        // Remove finalized items from the cart
        setCart((prev) => {
            const newCart = { ...prev };
            relevantCartItems.forEach((key) => delete newCart[key]);
            return newCart;
        });
    };

    const updateCart = (name, price, delta) => {
        setCart((prevCart) => {
            // Create a copy of the previous state
            const newCart = { ...prevCart };

            // Initialize or update the quantity
            const currentQuantity = newCart[name]?.quantity || 0;
            const updatedQuantity = currentQuantity + delta;

            // Remove item if quantity is 0 or less; otherwise, update quantity
            if (updatedQuantity > 0) {
                newCart[name] = { quantity: updatedQuantity, price };
            } else {
                delete newCart[name];
            }

            return newCart; // Return the updated cart
        });
    };


    const renderProduct = (product) => (
        <div
            key={product.name}
            className="p-6 bg-white border border-yellow-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
            {product.image && (
                <div className="mb-4">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-xl"
                    />
                </div>
            )}
            <h2 className="text-xl font-semibold text-yellow-700 mb-2 text-center">{product.name}</h2>
            <p className="text-gray-600 mb-4 text-sm text-center">{product.description}</p>
            <p className="text-yellow-800 font-bold text-lg text-center">{product.price} PHP</p>
            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => updateCart(product.name, parseInt(product.price), -1)}
                >
                    -
                </button>
                <span>{cart[product.name]?.quantity || 0}</span>
                <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => updateCart(product.name, parseInt(product.price), 1)}
                >
                    +
                </button>
            </div>
            {product.addOns && (
                <div className="mt-4">
                    <h3 className="text-md font-bold text-gray-700 mb-2">Add-Ons:</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        {product.addOns.map((addOn, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                                <span>{addOn.name}</span>
                                <span className="text-yellow-600">{addOn.price} PHP</span>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                                        onClick={() => updateCart(`${product.name} - ${addOn.name}`, parseInt(addOn.price), -1)}
                                    >
                                        -
                                    </button>
                                    <span>{cart[`${product.name} - ${addOn.name}`]?.quantity || 0}</span>
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                                        onClick={() => updateCart(`${product.name} - ${addOn.name}`, parseInt(addOn.price), 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button
                className="mt-4 bg-green-500 text-white px-3 py-1 rounded w-full"
                onClick={() => finalizeItem(product.name)}
            >
                OK
            </button>
        </div>
    );

    return (
        <div style={BgStyle} className="min-h-screen flex">
            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                    >
                        {isHistoryVisible ? 'Hide History' : 'Show History'}
                    </button>
                </div>
                <div className="bg-white/80 backdrop-blur-lg p-10 rounded-lg shadow-xl max-w-7xl w-full">
                    <h1 className="text-4xl font-bold text-black text-center mb-10">Angels Burger Menu</h1>
                    <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">Main Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {mainProducts.map(renderProduct)}
                    </div>
                    <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">Beverages</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {beverages.map(renderProduct)}
                    </div>
                </div>
            </div>
            {/* Sidebar (Right Side) */}
            {isHistoryVisible && (
                <div className="w-72 bg-gray-100 shadow-lg p-4 overflow-y-auto">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Order History</h2>
                    <ul className="space-y-4">
                        {history.map((entry, index) => (
                            <li key={index} className="bg-white p-4 rounded shadow">
                                <p className="font-bold">{entry.itemName}</p>
                                <ul className="text-sm text-gray-600">
                                    {entry.details.map((detail, idx) => (
                                        <li key={idx}>
                                            {detail.name} x {detail.quantity}: {detail.quantity * detail.price} PHP
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-2 font-bold text-yellow-600">
                                    Total: {entry.totalPrice} PHP
                                </p>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-lg font-bold text-gray-700">Grand Total: {calculateGrandTotal()} PHP</p>
                </div>
            )}
        </div>
    );
};

export default Products;