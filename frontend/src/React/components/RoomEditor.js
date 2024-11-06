import React, { useState } from 'react'
import { ChevronLeft, Plus, Image, Save, Link } from 'lucide-react'

export default function RoomEditor() {
  const [choices, setChoices] = useState([
    { id: 1, text: 'Go to Forest Clearing', linkedRoom: 'Forest Clearing' },
    { id: 2, text: 'Examine the old well', linkedRoom: 'Old Well' },
  ])

  const addChoice = () => {
    const newChoice = { id: choices.length + 1, text: '', linkedRoom: '' }
    setChoices([...choices, newChoice])
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Room Editor</h1>
      <div className="space-y-6">
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
          <input
            type="text"
            id="roomName"
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter room name"
          />
        </div>
        <div>
          <label htmlFor="roomDescription" className="block text-sm font-medium text-gray-700 mb-1">Room Description</label>
          <textarea
            id="roomDescription"
            rows={4}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter room description"
          ></textarea>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Choices</h2>
          <ul className="space-y-3">
            {choices.map(choice => (
              <li key={choice.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) => {
                    const updatedChoices = choices.map(c => 
                      c.id === choice.id ? { ...c, text: e.target.value } : c
                    )
                    setChoices(updatedChoices)
                  }}
                  className="flex-grow border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter choice text"
                />
                <select
                  value={choice.linkedRoom}
                  onChange={(e) => {
                    const updatedChoices = choices.map(c => 
                      c.id === choice.id ? { ...c, linkedRoom: e.target.value } : c
                    )
                    setChoices(updatedChoices)
                  }}
                  className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select linked room</option>
                  <option value="Forest Clearing">Forest Clearing</option>
                  <option value="Old Well">Old Well</option>
                </select>
              </li>
            ))}
          </ul>
          <button className="mt-2 flex items-center text-green-500" onClick={addChoice}>
            <Plus size={18} className="mr-1" /> Add Choice
          </button>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Media</h2>
          <button className="flex items-center text-blue-500 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Image size={18} className="mr-2" /> Attach Media
          </button>
        </div>
        <div className="flex justify-between">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ChevronLeft size={18} className="inline mr-2" /> Back to Project
          </button>
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Save size={18} className="inline mr-2" /> Save Room
          </button>
        </div>
      </div>
    </div>
  )
}