import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import CustomModel from "../../models/CustomModel.jsx";
import MultiNodePathLink, {invalidateLinkRoutes} from "../../models/MultiNodePathLink.jsx";

const Diagram = (props) => {
  const initDiagram = () => {
    const $ = go.GraphObject.make;

    const makePort = (name, spot, output, input) => {
      return $(go.Shape, "Circle", {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: go.Spot.Center, // declare where links may connect at this port
        fromLinkable: output,
        toLinkable: input, // declare whether the user may draw links to/from here
        cursor: "pointer", // show a different cursor to indicate potential link point
      });
    };

    function showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
      if (label !== null)
        label.visible = e.subject.fromNode.data.category === "entity";
    }

    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram = $(go.Diagram, {
      LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
      LinkRelinked: showLinkLabel,
      "undoManager.isEnabled": true,
      allowDrop: true,
      model: new CustomModel(),
      "Changed": invalidateLinkRoutes,
    });

    diagram.grid = $(
      go.Panel,
      "Grid",
      $(go.Shape, "LineH", {
        strokeWidth: 0.5,
        strokeDashArray: [0, 9.5, 0.5, 0],
      })
    );

    // define a simple Node template
    const entityNode = $(
      go.Node,
      "Auto", // the Shape will go around the TextBlock
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
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
          width: 120,
          portId: "", // This makes the whole node a single port
          fromSpot: go.Spot.Center, // Allow links to connect from any side of the node
          toSpot: go.Spot.AllSides, // Allow links to connect to any side of the node
          fromLinkable: true, // Allow outgoing links from this node
          toLinkable: false, // Allow incoming links to this node
          cursor: "pointer", // Change cursor to indicate link creation
        },
        // Shape.fill is bound to Node.data.color
        new go.Binding("fill", "color")
      ),
      $(
        go.TextBlock,
        { margin: 8, editable: true }, // some room around the text
        new go.Binding("text", "name").makeTwoWay()
      )
    );

    const relationNode = $(
      go.Node,
      "Auto", // the Shape will go around the TextBlock
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
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
        new go.Binding("text", "name").makeTwoWay()
      ),
      makePort("T", go.Spot.Top, false, true),
      makePort("L", go.Spot.Left, false, true),
      makePort("R", go.Spot.Right, false, true),
      makePort("B", go.Spot.Bottom, false, true)
    );

    const attributeNode = $(
      go.Node,
      "Spot",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Shape,
        "Circle",
        {
          width: 25,
          height: 25,
          fill: "transparent",
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
          font: "10px sans-serif",
          margin: new go.Margin(5, 0, 0, 0),
          alignment: new go.Spot(0.5, 1, 0, 5),
          alignmentFocus: go.Spot.Top,
        },
        new go.Binding("text", "name")
      )
    );

    const primaryKeyLabel = $(
        go.Node, {
          movable: false,
          layerName: "Foreground"
        },
        $(go.Shape,
            "Circle",
            {
                width: 25,
                height: 25,
                fill: "lightblue",
                stroke: "black",
                strokeWidth: 2,
            },
            new go.Binding("fill")
        )
    );

    const link = $(
      go.Link,
      { curve: go.Link.JumpOver },
      $(go.Shape, { strokeWidth: 2 }),
      $(
        go.Panel,
        "Auto", // the link label, normally not visible
        {
          visible: false,
          name: "LABEL",
          segmentIndex: 2,
          segmentFraction: 0.5,
        },
        new go.Binding("visible", "visible").makeTwoWay(),
        $(
          go.Shape,
          "RoundedRectangle", // the label shape
          { fill: "#F8F8F8", strokeWidth: 0 }
        ),
        $(
          go.TextBlock,
          "(X,Y)", // the label
          {
            textAlign: "center",
            font: "12pt helvetica, arial, sans-serif",
            stroke: "#333333",
            editable: true,
            textEdited: function (textBlock, previousText, currentText) {
              const linkData = textBlock.part.data;
              linkData.text = currentText;
              console.log(
                "Text changed from '" +
                  previousText +
                  "' to '" +
                  currentText +
                  "'"
              );
            },
            width: 60, // Adjust width as needed
            height: 20, // Adjust height as needed
          },
          new go.Binding("text").makeTwoWay()
        )
      )
    );

    const multiNodeLink = $(MultiNodePathLink,  // subclass of Link, defined below
          $(go.Shape, { strokeWidth: 2, },
              new go.Binding("stroke", "color")),
      );

    diagram.nodeTemplateMap = new go.Map();
    diagram.nodeTemplateMap.add("entity", entityNode);
    diagram.nodeTemplateMap.add("relation", relationNode);
    diagram.nodeTemplateMap.add("attribute", attributeNode);
    diagram.nodeTemplateMap.add("primaryKeyLabel", primaryKeyLabel);
    diagram.linkTemplate = link;
    diagram.linkTemplateMap.add("multiNodeLink", multiNodeLink);
    diagram.skipsDiagramUpdate = false;
    diagram.addDiagramListener("ChangedSelection", props.onDiagramEvent);
    diagram.addModelChangedListener((e) => {
        if (e.change === go.ChangedEvent.Property && e.propertyName === "path") {
            const link = diagram.findLinkForData(e.object)

            if (link instanceof MultiNodePathLink) {
                link.invalidateRoute();
            }
        }
    })

    return diagram;
  };

  return (
    <ReactDiagram
      initDiagram={initDiagram}
      divClassName="diagram-component"
      nodeDataArray={props.nodeDataArray}
      linkDataArray={props.linkDataArray}
      modelData={props.modelData}
      onModelChange={props.onModelChange}
      skipsDiagramUpdate={props.skipsDiagramUpdate}
    />
  );
};

export default Diagram;
