import React, { useRef, useEffect, useState } from "react";
import Tools from "./Tools";
import axios from "axios";

import {
  StyledCanvas,
  StyledDiv,
  ToolsDiv,
  Div,
  StyledInput,
  GlobalStyle,
} from "./Styles";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState("white");
  const [lineWidth, setLineWidth] = useState(2);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
  }, []);

  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const updatedDrawingHistory = [...drawingHistory];
    updatedDrawingHistory.push(canvas.toDataURL());
    setDrawingHistory(updatedDrawingHistory);
    setRedoHistory([]);
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    setDrawingHistory([]);
    setRedoHistory([]);
  };

  const redoDrawing = () => {
    if (redoHistory.length > 0) {
      const restoredDrawing = redoHistory.pop();
      const updatedDrawingHistory = [...drawingHistory, restoredDrawing];
      setDrawingHistory(updatedDrawingHistory);
      const canvas = canvasRef.current;
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(image, 0, 0);
      };
      image.src = restoredDrawing;
      setRedoHistory(redoHistory);
    }
  };

  const erase = () => {
    setColor("black");
  };

  const undoDrawing = () => {
    if (drawingHistory.length > 0) {
      const undoneDrawing = drawingHistory.pop();
      const updatedRedoHistory = [...redoHistory, undoneDrawing];
      setRedoHistory(updatedRedoHistory);
      const canvas = canvasRef.current;
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(image, 0, 0);
      };
      image.src = drawingHistory[drawingHistory.length - 1];
      setDrawingHistory(drawingHistory);
    }
  };

  const saveImageToCloudinary = async () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();

    try {
      const response = await axios.post(
        "http://localhost:4000/cloudinary/upload",
        { file: imageData }, // Send image data as JSON object
        { headers: { "Content-Type": "application/json" } } // Set content type header
      );
      console.log("Upload successful:", response.data);
      alert("Image saved to Cloudinary successfully");
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      alert("Error saving image to Cloudinary");
    }

    // Convert Data URL to Blob
    // fetch(imageData)
    //   .then((res) => res.blob())
    //   .then((blob) => {
    //     // Create a File object from the Blob
    //      file = new File([blob], "image.png", { type: "image/png" });

    //     // Prepare FormData with the File and upload preset
    //     const formData = new FormData();
    //     formData.append("file", file);
    //     formData.append("upload_preset", "ml_default");

    //     console.log("FormData:", formData);
    //     const data = "test"

    //     // Make a POST request to Cloudinary's upload API
    //     fetch("http://localhost:4000/cloudinary/upload", {
    //       method: "POST",
    //       body: data,
    //     })
    //       .then((response) => response.json())
    //       .then((data) => {
    //         // Handle the response from Cloudinary
    //         console.log("Upload successful:", data);
    //         alert("Image saved to Cloudinary successfully");
    //       })
    //       .catch((error) => {
    //         console.error("Error uploading image to Cloudinary:", error);
    //         alert("Error saving image to Cloudinary");
    //       });
    //   })
    //   .catch((error) => {
    //     console.error("Error converting Data URL to Blob:", error);
    //     alert("Error converting image data");
    //   });
  };

  return (
    <>
      <GlobalStyle />
      <StyledDiv>
        <StyledCanvas
          ref={canvasRef}
          width={1000}
          height={700}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          title="Start drawing"
        />
        <ToolsDiv>
          <StyledInput
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <StyledInput
            type="range"
            min={1}
            max={20}
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
          />
          <Div>
            <Tools
              method_props={{
                saveImage_prop: saveImageToCloudinary,
                clearCanvas_prop: clearCanvas,
                erase_prop: erase,
                undo_props: undoDrawing,
                redo_props: redoDrawing,
              }}
            />
          </Div>
        </ToolsDiv>
      </StyledDiv>
    </>
  );
};

export default Canvas;
