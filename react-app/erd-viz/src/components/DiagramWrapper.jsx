import * as go from 'gojs';

import './DiagramWrapper.css';
import {useEffect, useRef, useState} from "react";
import Diagram from "./Diagram/Diagram.jsx";
import Editor from "./Editor/Editor.jsx";
import JSONPretty from "react-json-pretty";


// TODO: Communicate from diagram/model to inspector. On clicking an entity also find its connected attributes and pass.
// TODO: Communicate back from inspector. Properties modified should reflect in the graph.

const DiagramWrapper = () => {
    const getInitialState = () => {
        return {
            nodeDataArray: [],
            linkDataArray: [],
            modelData: {
                canRelink: true
            },
            selectedData: null,
            skipsDiagramUpdate: false,
            entities: [],
            relations: []
        }
    }

    const [state, setState] = useState(getInitialState());

    const mapNodeKeyIdx = useRef(new Map());
    const mapLinkKeyIdx = useRef(new Map());

    const refreshNodeIndex = (nodeArr) => {
        mapNodeKeyIdx.current.clear();
        nodeArr.forEach((node, i) => mapNodeKeyIdx.current.set(node.key, i))
    }

    const refreshLinkIndex = (linkArr) => {
        mapLinkKeyIdx.current.clear();
        linkArr.forEach((link, i) => mapLinkKeyIdx.current.set(link.key, i))
    }

    const handleDiagramEvent = (e) => {
        const name = e.name;
        switch(name) {
            case 'ChangedSelection': {
                const selected = e.subject.first();
                console.log("Selection Changed " + selected)
                setState(prevState => {
                    const newState = {...prevState}
                    if (selected) {
                        if (selected instanceof go.Node) {
                            const idx = mapNodeKeyIdx.current.get(selected.key);
                            if (idx !== undefined && idx >= 0) {
                                newState.selectedData = prevState.nodeDataArray[idx];
                            }
                            console.log(idx)
                        }  else if (selected instanceof go.Link) {
                            const idx = mapLinkKeyIdx.current.get(selected.key);
                            if (idx !== undefined && idx >= 0) {
                                newState.selectedData = prevState.linkDataArray[idx];
                            }
                            console.log(idx)
                        }
                    } else {
                        newState.selectedData = null;
                    }

                    return newState;
                })

                break;
            }
        }
    }
    //
    const handleModelChange = (obj) => {
        const insertedNodeKeys = obj.insertedNodeKeys;
        const modifiedNodeData = obj.modifiedNodeData;
        const removedNodeKeys = obj.removedNodeKeys;
        const insertedLinkKeys = obj.insertedLinkKeys;
        const modifiedLinkData = obj.modifiedLinkData;
        const removedLinkKeys = obj.removedLinkKeys;
        const modifiedModelData = obj.modelData;

        const modifiedNodeMap = new Map();
        const modifiedLinkMap = new Map();

        setState(prevState => {
            const newState = {...prevState}
            let narr = newState.nodeDataArray;

            if (modifiedNodeData) {
                modifiedNodeData.forEach(nd => {
                    modifiedNodeMap.set(nd.key, nd);
                    const idx = mapNodeKeyIdx.current.get(nd.key);
                    if (idx !== undefined && idx >= 0) {
                        narr[idx] = nd;
                        if (newState.selectedData && newState.selectedData.key === nd.key) {
                            newState.selectedData = nd;
                        }
                    }
                });
            }

            if (insertedNodeKeys) {
                insertedNodeKeys.forEach(key => {
                    const nd = modifiedNodeMap.get(key);
                    const idx = mapNodeKeyIdx.current.get(key);
                    if (nd && idx === undefined) {  // nodes won't be added if they already exist
                        mapNodeKeyIdx.current.set(nd.key, narr.length);
                        narr.push(nd);

                        if (nd.category === "entity") {
                            newState.entities.push({
                                key: nd.key,
                                attributes: [],
                                index: narr.length - 1,
                                primaryKey: null
                            })
                        } else if (nd.category === "relation") {
                            newState.relations.push({
                                key: nd.key,
                                attributes: [],
                                index: narr.length - 1
                            })
                        }
                    }
                });
            }

            if (removedNodeKeys) {
                // TODO: On deleting an entity, delete all its nodes
                // TODO: On deleting a relation, delete all its attributes
                // TODO: On deleting an attribute, delete its link
                narr = narr.filter(nd => {
                    if (removedNodeKeys.includes(nd.key)) {
                        return false;
                    }
                    return true;
                });
                newState.nodeDataArray = narr;
                refreshNodeIndex(narr);
            }

            let larr = newState.linkDataArray;

            if (modifiedLinkData) {
                modifiedLinkData.forEach(ld => {
                    modifiedLinkMap.set(ld.key, ld);
                    const idx = mapLinkKeyIdx.current.get(ld.key);
                    if (idx !== undefined && idx >= 0) {
                        larr[idx] = ld;
                        if (newState.selectedData && newState.selectedData.key === ld.key) {
                            newState.selectedData = ld;
                        }
                    }
                });
            }

            if (insertedLinkKeys) {
                insertedLinkKeys.forEach(key => {
                    const ld = modifiedLinkMap.get(key);
                    const idx = mapLinkKeyIdx.current.get(key);
                    if (ld && idx === undefined) {  // links won't be added if they already exist
                        mapLinkKeyIdx.current.set(ld.key, larr.length);
                        larr.push(ld);
                    }
                });
            }

            if (removedLinkKeys) {
                larr = larr.filter(ld => {
                    return !removedLinkKeys.includes(ld.key);

                });
                newState.linkDataArray = larr;
                refreshLinkIndex(larr);
            }

            if (modifiedModelData) {
                newState.modelData = modifiedModelData;
            }

            // newState.skipsDiagramUpdate = true;
            return newState;
        })
    }

    useEffect(() => {
        // Simulate a delay in initialization (replace this with your actual initialization logic)
        const delay = setTimeout(() => {
            // Set the state to indicate that initialization is complete
            setState(getInitialState());
        }, 2000); // Adjust the delay as needed

        // Cleanup function to clear the timeout in case component unmounts before initialization completes
        return () => clearTimeout(delay);
    }, []);

    const getEntityByKey = key => {
        for (let i=0;i<state.entities.length;i++) {
            if (state.entities[i].key === key) {
                return [state.entities[i], i];
            }
        }

        return [null, null];
    }
    const handleAddAttribute = (parentKey, parentType, attribute) => {
        if (parentType === "entity") {
            const [entity, idx] = getEntityByKey(parentKey);

            console.log(entity, idx);

            const newNode = {
                key: attribute.key,
                category: "attribute",
                loc: entity.loc,
                color: "transparent",
                isPrimary: false
            }

            const newLink = {
                from: entity.key,
                to: newNode.key
            }

            const nodeDataArray = [...state.nodeDataArray, newNode]
            const linkDataArray = [...state.linkDataArray, newLink]

            refreshNodeIndex(nodeDataArray)
            refreshLinkIndex(linkDataArray)

            setState(prevState => {
                const nextState = {...prevState, nodeDataArray, linkDataArray}
                nextState.entities[idx].attributes.push(attribute);
                nextState.skipsDiagramUpdate = false;
                return nextState;
            });
        }
    }

    const handleDeleteAttribute = (parentKey, parentType, attribute) => {
        if (parentType === "entity") {
            const [entity, idx] = getEntityByKey(parentKey);

            const nodeIndex = mapNodeKeyIdx.current.get(attribute.key);

            let i;
            for(i=0;i<entity.attributes.length;i++) {
                if (entity.attributes[i].key === attribute.key) {
                    break;
                }
            }

            setState(prevState => {
                const nextState = {...prevState}
                nextState.nodeDataArray.splice(nodeIndex, 1);
                nextState.entities[idx].attributes.splice(i, 1);

                nextState.linkDataArray = nextState.linkDataArray.filter(link => link.from !== attribute.key && link.to !== attribute.key);
                refreshNodeIndex(nextState.nodeDataArray);
                refreshLinkIndex(nextState.linkDataArray);

                return nextState;
            })


        }
    }

    // onRemovingNode
    // 1. Find the node in nodeDataArray
    // 2. Find the link connecting the node and entity
    // 3. Delete the node
    // 4. Delete the link
    // 5. Update maps

    return <>
    {state ?
            <Diagram
                nodeDataArray={state.nodeDataArray}
                linkDataArray={state.linkDataArray}
                modelData={state.modelData}
                skipsDiagramUpdate={state.skipsDiagramUpdate}
                onDiagramEvent={handleDiagramEvent}
                onModelChange={handleModelChange}
            /> : null}

        <div style={{
            width: "420px",
            height: "200px",
            overflow: "scroll",
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            boxSizing: "border-box",
            border: "1px solid grey",
            borderRadius: "5px",
            padding: "5px"
        }}>
            <JSONPretty data={state || null} />
        </div>
        { state.selectedData ?
            <div style={{
                width: "fit-content",
                height: "500px",
                overflow: "scroll",
                position: "absolute",
                top: "220px",
                right: 10,
                zIndex: 2
            }}>
                <Editor
                    style={{ display: state.selectedData ? "visible" : "none" }}
                    data={state.selectedData}
                    handleAddAttribute={handleAddAttribute}
                    handleDeleteAttribute={handleDeleteAttribute}
                />
            </div>
            : null }
    </>
}

export default DiagramWrapper;