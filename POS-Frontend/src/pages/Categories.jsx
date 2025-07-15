import React, { useState, useEffect } from 'react';
import axiosWrapper from '../https/axiosWrapper';
import Modal from '../components/shared/Modal';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching categories...');
            const response = await axiosWrapper.get('/categories');
            console.log('Categories response:', response);
            if (response.data && response.data.data) {
                setCategories(response.data.data);
            } else {
                console.error('Invalid response format:', response);
                toast.error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.name.trim()) {
                toast.error('Category name is required');
                return;
            }

            console.log('Submitting category:', formData);
            
            if (editMode) {
                console.log('Updating category:', selectedCategory._id);
                const response = await axiosWrapper.put(`/categories/${selectedCategory._id}`, formData);
                console.log('Update response:', response);
                toast.success('Category updated successfully');
            } else {
                console.log('Creating new category');
                const response = await axiosWrapper.post('/categories', formData);
                console.log('Create response:', response);
                toast.success('Category created successfully');
            }
            
            setShowModal(false);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            console.error('Operation failed:', error);
            toast.error(error.response?.data?.message || error.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axiosWrapper.delete(`/categories/${id}`);
                toast.success('Category deleted successfully');
                fetchCategories();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete category');
            }
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setEditMode(true);
        setShowModal(true);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Categories
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            setEditMode(false);
                            setFormData({ name: '', description: '' });
                            setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Add Category</span>
                    </motion.button>
                </motion.div>

                {isLoading ? (
                    <motion.div 
                        className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-16 h-16 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-opacity-50"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-600">Loading categories...</p>
                    </motion.div>
                ) : categories.length === 0 ? (
                    <motion.div 
                        className="text-center py-16 bg-white rounded-2xl shadow-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
                        <p className="text-gray-500 mb-8">Get started by adding your first category</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setEditMode(false);
                                setFormData({ name: '', description: '' });
                                setShowModal(true);
                            }}
                            className="bg-blue-100 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-200 transition-colors duration-300"
                        >
                            Create Category
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {categories.map((category) => (
                                <motion.div
                                    key={category._id}
                                    variants={cardVariants}
                                    layout
                                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <motion.h3 
                                        className="text-xl font-semibold text-gray-800 mb-2"
                                        layoutId={`title-${category._id}`}
                                    >
                                        {category.name}
                                    </motion.h3>
                                    <motion.p 
                                        className="text-gray-600 mb-6 min-h-[3rem]"
                                        layoutId={`desc-${category._id}`}
                                    >
                                        {category.description || 'No description provided'}
                                    </motion.p>
                                    <motion.div 
                                        className="flex justify-end space-x-3"
                                        layout
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleEdit(category)}
                                            className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-2 rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 flex items-center space-x-1 shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            <span>Edit</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDelete(category._id)}
                                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-1 shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>Delete</span>
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                <AnimatePresence>
                    {showModal && (
                        <Modal onClose={() => setShowModal(false)}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            {editMode ? 'Edit Category' : 'Add New Category'}
                                        </h3>
                                        <p className="text-gray-600 mt-2">
                                            {editMode ? 'Update category information' : 'Create a new category for your menu'}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                                                required
                                                placeholder="Enter category name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                                                rows="4"
                                                placeholder="Enter category description (optional)"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -1 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -1 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                                        >
                                            {editMode ? 'Update Category' : 'Create Category'}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </Modal>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Categories;
