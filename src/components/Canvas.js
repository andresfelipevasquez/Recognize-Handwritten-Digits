import React, { useRef, useEffect, useState } from 'react';

const Canvas = () => {    

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;        
        canvas.width  = 600;
        canvas.height = 600; 
        canvas.style.width  = '300px';
        canvas.style.height = '300px';
            
        const context = canvas.getContext("2d")
        context.scale(2,2)
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 3
        contextRef.current = context;
      }, [])
    
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

    const saveCanvas = () => {
        let imageName = null;
        const canvasDataURL = document.getElementById('mycanvas').toDataURL();
        const a = document.createElement('a');
        a.href = canvasDataURL;
        a.download = imageName || 'drawing';
        a.click();
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
        </div>
      );
}

export default Canvas;