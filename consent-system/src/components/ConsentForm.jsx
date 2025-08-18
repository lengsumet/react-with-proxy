import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { updateConsentDetail } from '../api/axios';

const ConsentForm = ({ initialConsents, user }) => {
  const [consents, setConsents] = useState({
    question1: '',
    question2: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  useEffect(() => {
    if (initialConsents) {
      setConsents(initialConsents);
    }
  }, [initialConsents]);

  const handleConsentChange = (question, value) => {
    setConsents((prev) => ({ ...prev, [question]: value }));
  };

  const handleAcceptAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setConsents({
        question1: 'accept',
        question2: 'accept',
      });
    } else {
      // Unchecking "Accept All" can revert to initial state or just clear them.
      // Clearing is simpler.
      setConsents({
        question1: '',
        question2: '',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      console.log('Submitting consents:', consents);
      await updateConsentDetail(consents);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Failed to submit consent', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allAccepted = consents.question1 === 'accept' && consents.question2 === 'accept';

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Consent Form for {user?.name || 'User'}
      </Typography>

      {submitStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Consent submitted successfully!
        </Alert>
      )}
      {submitStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to submit consent. Please try again.
        </Alert>
      )}

      <Box component="form" noValidate autoComplete="off">
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Question 1: Do you agree to the terms and conditions?</FormLabel>
          <RadioGroup
            row
            name="question1"
            value={consents.question1}
            onChange={(e) => handleConsentChange('question1', e.target.value)}
          >
            <FormControlLabel value="accept" control={<Radio />} label="Accept" />
            <FormControlLabel value="not_accept" control={<Radio />} label="Not Accept" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Question 2: Do you agree to the privacy policy?</FormLabel>
          <RadioGroup
            row
            name="question2"
            value={consents.question2}
            onChange={(e) => handleConsentChange('question2', e.target.value)}
          >
            <FormControlLabel value="accept" control={<Radio />} label="Accept" />
            <FormControlLabel value="not_accept" control={<Radio />} label="Not Accept" />
          </RadioGroup>
        </FormControl>

        <FormControlLabel
          control={<Checkbox checked={allAccepted} onChange={handleAcceptAll} />}
          label="Accept All"
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!consents.question1 || !consents.question2}
        >
          Send Consent
        </Button>
      </Box>
    </Paper>
  );
};

export default ConsentForm;
