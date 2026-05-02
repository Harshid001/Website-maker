export const mockAIResponse = (input, type = 'text') => {
  const responses = {
    website: {
      hero: {
        title: `Welcome to ${input || 'Our Business'}`,
        subtitle: 'Your trusted partner for quality products and services.',
        cta: 'Get Started',
      },
      about: {
        title: 'About Us',
        description: `${input || 'Our Business'} is dedicated to providing the best experience for our customers. With years of expertise, we deliver quality solutions tailored to your needs.`,
      },
      services: [
        { title: 'Web Design', description: 'Beautiful, responsive websites.' },
        { title: 'Branding', description: 'Logo and brand identity design.' },
        { title: 'Marketing', description: 'Digital marketing strategies.' },
      ],
      contact: {
        email: 'hello@example.com',
        phone: '+1 234 567 890',
        address: '123 Business Street, City, Country',
      },
    },
    design: {
      suggestion: `Try a bold gradient background with clean sans-serif typography for your ${input || 'design'}.`,
      colors: ['#6366f1', '#ec4899', '#f59e0b'],
      fonts: ['Inter', 'Poppins', 'Outfit'],
    },
    text: {
      message: `Here is AI-generated content for: "${input || 'your request'}"`,
      result: 'This is a mock AI response. Connect a real AI API for production use.',
    },
  };

  return responses[type] || responses.text;
};
