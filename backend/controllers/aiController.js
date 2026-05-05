const aiService = require('../utils/aiService');
const { proxyToAiService } = require('../services/aiProxy.service');

const generateWebsiteContent = async (req, res) => {
    try {
        const { businessName, profession, city, services, theme } = req.body;
        
        if (!businessName || !profession || !city) {
            return res.status(400).json({ message: 'Business name, profession, and city are required' });
        }

        const content = await aiService.generateContent({
            businessName,
            profession,
            city,
            services: services || [],
            theme: theme || 'Default'
        });

        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate website content', error: error.message });
    }
};

const generateSEO = async (req, res) => {
    try {
        const { businessName, profession, city, services } = req.body;

        const seo = await aiService.generateSEO({
            businessName,
            profession,
            city,
            services: services || []
        });

        res.status(200).json(seo);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate SEO', error: error.message });
    }
};

const suggestTemplate = async (req, res) => {
    try {
        const { profession, theme } = req.body;

        const suggestion = await aiService.suggestTemplate({
            profession,
            theme: theme || 'Default'
        });

        res.status(200).json(suggestion);
    } catch (error) {
        res.status(500).json({ message: 'Failed to suggest template', error: error.message });
    }
};

const suggestAnimation = async (req, res) => {
    try {
        const { profession, theme } = req.body;

        const animations = await aiService.suggestAnimation({
            profession,
            theme: theme || 'Default'
        });

        res.status(200).json(animations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to suggest animations', error: error.message });
    }
};

const generateDesignText = async (req, res) => {
    try {
        const { designType, business, occasion, offer } = req.body;

        const text = await aiService.generateDesignText({
            designType,
            business,
            occasion,
            offer
        });

        res.status(200).json(text);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate design text', error: error.message });
    }
};

const chat = async (req, res) => {
    const response = await proxyToAiService('/api/ai/chat', req.body);
    res.status(200).json(response);
};

const generateTemplate = async (req, res) => {
    const response = await proxyToAiService('/api/ai/generate-template', req.body);
    res.status(200).json(response);
};

const suggestLayout = async (req, res) => {
    const response = await proxyToAiService('/api/ai/suggest-layout', req.body);
    res.status(200).json(response);
};

const improveCopy = async (req, res) => {
    const response = await proxyToAiService('/api/ai/improve-copy', req.body);
    res.status(200).json(response);
};

module.exports = {
    generateWebsiteContent,
    generateSEO,
    suggestTemplate,
    suggestAnimation,
    generateDesignText,
    chat,
    generateTemplate,
    suggestLayout,
    improveCopy
};
