import * as go from 'gojs';

import './DiagramWrapper.css';
import { useRef, useState} from "react";
import Diagram from "./Diagram/Diagram.jsx";
import Editor from "./Editor/Editor.jsx";
import JSONPretty from "react-json-pretty";
import {Fab} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";
import PreviewModal from "./PreviewModal/PreviewModal.jsx";


const DiagramWrapper = () => {
    const getInitialState = () => {
        return {
            nodeDataArray: [],
            linkDataArray: [],
            selectedData: null,
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

    const [modalOpen, setModalOpen] = useState(false);

    const closeModal = () => {
        setModalOpen(false);
    }

    const onCodeButtonClick = () => {
        setModalOpen(true);
    }

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
                    if (nd && idx === undefined) {
                        mapNodeKeyIdx.current.set(nd.key, narr.length);
                        narr.push(nd);
                    }
                });
            }

            if (removedNodeKeys) {
                console.log("remove " + removedNodeKeys)
                removedNodeKeys.forEach(rmKey => {
                    const rmIdx = mapNodeKeyIdx.current.get(rmKey);
                    const rmNode = newState.nodeDataArray[rmIdx];
                    if (rmNode !== undefined && (rmNode.category === "entity" || rmNode.category === "relation")) {
                        narr = narr.filter(nd => nd.key !== rmKey && !rmNode.attributes.includes(nd.key));
                    }
                })
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

            newState.skipsDiagramUpdate = true;
            return newState;
        })
    }

    const handleAddAttribute = (parentKey, parentType) => {
        if (parentType === 'entity' || parentType === 'relation') {
            const i = mapNodeKeyIdx.current.get(parentKey);
            const node = state.nodeDataArray[i];

            const newNode = {
                key: generateUUID(),
                category: "attribute",
                loc: getRandomLocation(node.loc),
                fill: "transparent",
                isPrimary: false,
                isUnique: false,
                isNullable: true,
                type: "varchar",
                name: "attribute"
            }

            const newLink = {
                from: node.key,
                to: newNode.key,
                key: generateUUID()
            }

            const nodeDataArray = [...state.nodeDataArray, newNode]
            const linkDataArray = [...state.linkDataArray, newLink]

            refreshNodeIndex(nodeDataArray)
            refreshLinkIndex(linkDataArray)

            setState(prevState => {
                const nextState = {...prevState, nodeDataArray, linkDataArray}
                nextState.nodeDataArray[i].attributes.push(newNode.key);
                nextState.skipsDiagramUpdate = false;
                return nextState;
            });
        }
    }

    const handleDeleteAttribute = (parentKey, parentType, deleteKey) => {
        if (parentType === "entity" || parentType === "relation") {
            const parentIdx = mapNodeKeyIdx.current.get(parentKey);
            const deleteIndex = mapNodeKeyIdx.current.get(deleteKey);

            setState(prevState => {
                const nextState = {...prevState}
                nextState.nodeDataArray[parentIdx].attributes = nextState.nodeDataArray[parentIdx].attributes.filter(key => key !== deleteKey);
                nextState.nodeDataArray.splice(deleteIndex, 1);

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

    const collateData = selected => {
        if (selected) {
            const data = {
                name: selected.name,
                key: selected.key,
                category: selected.category,
                attributes: selected.attributes,
                primaryKey: selected.primaryKey
            }

            if (data.category === "entity" || data.category === "relation") {

                data.attributes = data.attributes.map(key => {
                    const idx = mapNodeKeyIdx.current.get(key);
                    return { ...state.nodeDataArray[idx] }
                });
            }

            return data;
        }

        return null;
    }

    const getRandomLocation = (location) => {
        const min = 100;
        const dist = 50;
        const x = -150 + (Math.random() * dist) + min;
        const y = (Math.random() * dist) + min;

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
        <Fab
            sx={{ position: "absolute", bottom: 40, right: 40}}
            color="success"
            onClick={() => setModalOpen(true)}
        >
            <FontAwesomeIcon icon={faCode} />
        </Fab>
        <PreviewModal open={modalOpen} model={state} onClose={closeModal}/>
    </>
}

export default DiagramWrapper;