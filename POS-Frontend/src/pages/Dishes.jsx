import React, { useState, useEffect } from 'react';
import axios from '../https/axiosWrapper';
import Modal from '../components/shared/Modal';
import { toast } from 'react-hot-toast';

const Dishes = () => {
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchDishes();
        fetchCategories();
    }, []);

    const fetchDishes = async () => {
        try {
            const response = await axios.get('/dishes');
            setDishes(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch dishes');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch categories');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            if (editMode) {
                await axios.put(`/dishes/${selectedDish._id}`, submissionData);
                toast.success('Dish updated successfully');
            } else {
                await axios.post('/dishes', submissionData);
                toast.success('Dish created successfully');
            }
            setShowModal(false);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                image: '',
                isAvailable: true
            });
            fetchDishes();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this dish?')) {
            try {
                await axios.delete(`/dishes/${id}`);
                toast.success('Dish deleted successfully');
                fetchDishes();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete dish');
            }
        }
    };

    const handleEdit = (dish) => {
        setSelectedDish(dish);
        setFormData({
            name: dish.name,
            description: dish.description || '',
            price: dish.price.toString(),
            category: dish.category._id,
            image: dish.image,
            isAvailable: dish.isAvailable
        });
        setEditMode(true);
        setShowModal(true);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Dishes</h2>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setFormData({
                            name: '',
                            description: '',
                            price: '',
                            category: '',
                            image: '',
                            isAvailable: true
                        });
                        setShowModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Dish
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dishes.map((dish) => (
                    <div key={dish._id} className="bg-white p-4 rounded-lg shadow">
                        <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-semibold">{dish.name}</h3>
                        <p className="text-gray-600 mt-2">{dish.description}</p>
                        <p className="text-green-600 font-bold mt-2">₹{dish.price}</p>
                        <p className="text-gray-500 mt-1">Category: {dish.category.name}</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => handleEdit(dish)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(dish._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">
                            {editMode ? 'Edit Dish' : 'Add New Dish'}
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isAvailable}
                                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">Available</label>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                {editMode ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Dishes;
