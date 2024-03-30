import React, { useState, useEffect } from "react";
import * as go from "gojs";
import Diagram from "./Diagram";
import { ReactPalette } from "gojs-react";

function DiagramWrapper() {
  const [initDiagram, setInitDiagram] = useState(null);
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [linkDataArray, setLinkDataArray] = useState([]);

  useEffect(() => {
    fetchDiagramData();
  }, []);

  const fetchDiagramData = () => {
    fetchNodeData();
    fetchLinkData();
    fetchInitDiagram();
  };
  // Your initDiagram function logic here
  const $ = go.GraphObject.make;
  const diagram = $(
    go.Diagram,
    {
      "undoManager.isEnabled": true,
      model: new go.GraphLinksModel({
        linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      }),
    },
    {
      grid: $(
        go.Panel,
        "Grid",
        $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineH", {
          stroke: "gray",
          strokeWidth: 0.5,
          interval: 10,
        }),
        $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineV", {
          stroke: "gray",
          strokeWidth: 0.5,
          interval: 10,
        })
      ),
      "draggingTool.dragsLink": true,
      "draggingTool.isGridSnapEnabled": true,
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.portGravity": 20,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 20,
      "relinkingTool.fromHandleArchetype": $(go.Shape, "Diamond", {
        segmentIndex: 0,
        cursor: "pointer",
        desiredSize: new go.Size(8, 8),
        fill: "tomato",
        stroke: "darkred",
      }),
      "relinkingTool.toHandleArchetype": $(go.Shape, "Diamond", {
        segmentIndex: -1,
        cursor: "pointer",
        desiredSize: new go.Size(8, 8),
        fill: "darkred",
        stroke: "tomato",
      }),
      "linkReshapingTool.handleArchetype": $(go.Shape, "Diamond", {
        desiredSize: new go.Size(7, 7),
        fill: "lightblue",
        stroke: "deepskyblue",
      }),
      "rotatingTool.handleAngle": 270,
      "rotatingTool.handleDistance": 30,
      "rotatingTool.snapAngleMultiple": 15,
      "rotatingTool.snapAngleEpsilon": 15,
      "undoManager.isEnabled": true,
    }
  );

  var nodeSelectionAdornmentTemplate = $(
    go.Adornment,
    "Auto",
    $(go.Shape, {
      fill: null,
      stroke: "deepskyblue",
      strokeWidth: 1.5,
      strokeDashArray: [4, 2],
    }),
    $(go.Placeholder)
  );

  var nodeResizeAdornmentTemplate = $(
    go.Adornment,
    "Spot",
    { locationSpot: go.Spot.Right },
    $(go.Placeholder),
    $(go.Shape, {
      alignment: go.Spot.TopLeft,
      cursor: "nw-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
    $(go.Shape, {
      alignment: go.Spot.Top,
      cursor: "n-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
    $(go.Shape, {
      alignment: go.Spot.TopLeft,
      cursor: "n-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
    $(go.Shape, {
      alignment: go.Spot.TopRight,
      cursor: "ne-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),

    $(go.Shape, {
      alignment: go.Spot.Left,
      cursor: "w-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
    $(go.Shape, {
      alignment: go.Spot.Right,
      cursor: "e-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),

    $(go.Shape, {
      alignment: go.Spot.BottomLeft,
      cursor: "se-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
    $(go.Shape, {
      alignment: go.Spot.Bottom,
      cursor: "s-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
    $(go.Shape, {
      alignment: go.Spot.BottomRight,
      cursor: "sw-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue",
    })
  );

  var nodeRotateAdornmentTemplate = $(
    go.Adornment,
    { locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE" },
    $(go.Shape, "Ellipse", {
      name: "ELLIPSE",
      cursor: "pointer",
      desiredSize: new go.Size(7, 7),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
    $(go.Shape, {
      geometryString: "M3.5 7 L3.5 30",
      isGeometryPositioned: true,
      stroke: "deepskyblue",
      strokeWidth: 1.5,
      strokeDashArray: [4, 2],
    })
  );

  const fetchInitDiagram = () => {
    const initDiagramFunction = () => {
      // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";

      // define a simple Node template
      const entityNode = $(
        go.Node,
        "Spot", // the Shape will go around the TextBlock
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        {
          selectable: true,
          selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        },
        {
          resizable: true,
          resizeObjectName: "PANEL",
          resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
        },
        {
          rotatable: true,
          rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        },
        new go.Binding("angle").makeTwoWay(),
        $(
          go.Shape,
          "Rectangle",
          {
            name: "SHAPE",
            fill: "white",
            strokeWidth: 3,
            stroke: "green",
            margin: 0,
            height: 60,
            width: 120, // show a different cursor to indicate potential link point
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")
        ),
        $(
          go.TextBlock,
          { margin: 8, editable: true }, // some room around the text
          new go.Binding("text").makeTwoWay()
        ),
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      );

      const relationNode = $(
        go.Node,
        "Spot", // the Shape will go around the TextBlock
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        {
          selectable: true,
          selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        },
        {
          resizable: true,
          resizeObjectName: "PANEL",
          resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
        },
        {
          rotatable: true,
          rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        },
        $(
          go.Shape,
          "Diamond",
          {
            name: "SHAPE",
            fill: "white",
            strokeWidth: 3,
            stroke: "red",
            margin: 0,
            height: 100,
            width: 100,
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")
        ),
        $(
          go.TextBlock,
          { margin: 8, editable: true, font: "normal 10pt sans-serif" }, // some room around the text
          new go.Binding("text").makeTwoWay()
        ),
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      );

      const attributeNode = $(
        go.Node,
        "Spot",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        {
          selectable: true,
          selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        },
        {
          resizable: true,
          resizeObjectName: "PANEL",
          resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
        },
        {
          rotatable: true,
          rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        },
        $(
          go.Shape,
          "Circle",
          {
            width: 25,
            height: 25,
            fill: "lightblue",
            stroke: "black",
            strokeWidth: 2,
            isPanelMain: true,
          },
          new go.Binding("fill")
        ),
        $(
          go.TextBlock,
          "Text Below",
          {
            font: "14px sans-serif",
            angle: -90,
            margin: new go.Margin(5, 0, 0, 0),
            alignment: new go.Spot(0.5, 1, 0, 5),
            alignmentFocus: go.Spot.Top,
          },
          new go.Binding("text").makeTwoWay()
        ),
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      );

      diagram.linkTemplate = $(
        go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          mouseEnter(e, link) {
            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
          },
          mouseLeave(e, link) {
            link.findObject("HIGHLIGHT").stroke = "transparent";
          },
          selectionAdorned: false,
        },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape, {
          isPanelMain: true,
          strokeWidth: 8,
          stroke: "transparent",
          name: "HIGHLIGHT",
        }),
        $(
          go.Shape,
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
          new go.Binding("stroke", "isSelected", (sel) =>
            sel ? "dodgerblue" : "gray"
          ).ofObject()
        ),
        $(go.Shape, { toArrow: "", strokeWidth: 0, fill: "gray" }),
        $(
          go.Panel,
          "Auto",
          {
            visible: false,
            name: "LABEL",
            segmentIndex: 2,
            segmentFraction: 0.5,
          },
          new go.Binding("visible", "visible").makeTwoWay(),
          $(go.Shape, "RoundedRectangle", { fill: "#F8F8F8", strokeWidth: 0 }),
          $(
            go.TextBlock,
            "Yes",
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );
      diagram.nodeTemplateMap = new go.Map();
      diagram.nodeTemplateMap.add("entity", entityNode);
      diagram.nodeTemplateMap.add("relation", relationNode);
      diagram.nodeTemplateMap.add("attribute", attributeNode);

      return diagram;
    };

    setInitDiagram(() => initDiagramFunction);
  };

  function makePort(name, spot, output, input) {
    // the port is basically just a small transparent circle
    return $(go.Shape, "Circle", {
      fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
      stroke: null,
      desiredSize: new go.Size(7, 7),
      alignment: spot, // align the port on the main Shape
      alignmentFocus: spot, // just inside the Shape
      portId: name, // declare this object to be a "port"
      fromSpot: spot,
      toSpot: spot, // declare where links may connect at this port
      fromLinkable: output,
      toLinkable: input, // declare whether the user may draw links to/from here
      cursor: "pointer", // show a different cursor to indicate potential link point
    });
  }

  const fetchNodeData = () => {
    // Fetch node data from your API or other source
    const nodes = [
      {
        key: 0,
        text: "Entity",
        color: "white",
        loc: "0 0",
        category: "entity",
      },
      {
        key: 1,
        text: "Relation",
        color: "white",
        loc: "200 0",
        category: "relation",
      },
      {
        key: 2,
        text: "Attribute",
        color: "lightgreen",
        fill: "transparent",
        loc: "25 100",
        category: "attribute",
      },
      {
        key: 3,
        text: "Primary Key",
        color: "lightgreen",
        loc: "75 100",
        category: "attribute",
      },
    ];
    setNodeDataArray(nodes);
  };

  const fetchLinkData = () => {
    const links = [{ key: -1, from: 0, to: 1 }];
    setLinkDataArray(links);
  };

  const initPalette = () => {
    const animateFadeDown = (e) => {
      const animation = new go.Animation();
      animation.isViewportUnconstrained = true;
      animation.easing = go.Animation.EaseOutExpo;
      animation.duration = 900;
      animation.add(
        e.diagram,
        "position",
        e.diagram.position.copy().offset(0, 200),
        e.diagram.position
      );
      animation.add(e.diagram, "opacity", 0, 1);
      animation.start();
    };

    const myPalette = $(go.Palette, {
      "animationManager.initialAnimationStyle": go.AnimationManager.None,
      InitialAnimationStarting: animateFadeDown,
      nodeTemplateMap: diagram.nodeTemplateMap,
    });

    myPalette.nodeTemplate = $(
      go.Node,
      "Vertical",
      $(go.Shape, { fill: "red" }, new go.Binding("fill", "color")),
      $(go.TextBlock, { stroke: "black" }, new go.Binding("text").makeTwoWay())
    );

    return myPalette;
  };

  return (
    <>
      <div>
        <ReactPalette
          initPalette={initPalette}
          divClassName="palette-component"
          nodeDataArray={[
            { category: "Start", text: "Start" },
            { text: "Step" },
            { category: "Conditional", text: "???" },
            { category: "End", text: "End" },
            { category: "Comment", text: "Comment" },
          ]}
        />
      </div>

      {initDiagram && (
        <Diagram
          initDiagram={initDiagram}
          nodeDataArray={nodeDataArray}
          linkDataArray={linkDataArray}
        />
      )}
    </>
  );
}

export default DiagramWrapper;
