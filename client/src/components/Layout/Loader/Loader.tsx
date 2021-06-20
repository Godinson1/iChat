import React from "react";
import "./loader.scss";

const Loader = () => {
  return (
    <div className="loading">
      <div>
        <h1>iChat</h1>
      </div>
      <div className="lds-grid">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
