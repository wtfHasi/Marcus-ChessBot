import React from "react";

const ColorSelection = ({ handleColorSelection }) => (
  <div className="text-center">
    <h1 className="heading">Choose Your Color</h1>
    <select className="select" onChange={(e) => handleColorSelection(e.target.value)}>
      <option value="">Select a Color</option>
      <option value="w">White</option>
      <option value="b">Black</option>
    </select>
  </div>
);

export default ColorSelection;
