import React from "react";

const ColorSelection = ({ onSelectColor }) => {
  return (
    <div>
      <h1>Choose Your Color</h1>
      <select onChange={(e) => onSelectColor(e.target.value)}>
        <option value="">Select a Color</option>
        <option value="w">White</option>
        <option value="b">Black</option>
      </select>
    </div>
  );
};

export default ColorSelection;
