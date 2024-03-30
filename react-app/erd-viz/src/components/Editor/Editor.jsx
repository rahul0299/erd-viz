import {useState} from "react";
import {
    Card,
    CardContent,
    CardHeader, Checkbox,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton, MenuItem, Select,
    TextField
} from "@mui/material";
import {Add, Circle, CircleOutlined, Close} from "@mui/icons-material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faN, faU} from "@fortawesome/free-solid-svg-icons";

const Editor = (props) => {
    const [state, setState] = useState({
        name: "entity",
        category: "entity",
        attributes: [
            { key: "1", name: "attr1", type: "varchar", isUnique: false, isNullable: true },
            { key: "2", name: "attr2", type: "number", isUnique: true, isNullable: false },
            { key: "3", name: "attr3", type: "date", isUnique: false, isNullable: true },
            { key: "4", name: "attr4", type: "boolean", isUnique: false, isNullable: true },
        ],
        primaryKey: "2"
    });

    const getIndex = (key) => {
        for(let i=0;i<state.attributes.length;i++) {
            if (state.attributes[i].key === key) {
                return i;
            }
        }
        return -1;
    }

    const handleNameChange = (e) => {
        setState({...state, name: e.target.value});
    }

    const handleAttributeNameChange = (key, value) => {
        const idx= getIndex(key);
        const newValues = {...state.attributes[idx], name: value}
        setState(prevState => {
            const nextState = {...prevState};
            nextState.attributes.splice(idx, 1, newValues);
            return nextState
        })
    }

    const handleAttributeTypeChange = (key, value) => {
        console.log(value)
        const idx= getIndex(key);
        const newValues = {...state.attributes[idx], type: value}
        setState(prevState => {
            const nextState = {...prevState};
            nextState.attributes.splice(idx, 1, newValues);
            return nextState
        })
    }

    const toggleProperty = (key, property) => {
        const idx= getIndex(key);
        const attribute = {...state.attributes[idx]}
        if (key === state.primaryKey) {
            attribute.isNullable = false;
            attribute.isUnique = true;
        } else {
            attribute[property] = !attribute[property];
        }

        setState(prevState => {
            const nextState = {...prevState};
            nextState.attributes.splice(idx, 1, attribute);
            return nextState
        })
    }

    const changePrimaryKey = (key) => {
        const idx= getIndex(key);
        const attribute = {...state.attributes[idx]}

        if (key !== state.primaryKey) {
            attribute.isNullable = false;
            attribute.isUnique = true;

            setState(prevState => {
                const nextState = {...prevState, primaryKey: key};
                nextState.attributes.splice(idx, 1, attribute);
                return nextState;
            })
        } else {
            setState({...state, primaryKey: -1})
        }
    }

    const addAttribute = () => {
        let newKey = state.attributes.length + 1
        for(let i=0;i<state.attributes.length;i++) {
            if (state.attributes[i].key >= newKey) {
                newKey = state.attributes[i].key + 1
            }
        }

        const newAttribute = {
            key: newKey,
            name: "",
            type: "",
            isNullable: true,
            isUnique: false
        }

        setState({...state, attributes: [...state.attributes, newAttribute]})

        props.handleAddAttribute(props.data.key, props.data.category, newAttribute)
    }

    const removeAttribute = (key) => {
        const idx = getIndex(key);
        const attributes = [...state.attributes];
        const attribute = state.attributes[idx];
        attributes.splice(idx, 1);
        setState({...state, attributes})

        props.handleDeleteAttribute(props.data.key, props.data.category, attribute);
    }

    const inActiveColor = "#ddd";
    const nullableColor = "green";
    const uniqueColor = "red";

    return <Card variant="outlined" sx={{ width: 420 }}>
        <CardHeader title="Editor" subheader={<span style={{ textTransform: "capitalize", letterSpacing: "0.1rem", fontSize: "14px" }}>{state.category}</span>}/>
        <CardContent>
            <TextField value={state.name} onChange={handleNameChange} fullWidth={true} label="Name"></TextField>
            <Divider sx={{ marginTop: 2 }}/>
            <List dense={true} sx={{ maxHeight: 250, overflow: "scroll" }}>
                {
                    state.attributes.map(({ key, name, type, isUnique, isNullable }) => {
                        return <ListItem key={key} secondaryAction={
                            <>
                                <Select sx={{ minWidth: 110, fontSize: "10px", marginRight: 1 }} value={type} size="small"
                                        onChange={(e) => handleAttributeTypeChange(key, e.target.value)}>
                                    <MenuItem value="varchar">VARCHAR</MenuItem>
                                    <MenuItem value="number">NUMBER</MenuItem>
                                    <MenuItem value="date">DATE</MenuItem>
                                    <MenuItem value="boolean">BOOLEAN</MenuItem>
                                </Select>
                                <IconButton onClick={() => toggleProperty(key, "isNullable")}>
                                    <FontAwesomeIcon icon={faN} fontSize={14} color={isNullable ? nullableColor : inActiveColor} />
                                </IconButton>
                                <IconButton onClick={() => toggleProperty(key, "isUnique")}>
                                    <FontAwesomeIcon icon={faU} fontSize={14} color={isUnique ? uniqueColor : inActiveColor} />
                                </IconButton>
                                <IconButton disabled={state.primaryKey === key} onClick={() => removeAttribute(key)}>
                                    <Close />
                                </IconButton>
                            </>
                        } sx={{ borderLeft: state.primaryKey === key ? "2px solid #9c27b0" : ""}}>
                            <TextField value={name}
                                       onChange={(e) => handleAttributeNameChange(key, e.target.value)}
                                       size="small"
                                       InputProps={ {style: {fontSize: "10px", maxWidth: 100}} } />
                            <Checkbox
                                icon={<CircleOutlined sx={{ color: inActiveColor }}/>}
                                checkedIcon={<Circle color="secondary"/>}
                                checked={state.primaryKey === key}
                                onClick={() => changePrimaryKey(key)}
                            />
                        </ListItem>
                    })
                }
                <ListItem>
                    <ListItemButton onClick={addAttribute}><IconButton><Add /></IconButton></ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </CardContent>
    </Card>
}

export default Editor;