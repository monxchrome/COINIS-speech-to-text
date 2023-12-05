import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [result, setResult] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [upload, setUpload] = useState();

  const setStreamingResult = (newResult) => {
    setResult(newResult);
  };

  const setUploadResult = (newResult) => {
    setUpload(newResult);
  };

  const setRecordingStatus = (status) => {
    setIsRecording(status);
  };

  return (
    <AppContext.Provider
      value={{
        result,
        setStreamingResult,
        isRecording,
        setRecordingStatus,
        upload,
        setUpload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
