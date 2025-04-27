import api from "./config";

// Auth Services
export const authService = {
  // Login
  login: async (formData) => {
    const response = await api.post("/api/Auth/LogIn", formData);
    return response.data;
  },

  // Customer Registration
  customerRegister: (userData) =>
    api.post("/api/Auth/customer-register", userData),

  // Email Verification
  resendVerificationCode: (email) =>
    api.post("/api/Auth/resend-verification-code", { email }),
  confirmEmail: (data) => api.post("/api/Auth/confirm-email", data),

  // Password Management
  changePassword: async (passwordData) => {
    const response = await api.post("/api/Auth/change-password", {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    });
    return response.data;
  },
  resetPassword: (data) => api.post("/api/Auth/reset-password", data),
  sendResetPasswordCode: (email) =>
    api.post("/api/Auth/send-reset-passwordCode", { email }),

  // Token Management
  refreshToken: (token) => api.post("/api/Auth/refresh-token", { token }),

  // Scanner Management
  addScanner: (data) => api.post("/api/Auth/add-scanner", data),

  // Admin Registration
  adminRegister: (userData) => api.post("/api/Auth/admin-register", userData),
};

// Movies Services
export const movieService = {
  getAllMovies: () => api.get("/api/Movie"),
  getMovieById: (id) => api.get(`/api/Movie/${id}`),
  searchMovies: (query) => api.get(`/api/Movie/search?query=${query}`),
};

// Booking Services
export const bookingService = {
  createBooking: (bookingData) => api.post("/api/Booking", bookingData),
  getBookingsByUser: () => api.get("/api/Booking/user"),
  cancelBooking: (id) => api.delete(`/api/Booking/${id}`),
};

// Cinema Services
export const cinemaService = {
  getAllCinemas: () => api.get("/api/Cinema"),
  getCinemaById: (id) => api.get(`/api/Cinema/${id}`),
};

// Showtime Services
export const showtimeService = {
  getShowtimes: () => api.get("/api/Showtime"),
  getShowtimeById: (id) => api.get(`/api/Showtime/${id}`),
};

// Cast Services
export const castService = {
  // Get all cast members with optional filtering
  getAllCast: async (params) => {
    try {
      console.log("Fetching cast with params:", params);
      const response = await api.get("/api/Cast", { params });
      console.log("Cast API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching cast:", error);
      // إعادة رمي الخطأ مع معلومات إضافية
      throw new Error(`Failed to fetch cast: ${error.message}`);
    }
  },

  // Get a specific cast member by ID
  getCastById: async (id) => {
    try {
      console.log("Fetching cast with ID:", id);
      const response = await api.get(`/api/Cast/${id}`);
      console.log("Cast details response:", response);
      return response;
    } catch (error) {
      console.error(`Error fetching cast ${id}:`, error);
      throw new Error(`Failed to fetch cast ${id}: ${error.message}`);
    }
  },

  // Create a new cast member
  createCast: async (castData) => {
    try {
      console.log("Creating cast with data:", castData);
      const response = await api.post("/api/Cast", castData);
      console.log("Create cast response:", response);
      return response;
    } catch (error) {
      console.error("Error creating cast:", error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw new Error(`Failed to create cast: ${error.message}`);
    }
  },

  // Update an existing cast member
  updateCast: async (id, castData) => {
    try {
      console.log(`Updating cast ${id} with data:`, castData);
      const response = await api.put(`/api/Cast/${id}`, castData);
      console.log("Update cast response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating cast ${id}:`, error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to update cast ${id}: ${error.message}`);
    }
  },

  // Delete a cast member
  deleteCast: async (id) => {
    try {
      console.log(`Deleting cast ${id}`);
      const response = await api.delete(`/api/Cast/${id}`);
      console.log("Delete cast response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting cast ${id}:`, error);
      throw new Error(`Failed to delete cast ${id}: ${error.message}`);
    }
  },
};

// Image Services
export const imageService = {
  // Upload a new image
  uploadImage: async (formData) => {
    try {
      console.log(
        "Uploading image with form data:",
        Array.from(formData.entries()).map(
          ([key, value]) =>
            `${key}: ${
              value instanceof File
                ? `File(${value.name}, ${value.size} bytes)`
                : value
            }`
        )
      );

      const response = await api.post("/api/Image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // زيادة مهلة الانتظار لتحميل الملفات الكبيرة
        timeout: 30000,
      });

      console.log("Image upload response:", response);
      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  },

  // Get an image by ID
  getImage: async (id) => {
    try {
      console.log(`Fetching image ${id}`);
      const response = await api.get(`/api/Image/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching image ${id}:`, error);
      throw new Error(`Failed to fetch image ${id}: ${error.message}`);
    }
  },

  // Update an image
  updateImage: async (id, formData) => {
    try {
      console.log(
        `Updating image ${id} with form data:`,
        Array.from(formData.entries()).map(
          ([key, value]) =>
            `${key}: ${
              value instanceof File
                ? `File(${value.name}, ${value.size} bytes)`
                : value
            }`
        )
      );

      const response = await api.put(`/api/Image/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      console.log("Image update response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating image ${id}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to update image ${id}: ${error.message}`);
    }
  },

  // Delete an image
  deleteImage: async (id) => {
    try {
      console.log(`Deleting image ${id}`);
      const response = await api.delete(`/api/Image/${id}`);
      console.log("Image delete response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting image ${id}:`, error);
      throw new Error(`Failed to delete image ${id}: ${error.message}`);
    }
  },
};
