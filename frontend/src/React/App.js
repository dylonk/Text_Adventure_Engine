import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { saveAs } from 'file-saver'; // Import the file-saver package
import Toolbox from './Toolbox.js';
import Canvas from './Canvas.js';
import PropertiesTab from './PropertiesTab.js';


function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);

  const handleSelect = (item) => {
    setSelectedItem(item); // Set the clicked item as selected
  };

  const handleUpdate = (updatedItem) => {
    // Correctly update only the modified item in the array
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setSelectedItem(updatedItem); // Update the selected item with new properties
  };

  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]); // Add new item to the array
  };

  // Save the canvas state to a JSON file
  const handleSave = () => {
    const json = JSON.stringify(items);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'Projects/canvas_state.json'); // Save the file in the "Projects" folder
  };

  // Load the canvas state from a JSON file
  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const loadedItems = JSON.parse(e.target.result);
        setItems(loadedItems); // Update the items on the canvas with loaded data
      };
      reader.readAsText(file);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <Toolbox />
        <Canvas items={items} onAddItem={handleAddItem} onSelect={handleSelect} />
        <PropertiesTab selectedItem={selectedItem} onUpdate={handleUpdate} />
      </div>

      {/* Save/Load Buttons */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={handleSave}>Save Canvas</button>
        <input
          type="file"
          accept="application/json"
          onChange={handleLoad}
          style={{ marginLeft: '20px' }}
        />
      </div>
    </DndProvider>
  );
}

export default App;
