import * as go from 'gojs';
import { ReactPalette } from "gojs-react";

import './Palette.css';

function initPalette() {
    const $= go.GraphObject.make;
    // set your license key here before creating the Palette: go.Palette.licenseKey = "...";
    const palette =
        $(go.Palette,
            {
                'undoManager.isEnabled': true,
                model: new go.GraphLinksModel(
                    {
                        linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                    }),
            });

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
                font: "14px sans-serif",
                angle: -90,
                margin: new go.Margin(5,0,0 ,0),
                alignment: new go.Spot(0.5, 1, 0, 5),
                alignmentFocus: go.Spot.Top,
            }, new go.Binding('text').makeTwoWay())
        );

    palette.nodeTemplateMap = new go.Map();
    palette.nodeTemplateMap.add("entity", entityNode);
    palette.nodeTemplateMap.add("relation", relationNode);
    palette.nodeTemplateMap.add("attribute", attributeNode);

    return palette;
}

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is discussed below.
 */
function handleModelChange(changes) {
    // alert('GoJS model changed!');
}

const Palette = () => {
    return <ReactPalette
        initPalette={initPalette}
        divClassName='palette-component'
        nodeDataArray={[
            { key: 0, text: 'Entity', color: 'white', loc: '0 0', category: "entity" },
            { key: 1, text: 'Relation', color: 'white', loc: '200 0', category: "relation" },
            { key: 2, text: 'Attribute', color: 'lightgreen', fill: "transparent", loc: '25 100', category: "attribute" },
            { key: 3, text: 'Primary Key', color: 'lightgreen',  loc: '75 100', category: "attribute" },
            // { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
        ]}
    />
}

export default Palette;