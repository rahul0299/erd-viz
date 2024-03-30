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

    const generateUUID = () => {
        const uuid = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return uuid.substring(0, 4);
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

                setState(prevState => {
                    const newState = {...prevState}
                    if (selected) {
                        if (selected instanceof go.Node) {
                            const idx = mapNodeKeyIdx.current.get(selected.key);
                            if (idx !== undefined && idx >= 0) {
                                newState.selectedData = prevState.nodeDataArray[idx];
                            }
                        }  else if (selected instanceof go.Link) {
                            const idx = mapLinkKeyIdx.current.get(selected.key);
                            if (idx !== undefined && idx >= 0) {
                                newState.selectedData = prevState.linkDataArray[idx];
                            }
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
                    // nd.key = generateUUID();
                    const idx = mapNodeKeyIdx.current.get(key);
                    if (nd && idx === undefined) {
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

    const getEntityByKey = key => {
        for (let i=0;i<state.entities.length;i++) {
            if (state.entities[i].key === key) {
                return [state.entities[i], i];
            }
        }

        return [null, null];
    }
    const handleAddAttribute = (parentKey, parentType) => {
        if (parentType === "entity") {
            const [entity, idx] = getEntityByKey(parentKey);

            const newNode = {
                key: generateUUID(),
                category: "attribute",
                loc: entity.loc,
                color: "transparent",
                isPrimary: false,
                isUnique: false,
                isNullable: true,
                type: "varchar",
                name: "attribute"
            }

            const newLink = {
                from: entity.key,
                to: newNode.key,
                key: generateUUID()
            }

            const nodeDataArray = [...state.nodeDataArray, newNode]
            const linkDataArray = [...state.linkDataArray, newLink]

            refreshNodeIndex(nodeDataArray)
            refreshLinkIndex(linkDataArray)

            setState(prevState => {
                const nextState = {...prevState, nodeDataArray, linkDataArray}
                nextState.entities[idx].attributes.push(newNode.key);
                nextState.skipsDiagramUpdate = false;
                return nextState;
            });
        }
    }

    const handleDeleteAttribute = (parentKey, parentType, deleteKey) => {
        if (parentType === "entity") {
            const [entity, idx] = getEntityByKey(parentKey);
            console.log(idx)

            const deleteIndex = mapNodeKeyIdx.current.get(deleteKey);

            setState(prevState => {
                const nextState = {...prevState}
                nextState.nodeDataArray.splice(deleteIndex, 1);
                nextState.entities[idx].attributes = nextState.entities[idx].attributes.filter(key => key !== deleteKey);

                nextState.linkDataArray = nextState.linkDataArray.filter(link => link.from !== deleteKey && link.to !== deleteKey);
                refreshNodeIndex(nextState.nodeDataArray);
                refreshLinkIndex(nextState.linkDataArray);

                return nextState;
            })
        }
    }

    const handleAttributeDataChange = (attributeKey, property, value) => {
        const idx = mapNodeKeyIdx.current.get(attributeKey);
        setState(prevState => {
            const nextState = {...prevState};
            nextState.nodeDataArray[idx][property] = value;
            return nextState;
        });
    }

    const handlePrimaryKeyChange = (entityKey, attributeKey) => {
        const [entity, idx] = getEntityByKey(entityKey);
        const nodeIdx = mapNodeKeyIdx.current.get(attributeKey);

        setState(prevState => {
            const nextState = {...prevState}
            nextState.entities[idx].primaryKey = attributeKey;
            nextState.nodeDataArray[nodeIdx].isPrimary = true;
            nextState.nodeDataArray[nodeIdx].isUnique = true;
            nextState.nodeDataArray[nodeIdx].isNullable = false;
            return nextState;
        })
    }

    const collateData = (selected) => {
        if (selected) {
            const data = {
                name: selected.text,
                key: selected.key,
                category: selected.category,
                attributes: [],
                primaryKey: selected.primaryKey
            }

            let i=0;
            for (;i<state.entities.length;i++) {
                if (state.entities[i].key === selected.key) {
                    break;
                }
            }

            if (i < state.entities.length) {
                state.entities[i].attributes.forEach(attr => {
                    const attributeIdx = mapNodeKeyIdx.current.get(attr);
                    data.attributes.push({...state.nodeDataArray[attributeIdx]})
                })
            }

            return data;
        }

        return null;
    }

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
        { state.selectedData !== null ?
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
                    data={collateData(state.selectedData)}
                    handleAddAttribute={handleAddAttribute}
                    handleDeleteAttribute={handleDeleteAttribute}
                    handlePrimaryKeyChange={handlePrimaryKeyChange}
                    handleAttributeDataChange={handleAttributeDataChange}
                />
            </div>
            : null }
    </>
}

export default DiagramWrapper;