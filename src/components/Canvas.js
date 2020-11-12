import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';


const Canvas = () => {

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [model, setModel] = useState(null);

    async function loadModel() {
      const model = await tf.loadLayersModel(
        "https://raw.githubusercontent.com/andresfelipevasquez/Recognize-Handwritten-Digits/main/static/model.json"
      );
      setModel(model);
    }

    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 300;
      canvas.style.width = "150px";
      canvas.style.height = "150px";

      const context = canvas.getContext("2d");
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "red";
      canvas.style.backgroundColor = "white";
      context.lineWidth = 10;
      contextRef.current = context;

      loadModel();
    }, []);
    
    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
    }

    const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({nativeEvent}) => {
    if(!isDrawing){
        return
    }
    const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }

    async function saveCanvas()  {
        const canvasImage = canvasRef.current;
        let proces = preprocessCanvas(canvasImage);
    
        let pre = await model.predict(proces).data();
        console.log("Pre: ", pre);

    }

    function preprocessCanvas(image) {
      // resize the input image to target size of (1, 28, 28)
      let tensor = tf.browser
        .fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat();
      return tensor.div(255.0);
    }

    const clearCanvas = () => {
        const canvass = canvasRef.current;
        const ctx = canvass.getContext('2d');
        ctx.clearRect(0, 0, 150, 150);
        setIsDrawing(false)
    }        

    return (
        <div className="canvas-container">
            <canvas className='canvas-area' id='mycanvas'
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              ref={canvasRef}
            />
            <div>
                <button onClick={saveCanvas}>Predecir</button>
            </div>
            <div>
                <button onClick={clearCanvas}>Limpiar</button>
            </div>
        </div>
      );
}

export default Canvas;