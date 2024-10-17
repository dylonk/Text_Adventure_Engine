import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import FileUploader from './FileUploader';

const ToolboxItem = ({ name, imageUrl, width, height }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'toolboxItem',
    item: { name, imageUrl, width, height },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: '8px',
        margin: '4px',
        backgroundColor: isDragging ? 'lightgreen' : 'lightgray',
        cursor: 'move',
        display: 'inline-block',
      }}
    >
      <img
        src={imageUrl}
        alt={name}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
};

const Toolbox = () => {
  const [items, setItems] = useState([]);

  // Load images from localStorage on component mount
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('uploadedItems')) || [];
    setItems(savedItems);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedItems', JSON.stringify(items));
  }, [items]);

  // Handle file upload and add to toolbox
  const handleUpload = (imageData) => {
    const newItem = {
      name: `Asset ${items.length + 1}`,
      imageUrl: imageData,
      width: 100, // Default width
      height: 100, // Default height
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <div style={{ border: '1px solid black', width: '200px', padding: '10px' }}>
      <h4>Toolbox</h4>
      <FileUploader onUpload={handleUpload} />
      {items.map((item, index) => (
        <ToolboxItem
          key={index}
          name={item.name}
          imageUrl={item.imageUrl}
          width={item.width}
          height={item.height}
        />
      ))}
    </div>
  );
};

export default Toolbox;
