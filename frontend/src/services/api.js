const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    error.status = response.status;
    throw error;
  }
  return data;
};

const post = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const api = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      console.log('Sending signup data:', userData); // Debug log
      
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  getDoctorProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/users/doctor-profile`, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctor profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      throw error;
    }
  },

  getPatientProfile: async () => {
    const response = await fetch(`${API_URL}/patient-profile`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  getPatients: async () => {
    try {
      const response = await fetch(`${API_URL}/users/patients`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  getPrescriptions: async () => {
    try {
      const response = await fetch(`${API_URL}/prescriptions`, {
        headers: getHeaders()
      });
      const data = await handleResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },

  createPrescription: async (prescriptionData) => {
    try {
      console.log('Sending prescription data:', prescriptionData); // Debug log
      const response = await fetch(`${API_URL}/prescriptions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(prescriptionData),
      });
      const data = await handleResponse(response);
      console.log('Prescription creation response:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },

  getNotifications: async () => {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  markNotificationRead: async (notificationId) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  markMedicationTaken: async (prescriptionId, drugName) => {
    try {
      const response = await fetch(`${API_URL}/medication/mark-taken`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ prescriptionId, drugName })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      throw error;
    }
  },

  getMedicationHistory: async () => {
    try {
      const response = await fetch(`${API_URL}/medication/history`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching medication history:', error);
      throw error;
    }
  },

  chat: async (message, prescriptions) => {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          message, 
          prescriptions: prescriptions || [] 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.response) {
        throw new Error('Invalid response format from server');
      }

      return data;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  }
};
