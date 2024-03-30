import * as go from "gojs";
import {ReactDiagram} from "gojs-react";

const Diagram = (props) => {
    const initDiagram = () => {
        const $= go.GraphObject.make;
        // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
        const diagram =
            $(go.Diagram,
                {
                    'undoManager.isEnabled': true,
                    allowDrop: true,
                    model: new go.GraphLinksModel(
                        {
                            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                        }),
                });

        diagram.grid =
            $(go.Panel, "Grid",
                $(go.Shape, "LineH", { strokeWidth: 0.5, strokeDashArray: [0, 9.5, 0.5, 0] })
            );


        // define a simple Node template
        const entityNode =
            $(go.Node, 'Auto',  // the Shape will go around the TextBlock
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, 'Rectangle',
                    { name: 'SHAPE', fill: 'white', strokeWidth: 3, stroke: 'green', margin: 0, height: 60, width: 120 },
                    // Shape.fill is bound to Node.data.color
                    new go.Binding('fill', 'color')),
                $(go.TextBlock,
                    { margin: 8, editable: true },  // some room around the text
                    new go.Binding('text').makeTwoWay()
                )
            );

        const relationNode =
            $(go.Node, 'Auto',  // the Shape will go around the TextBlock
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, 'Diamond',
                    { name: 'SHAPE', fill: 'white', strokeWidth: 3, stroke: 'red', margin: 0, height: 100, width: 100 },
                    // Shape.fill is bound to Node.data.color
                    new go.Binding('fill', 'color')),
                $(go.TextBlock,
                    { margin: 8, editable: true, font: "normal 10pt sans-serif" },  // some room around the text
                    new go.Binding('text').makeTwoWay()
                )
            );

        const attributeNode =
            $(go.Node, "Spot", new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Circle", {
                    width: 25,
                    height: 25,
                    fill: "lightblue",
                    stroke: "black",
                    strokeWidth: 2,
                    isPanelMain: true
                }, new go.Binding('fill')),
                $(go.TextBlock, "Text Below", {
                    font: "10px sans-serif",
                    margin: new go.Margin(5,0,0 ,0),
                    alignment: new go.Spot(0.5, 1, 0, 5),
                    alignmentFocus: go.Spot.Top,
                }, new go.Binding('text').makeTwoWay())
            );

        diagram.nodeTemplateMap = new go.Map();
        diagram.nodeTemplateMap.add("entity", entityNode);
        diagram.nodeTemplateMap.add("relation", relationNode);
        diagram.nodeTemplateMap.add("attribute", attributeNode);

        diagram.linkTemplate = $(go.Link, $(go.Shape, { strokeWidth: 2}));

        diagram.addDiagramListener('ChangedSelection', props.onDiagramEvent);

        return diagram;
    }

    return <ReactDiagram
        initDiagram={initDiagram}
        divClassName="diagram-component"
        nodeDataArray={props.nodeDataArray}
        linkDataArray={props.linkDataArray}
        // modelData={props.modelData}
        onModelChange={props.onModelChange}
        skipsDiagramUpdate={props.skipsDiagramUpdate}
        />
}

export default Diagram;