import React, { useState } from "react";

const ColorPicker = ({ onSelectColor }) => {
  const [selectedColor, setSelectedColor] = useState("red");
  const [recentColors, setRecentColors] = useState([]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onSelectColor(color);

    if (!recentColors.includes(color)) {
      const updatedRecentColors = [color, ...recentColors.slice(0, 4)];
      setRecentColors(updatedRecentColors);
    }
  };

  const handleCustomColorChange = (event) => {
    const color = event.target.value;
    setSelectedColor(color);
    onSelectColor(color);
  };

  const handleRecentColorSelect = (color) => {
    setSelectedColor(color);
    onSelectColor(color);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleColorSelect("black")}>Black</button>
        <button onClick={() => handleColorSelect("red")}>Red</button>
        <button onClick={() => handleColorSelect("blue")}>Blue</button>
      </div>
      <div>
        <label htmlFor="customColor">Custom Color:</label>
        <input
          type="color"
          id="customColor"
          value={selectedColor}
          onChange={handleCustomColorChange}
        />
      </div>
      <div>
        <p>Recent Colors:</p>
        {recentColors.map((color, index) => (
          <button key={index} onClick={() => handleRecentColorSelect(color)}>
            {color}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
