import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import ConsentForm from './components/ConsentForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { getConsentDetail, getUserDetail } from './api/axios';

const ConsentPage = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consentData, setConsentData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching data for shortCode: ${shortCode}`);

        const consentResult = await getConsentDetail(shortCode);
        setConsentData(consentResult.data);

        const userResult = await getUserDetail();
        setUserData(userResult.data);

      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shortCode]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return <ConsentForm initialConsents={consentData} user={userData} />;
};

const HomePage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4">Welcome to the Consent Management System</Typography>
    <Typography variant="body1">
      To view a consent form, please navigate to a URL like /o/some-code
    </Typography>
  </Box>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/o/:shortCode" element={<ConsentPage />} />
    </Routes>
  );
}

export default App;
