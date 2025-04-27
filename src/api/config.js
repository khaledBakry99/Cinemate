import axios from "axios";

const API_BASE_URL = "http://cinemate-001-site1.jtempurl.com";

// إنشاء متغير لتخزين طلب تحديث التوكن الحالي
let refreshTokenRequest = null;

// دالة لتحديث التوكن
const refreshTokenFn = async () => {
  try {
    const currentRefreshToken = localStorage.getItem("refreshToken");
    const currentAccessToken = localStorage.getItem("token");

    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/Auth/refresh-token`,
      {
        accessToken: currentAccessToken,
        refreshToken: currentRefreshToken,
      }
    );

    const { data } = response;
    if (data.success) {
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      return data.data.accessToken;
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw error;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    // إضافة رأس CORS
    "Access-Control-Allow-Origin": "*",
  },
  // زيادة مهلة الانتظار الافتراضية
  timeout: 15000,
  // السماح بالمحاولة مرة أخرى في حالة فشل الاتصال
  retries: 2,
  retryDelay: 1000,
  // لا نستخدم withCredentials لتجنب مشكلة CORS
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

// إضافة معترض للاستجابة للتصحيح
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // فقط في بيئة التطوير
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.status);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for handling tokens
api.interceptors.request.use(
  (config) => {
    // فقط في بيئة التطوير
    if (process.env.NODE_ENV === "development") {
      console.log("Request Details:", {
        url: config.url,
        method: config.method,
        // عدم طباعة الهيدرز والبيانات الحساسة
        // headers: config.headers,
        // data: config.data
      });
    }

    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
      // تسجيل الهيدر للتحقق
      if (process.env.NODE_ENV === "development") {
        console.log("Authorization header set:", config.headers.Authorization);
      }
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 وليس طلب تحديث التوكن نفسه
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // استخدام نفس طلب التحديث إذا كان موجوداً
        refreshTokenRequest = refreshTokenRequest || refreshTokenFn();
        const newAccessToken = await refreshTokenRequest;
        refreshTokenRequest = null;

        // تحديث التوكن في الطلب الأصلي وإعادة المحاولة
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        refreshTokenRequest = null;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// إضافة معترض للطلبات لإعادة المحاولة في حالة فشل الاتصال
api.interceptors.request.use(
  async (config) => {
    // إضافة معلومات إعادة المحاولة إلى التكوين
    config.retryCount = config.retryCount || 0;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling errors and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // إذا لم يكن هناك تكوين، لا يمكن إعادة المحاولة
    if (
      !config ||
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      return Promise.reject(error);
    }

    // الحد الأقصى لعدد المحاولات
    const maxRetries = config.retries || api.defaults.retries || 2;

    // إذا تم تجاوز الحد الأقصى، رفض الوعد
    if (config.retryCount >= maxRetries) {
      return Promise.reject(error);
    }

    // زيادة عداد المحاولات
    config.retryCount += 1;

    // حساب التأخير قبل إعادة المحاولة
    const delay = config.retryDelay || api.defaults.retryDelay || 1000;
    const retryDelay = delay * Math.pow(2, config.retryCount - 1);

    console.log(
      `Retrying request to ${config.url} (attempt ${config.retryCount}/${maxRetries}) after ${retryDelay}ms`
    );

    // انتظار قبل إعادة المحاولة
    await new Promise((resolve) => setTimeout(resolve, retryDelay));

    // إعادة المحاولة
    return api(config);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // طباعة معلومات الخطأ للتصحيح
    if (process.env.NODE_ENV === "development") {
      if (error.response) {
        console.error(
          `API Error (${error.response.status}):`,
          error.response.data
        );
      } else if (error.request) {
        console.error("Network Error:", error.message);
      } else {
        console.error("Error:", error.message);
      }
    }

    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
