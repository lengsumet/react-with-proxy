import axios from 'axios';

const luffyHost = import.meta.env.VITE_LUFFY_HOST_API;
const goldenHost = import.meta.env.VITE_GOLDEN_HOST_API;

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const { url } = config;
  if (url.startsWith('/turbo')) {
    config.baseURL = luffyHost;
  } else if (url.startsWith('/user')) {
    config.baseURL = goldenHost;
  }
  return config;
});

export const getConsentDetail = (shortCode) => {
  return apiClient.get(`/turbo/consent-detail/${shortCode}`);
};

export const updateConsentDetail = (payload) => {
  return apiClient.patch('/turbo/consent-detail/update', payload);
};

export const getUserDetail = () => {
  return apiClient.get('/user/detail');
};

export default apiClient;
