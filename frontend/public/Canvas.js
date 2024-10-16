import React from 'react';
import { useDrop } from 'react-dnd';

const Canvas = ({ items, onAddItem, onSelect }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'toolboxItem',
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        const canvasRect = document.getElementById('canvas').getBoundingClientRect();
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        const newItem = {
          ...item,
          x,
          y,
          id: Math.random().toString(36).substr(2, 9), // Unique id for each item
        };
        onAddItem(newItem); // Add the new item to the list of items
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleClick = (item) => {
    onSelect(item); // Send the selected item to the parent component
  };

  return (
    <div
      id="canvas"
      ref={drop}
      style={{
        width: '600px',
        height: '600px',
        margin: '20px auto',
        border: '2px solid black',
        position: 'relative',
        overflow: 'hidden', // Ensure nothing overflows outside the canvas
        backgroundColor: isOver ? 'lightblue' : 'white',
      }}
    >
      <h3 style={{ textAlign: 'center' }}>Canvas</h3>
      {items.map((item, index) => (
        <img
          key={item.id} // Use unique id as the key
          src={item.imageUrl}
          alt={item.name}
          style={{
            position: 'absolute',
            left: `${item.x}px`,
            top: `${item.y}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
            cursor: 'pointer',
          }}
          onClick={() => handleClick(item)} // Handle asset click
          onError={(e) => (e.target.src = 'fallback-image.png')} // Fallback image on error
        />
      ))}
    </div>
  );
};

export default Canvas;
