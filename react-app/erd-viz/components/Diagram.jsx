import { ReactDiagram } from "gojs-react";

import "./Diagram.css";

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is discussed below.
 */
function handleModelChange(changes) {
  // alert('GoJS model changed!');
}

function Diagram({ initDiagram, nodeDataArray, linkDataArray, name }) {
  return (
    <>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="diagram-component"
        nodeDataArray={nodeDataArray}
        linkDataArray={linkDataArray}
        onModelChange={handleModelChange}
      />
    </>
  );
}

export default Diagram;
