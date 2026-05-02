const axios = require('axios');
require('dotenv').config();

const PYTHON_AI_SERVICE_URL = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000';

const aiService = {
    generateContent: async (data) => {
        try {
            const response = await axios.post(`${PYTHON_AI_SERVICE_URL}/generate-content`, data);
            return response.data;
        } catch (error) {
            console.error('Error calling Python AI Service (generate-content):', error.message);
            throw error;
        }
    },

    generateSEO: async (data) => {
        try {
            const response = await axios.post(`${PYTHON_AI_SERVICE_URL}/generate-seo`, data);
            return response.data;
        } catch (error) {
            console.error('Error calling Python AI Service (generate-seo):', error.message);
            throw error;
        }
    },

    suggestTemplate: async (data) => {
        try {
            const response = await axios.post(`${PYTHON_AI_SERVICE_URL}/suggest-template`, data);
            return response.data;
        } catch (error) {
            console.error('Error calling Python AI Service (suggest-template):', error.message);
            throw error;
        }
    },

    suggestAnimation: async (data) => {
        try {
            const response = await axios.post(`${PYTHON_AI_SERVICE_URL}/suggest-animation`, data);
            return response.data;
        } catch (error) {
            console.error('Error calling Python AI Service (suggest-animation):', error.message);
            throw error;
        }
    },

    generateDesignText: async (data) => {
        try {
            const response = await axios.post(`${PYTHON_AI_SERVICE_URL}/generate-design-text`, data);
            return response.data;
        } catch (error) {
            console.error('Error calling Python AI Service (generate-design-text):', error.message);
            throw error;
        }
    }
};

module.exports = aiService;
