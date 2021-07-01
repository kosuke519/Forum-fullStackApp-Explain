import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div>
      <h1>ページが見つかりません</h1>
      <h3>
        <Link to="/">ホームページはこちら</Link>{" "}
      </h3>
    </div>
  );
}

export default PageNotFound;
