import React from "react";

const GameControls = ({ onRestart }) => {
  return (
    <div>
      <button onClick={onRestart}>Restart</button>
    </div>
  );
};

export default GameControls;
