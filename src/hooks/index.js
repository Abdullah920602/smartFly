import { useState, useEffect } from 'react';
import { getAllFirestore } from '../services/firestoreDataService';

/**
 * Hook لجلب جميع البيانات من Firestore
 * @returns {Object} البيانات وحالة التحميل والخطأ
 */
export const useFirestoreData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllFirestore();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

/**
 * Hook لإدارة حالة الشات
 * @returns {Object} حالة الشات والدوال المساعدة
 */
export const useChatState = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const setTyping = (typing) => {
    setIsTyping(typing);
  };

  return {
    messages,
    isTyping,
    addMessage,
    clearMessages,
    setTyping
  };
};

/**
 * Hook لإدارة حالة التخطيط الجانبي
 * @returns {Object} حالة التخطيط والدوال المساعدة
 */
export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return {
    sidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar
  };
};

/**
 * Hook لإدارة حالة البحث
 * @returns {Object} حالة البحث والدوال المساعدة
 */
export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const performSearch = async (query, searchFunction) => {
    try {
      setSearchLoading(true);
      const results = await searchFunction(query);
      setSearchResults(results);
    } catch (error) {
      console.error('خطأ في البحث:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    performSearch,
    clearSearch
  };
};

/**
 * Hook لإدارة حالة التحميل
 * @returns {Object} حالة التحميل والدوال المساعدة
 */
export const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const startLoading = (message = 'جاري التحميل...') => {
    setLoading(true);
    setLoadingMessage(message);
  };

  const stopLoading = () => {
    setLoading(false);
    setLoadingMessage('');
  };

  return {
    loading,
    loadingMessage,
    startLoading,
    stopLoading
  };
};

/**
 * Hook لإدارة الأخطاء
 * @returns {Object} حالة الخطأ والدوال المساعدة
 */
export const useError = () => {
  const [error, setError] = useState(null);

  const setErrorMessage = (message) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    setErrorMessage,
    clearError
  };
};

/**
 * Hook لإدارة التفضيلات المحلية
 * @param {string} key مفتاح التفضيل
 * @param {any} defaultValue القيمة الافتراضية
 * @returns {Array} القيمة ودالة التحديث
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('خطأ في قراءة التخزين المحلي:', error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('خطأ في حفظ التخزين المحلي:', error);
    }
  };

  return [value, setStoredValue];
};

/**
 * Hook لإدارة النموذج
 * @param {Object} initialValues القيم الأولية
 * @returns {Object} قيم النموذج والدوال المساعدة
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // إزالة خطأ الحقل عند التغيير
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const setFieldError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    setFieldError,
    clearErrors,
    resetForm
  };
};
