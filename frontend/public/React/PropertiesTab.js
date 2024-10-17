import React, { useState, useEffect } from 'react';

const PropertiesTab = ({ selectedItem, onUpdate }) => {
  const [width, setWidth] = useState(selectedItem?.width || 50);
  const [height, setHeight] = useState(selectedItem?.height || 50);

  useEffect(() => {
    if (selectedItem) {
      setWidth(selectedItem.width);
      setHeight(selectedItem.height);
    }
  }, [selectedItem]);

  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10); // Parse the input as an integer
    setWidth(newWidth);
    onUpdate({ ...selectedItem, width: newWidth }); // Update the item with new width
  };

  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10); // Parse the input as an integer
    setHeight(newHeight);
    onUpdate({ ...selectedItem, height: newHeight }); // Update the item with new height
  };

  if (!selectedItem) {
    return <div style={{ padding: '10px' }}>Select an asset to view its properties</div>;
  }

  return (
    <div style={{ padding: '10px', border: '1px solid black', width: '200px' }}>
      <h4>Properties</h4>
      <div>
        <label>Width: </label>
        <input
          type="number"
          value={width}
          onChange={handleWidthChange}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <div>
        <label>Height: </label>
        <input
          type="number"
          value={height}
          onChange={handleHeightChange}
        />
      </div>
    </div>
  );
};

export default PropertiesTab;
