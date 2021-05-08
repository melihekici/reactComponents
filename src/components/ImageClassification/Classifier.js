import React, { useState, useEffect, useRef} from "react";
import * as tf from '@tensorflow/tfjs';
import labels from "./labels"

import styles from "./Classifier.module.css";

function Classifier(props) {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [classificationResult, setClassificationResult] = useState("");

  const imageRef = useRef();

  async function loadModel() {
    setIsModelLoading(true);
    try {
      const model = await tf.loadLayersModel('model.json');
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    const {files} = e.target;
    if(files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    }else {
      setImageURL(null);
    };
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
      if(imageURL){
        setClassificationResult("Classifying...")
      };
    setTimeout(() => {
        if(imageURL) {
            identify();
        };
    }, 200);
  }, [imageURL]);

  if (isModelLoading) {
    return <h2>Model Loading...</h2>
  };

  const identify = async () => {
    let tensor = tf.browser.fromPixels(imageRef.current)
      .resizeNearestNeighbor([props.height ? props.height : 224, props.width ? props.width : 224])
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims();
    const pred = await model.predict(tensor).data();
    const predIndex = pred.reduce((m, c, i, arr) => c > arr[m] ? i : m, 0);
    setClassificationResult(labels[predIndex]);
  };
  
  return (
    <React.Fragment>
    <div className={styles['image-div']}><img ref={imageRef} alt="Classification" className={styles.myImg} id="myImg" src={imageURL}/></div>
    <div className={styles['input-div']}>
        <input onChange={uploadImage} type='file' />
    </div>
    <div className={styles['classification-div']}>Classification Result: {classificationResult}</div>
    </React.Fragment>

  );
}

export default Classifier;
