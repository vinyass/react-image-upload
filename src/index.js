import React from "react";
import ReactDOM from "react-dom";

import ImageUpload from "./ImageUpload";

const handleImages = (files) => {
  // Handle files.
  console.log(files);
};

ReactDOM.render(
  <ImageUpload onUpload={(files) => handleImages(files)} />,
  document.getElementById("root")
);
