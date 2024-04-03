import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, Skeleton, Stack,
    Typography
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {useEffect, useState} from "react";
import { saveAs } from 'file-saver';
import axios from "axios";

const PreviewModal = (props) => {

    const [content, setContent] = useState(null);

    useEffect(() => {
        if (props.open) {
            setContent(null);

            const data = props.model;

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://ertosql-latest.onrender.com/toSQL',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                data : data
            };

            axios.request(config)
                .then((response) => {
                    setContent(response.data.sql);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }, [props.open]);

    const saveContent = () => {
        if (content != null) {
            let str = "";
            content.forEach(line => str += line + '\n\n');
            console.log(str)
            const blob = new Blob([str], {type: "text/plain;charset=utf-8"});
            saveAs(blob, 'schema.sql');
        }
    }

    return <Dialog open={props.open} maxWidth="sm" onClose={props.onClose}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            SQL DDL Code
        </DialogTitle>
        <IconButton
            aria-label="close"
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
            onClick={props.onClose}
        >
            <Close />
        </IconButton>
        <DialogContent>
            <Box
                border="1px solid #ddd"
                minWidth="500px"
                minHeight="200px"
                padding="10px"
                borderRadius="10px"
                maxHeight="700px">
                {
                    // eslint-disable-next-line react/prop-types
                    content
                        ?
                        content.map(c => <>
                            <Typography>{c}</Typography>
                            <br />
                        </>)
                        :
                        <Stack spacing={1}>
                            <Skeleton variant="rectangular" height={90} />
                            <Skeleton variant="rounded" height={90} />
                        </Stack>
                }

            </Box>
        </DialogContent>
        <DialogActions sx={{ marginBottom: 2 }}>
            <Button variant="outlined" onClick={saveContent}>
                Save .sql
            </Button>
            <Button onClick={props.onClose}>
                Close
            </Button>
        </DialogActions>
    </Dialog>
}
export default PreviewModal