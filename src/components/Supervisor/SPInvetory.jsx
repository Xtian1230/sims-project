// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react'
import { db } from '../../Firebase/firebaseConfig.js' // import your Firebase config file
import { collection, getDocs, query, where, Timestamp, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import BgImage from '../../assets/BgImage.jpg'

const inventoryData = [
    { item: 'Buns', price: 5.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'HD Buns', price: 5.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'FL Buns', price: 12.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Patty', price: 15.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'FL Dog', price: 44.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Hung. Chiz', price: 65.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Cheese', price: 5.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Chori Patty', price: 22.5, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Bacon', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Cheesy HD', price: 13.5, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Egg', price: 15.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Mineral', price: 16.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Red Tea', price: 35.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'M. Dew PET', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Pepsi PET', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: '7Up PET', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Miranda PET', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Rootbeer PET', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Tropicana PET', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Sting PET', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null },
    { item: 'Gatorade PET', price: 25.0, nagcarlan: 0, rizal: 0, sanPablo: 0, rowAction: null }
]
const SPInventory = () => {
    const [inventory, setInventory] = useState(inventoryData)
    const [selectedLocation, setSelectedLocation] = useState('nagcarlan')
    const [quantityInput, setQuantityInput] = useState({})
    const [transferLocation, setTransferLocation] = useState({})
    const [currentDate, setCurrentDate] = useState('')
    const [notification, setNotification] = useState({ message: '', type: '' })

    // Fetch inventory data function wrapped with useCallback
    const fetchInventoryData = useCallback(async () => {
        try {
            const inventoryQuery = query(collection(db, 'inventory'), where('location', '==', selectedLocation))
            const querySnapshot = await getDocs(inventoryQuery)
            const fetchedData = querySnapshot.docs.map((doc) => doc.data())

            const updatedInventory = inventoryData.map((item) => {
                const fetchedItem = fetchedData.find((data) => data.item === item.item)
                return fetchedItem ? { ...item, [selectedLocation]: fetchedItem.quantity } : item
            })

            setInventory(updatedInventory)
        } catch (error) {
            console.error('Error fetching inventory data:', error)
            setNotification({ message: 'Failed to load inventory data. Please try again.', type: 'error' })
        }
    }, [selectedLocation])

    // Handle date setup and fetching data
    useEffect(() => {
        const date = new Date()
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`
        setCurrentDate(formattedDate)

        fetchInventoryData() // Call fetchInventoryData
    }, [fetchInventoryData]) // Include fetchInventoryData as a dependency

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value)
    }

    const handleInputChange = (index, value) => {
        const parsedValue = parseInt(value, 10)

        setQuantityInput((prevState) => ({
            ...prevState,
            [index]: isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue // Ensure no negative value
        }))
    }

    const handleUpdateQuantity = async (index, type) => {
        const inputQuantity = quantityInput[index] || 0
        const currentDateTime = new Date() // Capture the action date

        setInventory((prevInventory) => {
            const updatedInventory = prevInventory.map((item, idx) => {
                if (idx === index) {
                    const currentQuantity = item[selectedLocation]
                    let newQuantity

                    if (type === 'add') {
                        newQuantity = currentQuantity + inputQuantity
                    } else if (type === 'remove') {
                        if (inputQuantity > currentQuantity) {
                            setNotification({ message: 'Cannot subtract more than available quantity.', type: 'error' })
                            return item
                        }
                        newQuantity = currentQuantity - inputQuantity
                    }

                    // Log the action to Firestore
                    const historyRef = collection(db, 'inventoryHistory')
                    setDoc(doc(historyRef), {
                        item: item.item,
                        action: type,
                        quantity: inputQuantity,
                        location: selectedLocation,
                        newQuantity,
                        date: Timestamp.fromDate(currentDateTime)
                    }).catch((error) => console.error('Error logging history:', error))

                    return { ...item, [selectedLocation]: newQuantity, rowAction: type === 'add' ? 'add' : 'sub' }
                }
                return item
            })

            return updatedInventory
        })

        setQuantityInput((prevState) => ({
            ...prevState,
            [index]: ''
        }))
    }

    const handleTransfer = async (index) => {
        const transferQty = Number(quantityInput[index]) || 0
        const transferTo = transferLocation[index]
        const currentDateTime = new Date() // Capture the action date

        if (!transferTo || transferTo === selectedLocation) {
            setNotification({ message: 'Please select a valid transfer location.', type: 'error' })
            return
        }

        if (transferQty <= 0) {
            setNotification({ message: 'Transfer quantity must be greater than 0.', type: 'error' })
            return
        }

        const sourceItem = inventory[index]
        if (transferQty > sourceItem[selectedLocation]) {
            setNotification({ message: 'Cannot transfer more than available quantity.', type: 'error' })
            return
        }

        try {
            const sourceDocRef = doc(db, 'inventory', `${sourceItem.item}_${selectedLocation}`)
            const destDocRef = doc(db, 'inventory', `${sourceItem.item}_${transferTo}`)
            const destDocSnapshot = await getDoc(destDocRef)

            const newDestinationQuantity =
                (destDocSnapshot.exists() ? destDocSnapshot.data().quantity : 0) + transferQty

            await updateDoc(sourceDocRef, {
                quantity: sourceItem[selectedLocation] - transferQty,
                date: Timestamp.fromDate(currentDateTime)
            })

            await setDoc(destDocRef, {
                item: sourceItem.item,
                price: sourceItem.price,
                location: transferTo,
                quantity: newDestinationQuantity,
                date: Timestamp.fromDate(currentDateTime)
            })

            // Log transfer action to Firestore
            const historyRef = collection(db, 'inventoryHistory')
            setDoc(doc(historyRef), {
                item: sourceItem.item,
                action: 'transfer',
                quantity: transferQty,
                fromLocation: selectedLocation,
                toLocation: transferTo,
                date: Timestamp.fromDate(currentDateTime)
            }).catch((error) => console.error('Error logging history:', error))

            setInventory((prevInventory) => {
                const updatedInventory = [...prevInventory]
                updatedInventory[index][selectedLocation] -= transferQty
                updatedInventory[index][transferTo] = (prevInventory[index][transferTo] || 0) + transferQty
                return updatedInventory
            })

            setNotification({ message: 'Transfer successful!', type: 'success' })
        } catch (error) {
            console.error('Error during transfer:', error)
            setNotification({ message: 'Transfer failed. Please try again.', type: 'error' })
        }

        setTimeout(() => setNotification({ message: '', type: '' }), 3000)
    }

    const calculateTotalPrice = (item) => {
        return item.price * item[selectedLocation]
    }

    const calculateGrandTotal = () => {
        return inventory.reduce((total, item) => total + calculateTotalPrice(item), 0).toFixed(2)
    }

    const handleTransferLocationChange = (index, location) => {
        setTransferLocation((prevState) => ({
            ...prevState,
            [index]: location
        }))
    }

    const handleSave = async () => {
        try {
            await Promise.all(
                inventory.map(async (item) => {
                    const itemDoc = doc(db, 'inventory', `${item.item}_${selectedLocation}`)
                    await setDoc(itemDoc, {
                        item: item.item,
                        price: item.price,
                        location: selectedLocation,
                        quantity: item[selectedLocation], // Save the quantity for the selected location
                        date: Timestamp.fromDate(new Date()),
                        formattedDate: currentDate
                    })
                })
            )
            // Reset rowAction after save
            setInventory((prevInventory) =>
                prevInventory.map((item) => ({
                    ...item,
                    rowAction: null
                }))
            )

            setNotification({ message: 'Inventory data saved successfully!', type: 'success' })
        } catch (error) {
            console.error('Error saving data to Firebase:', error)
            setNotification({ message: 'Failed to save inventory data. Please try again.', type: 'error' })
        }

        setTimeout(() => setNotification({ message: '', type: '' }), 3000)
    }

    const [historyLog, setHistoryLog] = useState([])

    // Fetch history log
    const fetchHistoryLog = async () => {
        try {
            const historySnapshot = await getDocs(collection(db, 'inventoryHistory'))
            const historyData = historySnapshot.docs.map((doc) => doc.data())
            setHistoryLog(historyData)
        } catch (error) {
            console.error('Error fetching history log:', error)
        }
    }

    // Fetch history on component load
    useEffect(() => {
        fetchHistoryLog()
    }, [])

    return (
        <div
            className="min-h-screen overflow-hidden bg-gray-100 p-6 flex items-center justify-center"
            style={{ backgroundImage: `url(${BgImage})` }}
        >
            <div className="bg-white/90 rounded-lg shadow-lg backdrop-blur-md p-4 sm:p-8 w-full max-w-lg md:max-w-3xl lg:max-w-5xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-black text-center mb-4 sm:mb-6">Inventory</h1>
                <p className="text-black font-medium text-base sm:text-lg mb-4 sm:mb-6 text-center sm:text-right">
                    Date: {currentDate}
                </p>

                {/* Location Selection */}
                <div className="flex flex-col sm:flex-row items-center sm:justify-start mb-4 sm:mb-6">
                    <label htmlFor="location" className="text-gray-700 font-semibold mr-0 sm:mr-3 mb-2 sm:mb-0">
                        Select Location:
                    </label>
                    <select
                        id="location"
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-auto"
                    >
                        <option value="nagcarlan">Nagcarlan</option>
                        <option value="rizal">Rizal</option>
                        <option value="sanPablo">San Pablo</option>
                    </select>
                </div>

                {/* Grand Total */}
                <div className="flex justify-center sm:justify-start mb-4 sm:mb-6 bg-yellow-100 p-4 rounded-lg shadow-md">
                    <span className="text-base sm:text-lg font-semibold text-gray-700 mr-2">Grand Total Price:</span>
                    <span className="text-lg sm:text-xl font-bold text-yellow-600">{calculateGrandTotal()}</span>
                </div>

                {/* Inventory Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-yellow-300 text-gray-800">
                                <th className="px-2 sm:px-4 py-3 border-b-2 border-yellow-400 text-left text-xs sm:text-sm">
                                    Items
                                </th>
                                <th className="px-2 sm:px-4 py-3 border-b-2 border-yellow-400 text-left text-xs sm:text-sm">
                                    Price
                                </th>
                                <th className="px-2 sm:px-4 py-3 border-b-2 border-yellow-400 text-left text-xs sm:text-sm">
                                    Quantity
                                </th>
                                <th className="px-2 sm:px-4 py-3 border-b-2 border-yellow-400 text-left text-xs sm:text-sm">
                                    Total Price
                                </th>
                                <th className="px-2 sm:px-4 py-3 border-b-2 border-yellow-400 text-left text-xs sm:text-sm">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`
                    ${item.rowAction === 'add' ? 'bg-green-100' : ''} 
                    ${item.rowAction === 'sub' ? 'bg-red-100' : ''} 
                    ${item.rowAction === 'transfer' ? 'bg-blue-100' : ''} 
                    hover:bg-gray-100 transition-colors
                  `}
                                >
                                    <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-700 text-xs sm:text-sm">
                                        {item.item}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-700 text-xs sm:text-sm">
                                        {item.price.toFixed(2)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-700 text-xs sm:text-sm">
                                        {item[selectedLocation]}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-700 text-xs sm:text-sm">
                                        {calculateTotalPrice(item).toFixed(2)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-700 flex flex-wrap gap-2">
                                        <input
                                            type="number"
                                            value={quantityInput[index] || ''}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            placeholder="Enter amount"
                                            className="px-2 py-1 border border-gray-300 rounded text-center w-full sm:w-20 text-xs sm:text-sm"
                                        />
                                        <button
                                            onClick={() => handleUpdateQuantity(index, 'add')}
                                            className="px-2 py-1 bg-green-500 text-white rounded shadow hover:bg-green-600 transition text-xs sm:text-sm"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => handleUpdateQuantity(index, 'remove')}
                                            className="px-2 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition text-xs sm:text-sm"
                                        >
                                            Sub
                                        </button>
                                        <select
                                            value={transferLocation[index] || ''}
                                            onChange={(e) => handleTransferLocationChange(index, e.target.value)}
                                            className="px-2 py-1 border rounded text-gray-700"
                                        >
                                            <option value="">Select</option>
                                            <option value="nagcarlan">Nagcarlan</option>
                                            <option value="rizal">Rizal</option>
                                            <option value="sanPablo">San Pablo</option>
                                        </select>
                                        <button
                                            onClick={() => handleTransfer(index)}
                                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                                        >
                                            Transfer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Notification Message */}
                {notification.message && (
                    <div
                        className={`mt-6 p-4 rounded-lg text-white text-xs sm:text-sm ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        {notification.message}
                    </div>
                )}

                {/* History Log Section */}
                <div className="mt-8">
                    <h2 className="text-lg font-bold mb-4">History Log</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-gray-200 text-gray-800">
                                    <th className="px-4 py-2 border-b text-left">Item</th>
                                    <th className="px-4 py-2 border-b text-left">Action</th>
                                    <th className="px-4 py-2 border-b text-left">Quantity</th>
                                    <th className="px-4 py-2 border-b text-left">Location(s)</th>
                                    <th className="px-4 py-2 border-b text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyLog.map((log, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 border-b">{log.item}</td>
                                        <td className="px-4 py-2 border-b">{log.action}</td>
                                        <td className="px-4 py-2 border-b">{log.quantity}</td>
                                        <td className="px-4 py-2 border-b">
                                            {log.action === 'transfer'
                                                ? `${log.fromLocation} ➡️ ${log.toLocation}`
                                                : log.location}
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            {new Date(log.date.toDate()).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSave}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 shadow-md transition duration-150 ease-in-out text-xs sm:text-sm"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SPInventory
