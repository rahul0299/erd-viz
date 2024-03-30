import * as go from 'gojs';

import './DiagramWrapper.css';
import { useRef, useState} from "react";
import Diagram from "./Diagram/Diagram.jsx";
import Editor from "./Editor/Editor.jsx";
import JSONPretty from "react-json-pretty";


const DiagramWrapper = () => {
    const getInitialState = () => {
        return {
            nodeDataArray: [],
            linkDataArray: [],
            selectedData: null,
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

    const getRelationByKey = key => {
        for (let i=0;i<state.relations.length;i++) {
            if (state.relations[i].key === key) {
                return [state.relations[i], i];
            }
        }

        return [null, null];
    }

    const handleAddAttribute = (parentKey, parentType) => {
        if (parentType === "entity") {
            const [entity, idx] = getEntityByKey(parentKey);
            const i = mapNodeKeyIdx.current.get(parentKey);
            const entityNode = state.nodeDataArray[i];

            const newNode = {
                key: generateUUID(),
                category: "attribute",
                loc: getRandomLocation(entityNode.loc),
                fill: "transparent",
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
        } else if (parentType === "relation") {
            const [relation, idx] = getRelationByKey(parentKey);
            const i = mapNodeKeyIdx.current.get(parentKey);
            const relationNode = state.nodeDataArray[i];

            const newNode = {
                key: generateUUID(),
                category: "attribute",
                loc: getRandomLocation(relationNode.loc),
                fill: "transparent",
                isPrimary: false,
                isUnique: false,
                isNullable: true,
                type: "varchar",
                name: "attribute"
            }

            const newLink = {
                from: relation.key,
                to: newNode.key,
                key: generateUUID()
            }

            const nodeDataArray = [...state.nodeDataArray, newNode]
            const linkDataArray = [...state.linkDataArray, newLink]

            refreshNodeIndex(nodeDataArray)
            refreshLinkIndex(linkDataArray)

            setState(prevState => {
                const nextState = {...prevState, nodeDataArray, linkDataArray}
                nextState.relations[idx].attributes.push(newNode.key);
                nextState.skipsDiagramUpdate = false;
                return nextState;
            });
        }
    }

    const handleDeleteAttribute = (parentKey, parentType, deleteKey) => {
        if (parentType === "entity") {
            const [entity, idx] = getEntityByKey(parentKey);

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
        } else if (parentType === "relation") {
            const [entity, idx] = getRelationByKey(parentKey);

            const deleteIndex = mapNodeKeyIdx.current.get(deleteKey);

            setState(prevState => {
                const nextState = {...prevState}
                nextState.nodeDataArray.splice(deleteIndex, 1);
                nextState.relations[idx].attributes = nextState.relations[idx].attributes.filter(key => key !== deleteKey);

                nextState.linkDataArray = nextState.linkDataArray.filter(link => link.from !== deleteKey && link.to !== deleteKey);
                refreshNodeIndex(nextState.nodeDataArray);
                refreshLinkIndex(nextState.linkDataArray);

                return nextState;
            })
        }
    }

    const handlePropertyChange = (key, changes) => {
        const idx = mapNodeKeyIdx.current.get(key);

        setState(prevState => {
            const nextState = {...prevState};
            nextState.nodeDataArray = [...prevState.nodeDataArray];
            // nextState.nodeDataArray[idx][property] = value;
            nextState.nodeDataArray[idx] = {...nextState.nodeDataArray[idx], ...changes}

            if (nextState.selectedData && key === nextState.selectedData.key) {
                nextState.selectedData = {...nextState.nodeDataArray[idx] }
            }

            return nextState;
        });
    }

    const collateData = (selected) => {
        if (selected) {
            const data = {
                name: selected.name,
                key: selected.key,
                category: selected.category,
                attributes: [],
                primaryKey: selected.primaryKey
            }

            if (data.category === "entity") {
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
            } else if (data.category === "relation") {
                let i=0;
                for (;i<state.relations.length;i++) {
                    if (state.relations[i].key === selected.key) {
                        break;
                    }
                }

                if (i < state.relations.length) {
                    state.relations[i].attributes.forEach(attr => {
                        const attributeIdx = mapNodeKeyIdx.current.get(attr);
                        data.attributes.push({...state.nodeDataArray[attributeIdx]})
                    })
                }
            }

            return data;
        }
        return null;
    }

    const getRandomLocation = (location) => {
        const min = 150;
        const dist = 50;
        const x = -150 + (Math.random() * min) + dist;
        const y = (Math.random() * min) + dist;

        const point = go.Point.parse(location)
        return `${point.x + x} ${point.y + y}`;
    }

    return <>
    {state ?
            <Diagram
                nodeDataArray={state.nodeDataArray}
                linkDataArray={state.linkDataArray}
                modelData={state.modelData}
                skipsDiagramUpdate={false}
                onDiagramEvent={handleDiagramEvent}
                onModelChange={handleModelChange}
            /> : null}

        <div className={`json-viewer ${state.selectedData !== null ? '' : 'json-viewer-expanded'}`}>
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
                    handlePropertyChange={handlePropertyChange}
                />
            </div>
            : null }
    </>
}

export default DiagramWrapper;