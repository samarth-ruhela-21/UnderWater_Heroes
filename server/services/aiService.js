const axios = require('axios');
const FormData = require('form-data');

const analyzeImage = async (fileBuffer, filename) => {
  try {
    const form = new FormData();
    form.append('image', fileBuffer, filename);

    // Call the Python Microservice
    const response = await axios.post('http://localhost:5000/detect/plastic', form, {
      headers: { ...form.getHeaders() }
    });

    return response.data; // Returns { plastic_count: 5, is_polluted: true }
  } catch (error) {
    console.error("AI Service Error:", error.message);
    return { plastic_count: 0, is_polluted: false, error: true };
  }
};

module.exports = analyzeImage;