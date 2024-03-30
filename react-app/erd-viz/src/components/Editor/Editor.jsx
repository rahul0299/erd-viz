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

    const inActiveColor = "#ddd";
    const nullableColor = "green";
    const uniqueColor = "red";

    return <Card variant="outlined" sx={{ width: 420 }}>
        <CardHeader title="Editor" subheader={<span style={{ textTransform: "capitalize", letterSpacing: "0.1rem", fontSize: "14px" }}>{props.data.category}</span>}/>
        <CardContent>
            <TextField value={props.data.text} fullWidth={true} label="Name"></TextField>
            <Divider sx={{ marginTop: 2 }}/>
            <List dense={true} sx={{ maxHeight: 250, overflow: "scroll" }}>
                {
                    props.data.attributes && props.data.attributes.map(({ key, name, type, isUnique, isNullable }) => {
                        return <ListItem key={key} secondaryAction={
                            <>
                                <Select sx={{ minWidth: 110, fontSize: "10px", marginRight: 1 }} value="varchar" size="small">
                                    <MenuItem value="varchar">VARCHAR</MenuItem>
                                    <MenuItem value="number">NUMBER</MenuItem>
                                    <MenuItem value="date">DATE</MenuItem>
                                    <MenuItem value="boolean">BOOLEAN</MenuItem>
                                </Select>
                                <IconButton>
                                    <FontAwesomeIcon icon={faN} fontSize={14} color={isNullable ? nullableColor : inActiveColor} />
                                </IconButton>
                                <IconButton>
                                    <FontAwesomeIcon icon={faU} fontSize={14} color={isUnique ? uniqueColor : inActiveColor} />
                                </IconButton>
                                <IconButton disabled={props.data.primaryKey === key} onClick={() => props.handleDeleteAttribute(props.data.key, props.data.category, key)}>
                                    <Close />
                                </IconButton>
                            </>
                        } sx={{ borderLeft: props.data.primaryKey === key ? "2px solid #9c27b0" : ""}}>
                            <TextField value={name}
                                       // onChange={(e) => handleAttributeNameChange(key, e.target.value)}
                                       size="small"
                                       InputProps={ {style: {fontSize: "10px", maxWidth: 100}} } />
                            <Checkbox
                                icon={<CircleOutlined sx={{ color: inActiveColor }}/>}
                                checkedIcon={<Circle color="secondary"/>}
                                checked={props.data.primaryKey === key}
                                // onClick={() => changePrimaryKey(key)}
                            />
                        </ListItem>
                    })
                }
                <ListItem>
                    <ListItemButton onClick={() => props.handleAddAttribute(props.data.key, props.data.category)}><IconButton><Add /></IconButton></ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </CardContent>
    </Card>
}

export default Editor;