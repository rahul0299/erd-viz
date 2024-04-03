import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "./Panel.css";

function Panel() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const onClickHandler = () => {
    setIsCollapsed((c) => !c);
  };

  return (
    <div className="panel">
      <div
        className={
          "component-list " + (isCollapsed ? "component-list-collapsed" : "")
        }
      >
        {n.map((i) => (
          <div
            key={i}
            style={{
              display: "block",
              height: "200px",
              backgroundColor: "#669bbc",
              margin:"25px auto"
            }}
          ></div>
        ))}
      </div>
      <button className="panel-toggle" onClick={onClickHandler}>
        <span
          className={
            "panel-toggle-icon " +
            (isCollapsed ? "panel-toggle-icon-collapsed" : "")
          }
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </span>
      </button>
    </div>
  );
}

export default Panel;
