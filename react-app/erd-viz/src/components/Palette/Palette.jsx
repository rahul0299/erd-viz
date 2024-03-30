import * as go from 'gojs';
import { ReactPalette } from "gojs-react";

import './Palette.css';

// TODO: Fix entity showing up behind copyright text. Move it down somehow

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
                contentAlignment: go.Spot.Center
            });

    // define a simple Node template
    const entityNode =
        $(go.Node, 'Auto', { margin: new go.Margin(10,0,0,0) },
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'Rectangle',
                { name: 'SHAPE', fill: 'white', strokeWidth: 3, stroke: 'green', height: 60, width: 120 },
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
                { name: 'SHAPE', fill: 'white', strokeWidth: 3, stroke: 'red', height: 100, width: 100 },
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color')),
            $(go.TextBlock,
                { margin: 8, editable: true, font: "normal 10pt sans-serif" },  // some room around the text
                new go.Binding('text').makeTwoWay()
            )
        );

    palette.nodeTemplateMap = new go.Map();
    palette.nodeTemplateMap.add("entity", entityNode);
    palette.nodeTemplateMap.add("relation", relationNode);
    // palette.nodeTemplateMap.add("attribute", attributeNode);

    palette.layout = $(go.GridLayout,{
        wrappingColumn: 1,
        cellSize: new go.Size(100, 10),
        spacing: new go.Size(20, 20),
    })

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
        ]}
    />
}

export default Palette;