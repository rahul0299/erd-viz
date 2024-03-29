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
    // const [state, setState] = useState({
    //     name: "entity",
    //     category: "entity",
    //     attributes: [
    //         { name: "attr1", type: "varchar", isUnique: false, isNullable: true },
    //         { name: "attr2", type: "number", isUnique: true, isNullable: false },
    //         { name: "attr3", type: "date", isUnique: false, isNullable: true },
    //         { name: "attr4", type: "boolean", isUnique: false, isNullable: true },
    //     ],
    //     primaryKey: "attr2"
    // });

    const [state, setState] = useState(props.data)

    const inActiveColor = "#ddd";
    const nullableColor = "green";
    const uniqueColor = "red";

    return <Card variant="outlined" sx={{ width: 420 }}>
        <CardHeader title="Editor" />
        <CardContent>
            <TextField value={state.name} fullWidth={true}></TextField>
            <Divider sx={{ marginTop: 2 }}/>
            <List dense={true}>
                {
                    state.attributes.map(({ name, type, isUnique, isNullable }) => {
                        return <ListItem secondaryAction={
                            <>
                                <Select sx={{ minWidth: 110, fontSize: "10px", marginRight: 1 }} value={type} size="small">
                                    <MenuItem value="varchar">VARCHAR</MenuItem>
                                    <MenuItem value="number">NUMBER</MenuItem>
                                    <MenuItem value="date">DATE</MenuItem>
                                    <MenuItem value="boolean">BOOLEAN</MenuItem>
                                </Select>
                                <IconButton><FontAwesomeIcon icon={faN} fontSize={14} color={isNullable ? nullableColor : inActiveColor} /></IconButton>
                                <IconButton><FontAwesomeIcon icon={faU} fontSize={14} color={isUnique ? uniqueColor : inActiveColor} /></IconButton>
                                <IconButton><Close /></IconButton>
                            </>
                        } sx={{ borderLeft: state.primaryKey === name ? "2px solid #9c27b0" : ""}}>
                            <TextField value={name} size="small" InputProps={ {style: {fontSize: "10px", maxWidth: 100}} }></TextField>
                            <Checkbox
                                icon={<CircleOutlined sx={{ color: inActiveColor }}/>}
                                checkedIcon={<Circle color="secondary"/>}
                                checked={state.primaryKey === name}/>
                        </ListItem>
                    })
                }
                <ListItem>
                    <ListItemButton><IconButton><Add /></IconButton></ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </CardContent>
    </Card>
}

export default Editor;