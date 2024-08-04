'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, CircularProgress, Typography, IconButton } from '@mui/material';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ImageCapture = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState(null);
  const storage = getStorage();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const storageRef = ref(storage, `images/${Date.now()}.jpg`);
    await uploadString(storageRef, image, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);

    try {
      const { data } = await axios.post('/api/gcp-classify', { imageUrl: downloadURL });
      setClassification(data.classifications);
    } catch (error) {
      console.error('Error classifying image:', error);
    }

    await addDoc(collection(db, 'pantryItems'), {
      item: 'New Item',
      quantity: '1',
      imageUrl: downloadURL,
      classification: classification ? classification.map(c => c.label).join(', ') : 'Unclassified',
    });

    setImage(null);
    setLoading(false);
    setCameraActive(false);  // Disable camera after upload
  };

  return (
    <div>
      <IconButton color="primary" onClick={() => setCameraActive(!cameraActive)}>
        {cameraActive ? <CloseIcon /> : <CameraAltIcon />}
      </IconButton>
      {cameraActive && (
        <div>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <Button onClick={capture}>Capture</Button>
          {image && (
            <>
              <img src={image} alt="captured" />
              <Button onClick={handleUpload} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Upload'}
              </Button>
            </>
          )}
          {classification && (
            <Typography variant="body2">Classification: {classification.map(c => `${c.label} (${(c.score * 100).toFixed(2)}%)`).join(', ')}</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCapture;
