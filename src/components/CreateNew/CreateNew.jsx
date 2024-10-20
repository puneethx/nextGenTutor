import React, { useState, useEffect } from "react";
import { X, Upload, Plus } from "lucide-react";
import "./CreateNew.css"
import data from "../../data.json"

const CreateNew = ({ isOpen, onClose, onSubmit }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null,
        category: ''
    });
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        file: ''
    });
    const [touched, setTouched] = useState({
        title: false,
        description: false,
        file: false
    });


    const handleClose = () => {
        setStep(1);
        setFormData({
            title: '',
            description: '',
            file: null,
            category: ''
        });
        setErrors({
            title: '',
            description: '',
            file: ''
        });
        setTouched({
            title: false,
            description: false,
            file: false
        });
        onClose();
    };


    const validateField = (name, value) => {
        switch (name) {
            case 'title':
                return !value.trim() ? 'Title is required' : '';
            case 'description':
                return !value.trim() ? 'Description is required' : '';
            case 'file':
                return !value ? 'Please upload a file' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        setErrors(prev => ({
            ...prev,
            [fieldName]: validateField(fieldName, formData[fieldName])
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setTouched(prev => ({ ...prev, file: true }));

        if (!file) {
            setErrors(prev => ({ ...prev, file: 'Please select a file' }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, file: 'File size should be less than 5MB' }));
            return;
        }

        setFormData(prev => ({ ...prev, file }));
        setErrors(prev => ({ ...prev, file: '' }));
    };

    const validateStep1 = () => {
        const newErrors = {
            title: validateField('title', formData.title),
            description: validateField('description', formData.description),
            file: validateField('file', formData.file)
        };

        setErrors(newErrors);
        setTouched({
            title: true,
            description: true,
            file: true
        });

        return !Object.values(newErrors).some(error => error);
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        if (!formData.category) {
            alert('Please select a category');
            return;
        }

        try {
            const response = await fetch('http://api.com/2394830-298309', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                window.location.href = '/biology';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const ErrorMessage = ({ message }) => (
        message ? (
            <div className="error-message">
                <span>{message}</span>
            </div>
        ) : null
    );

    if (!isOpen) return null;
    return (
        <div className="model-overlay">
            <div className="model-content">
                <div className="model-header">
                    <h2 className="model-title">Describe about your topic</h2>
                    <button onClick={handleClose} className="close-button">
                        <X size={24} />
                    </button>
                </div>

                {step === 1 ? (
                    <div className="form-container">
                        <div className="form-group">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                className={`input-field ${touched.title && errors.title ? 'error' : ''}`}
                                value={formData.title}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('title')}
                            />
                            <ErrorMessage message={touched.title && errors.title} />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="description"
                                placeholder="Description"
                                className={`input-field ${touched.description && errors.description ? 'error' : ''}`}
                                style={{ height: '120px', resize: 'none' }}
                                value={formData.description}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('description')}
                            />
                            <ErrorMessage message={touched.description && errors.description} />
                        </div>

                        <div className="form-group">
                            <div className="file-upload-container">
                                <label className={`file-upload-button ${touched.file && errors.file ? 'error' : ''}`}>
                                    <Upload size={20} />
                                    Upload File
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept=".doc,.docx,.pdf"
                                    />
                                </label>
                                <span className="file-name">
                                    {formData.file ? formData.file.name : 'Upload document file (max, 5MB)'}
                                </span>
                            </div>
                            <ErrorMessage message={touched.file && errors.file} />
                        </div>

                        <div className="form-actions">
                            <button
                                onClick={handleNext}
                                className={`action-button ${Object.values(errors).some(error => error) ? 'disabled' : ''}`}
                                disabled={Object.values(errors).some(error => error)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Categories</h3>
                        <div className="category-grid">
                            {data.categories.map((category) => (
                                <label key={category} className="category-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category}
                                        checked={formData.category === category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="form-radio"
                                    />
                                    <span>{category}</span>
                                </label>
                            ))}
                        </div>

                        <div className="form-actions">
                            <button
                                onClick={handleSubmit}
                                className="action-button create-button"
                                style={{ marginTop: '1rem' }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateNew