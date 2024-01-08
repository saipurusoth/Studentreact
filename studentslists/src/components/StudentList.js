import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    styled,
    tableCellClasses,
    tableRowClasses,
    TableRow,
    Grid,
    TablePagination,
    Typography,
    Paper,
    TableFooter,
    CircularProgress
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#F2F5F6",
        color: "#2E2E2E",
        fontFamily: "Avenir-Heavy",
        padding: "12px",
        fontSize: "1em",
        lineHeight: "27px",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: "0.9em",
        fontFamily: "Avenir-Book",
        padding: "10px",
        lineHeight: "24px",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    [`&.${tableRowClasses.root}`]: {},
    "&:nth-of-type(odd)": {},
}));

function StudentList() {
    const [state, setState] = useState({
        page: 0,
        rowsPerPage: 10,
        loading: false,
    });

    const [students, setStudents] = useState([]);

    const fetchData = async (skip, limit) => {
        try {
            setState((prevState) => ({ ...prevState, loading: true }));
            const response = await axios.get(`http://localhost:4000/api/get-studentList?skip=${skip}&limit=${limit}`);
            if (response.status === 200) {
                setStudents(response.data.data);
            } else {
                console.error('Error fetching data from the API');
            }
        } catch (error) {
            console.error('Error fetching data from the API', error);
        }
        finally {
            setState((prevState) => ({ ...prevState, loading: false }));
        }
    };
    const preLoadeData = async () => {
        try {
            await axios.get(`http://localhost:4000/api/preload`);
        } catch (error) {
            console.error('Error fetching data from the API', error);
        }
    };


    useEffect(() => {
        preLoadeData()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            fetchData(0, 10);
        }, 1000)

    }, []);

    const handleChangePage = (event, newPage) => {
        const limit = state.rowsPerPage;
        const skip = newPage * limit;
        setState({ ...state, page: newPage });
        fetchData(skip, limit);
    };

    const handleChangeRowsPerPage = (event) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        const page = 0;
        const skip = page * rowsPerPage;
        fetchData(skip, rowsPerPage);
        setState({ ...state, rowsPerPage, page });
    };

    return (
        <Grid container spacing={3} style={{ padding: 30 }}>
            <Grid item xs={12}>
                <Typography className="header" style={{ fontSize: 30 }}>
                    Students
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer>
                        <Table aria-label="simple table" size="small">
                            <TableHead style={{ backgroundColor: "#E7E7E7" }}>
                                <StyledTableRow>
                                    <StyledTableCell align="left">Name</StyledTableCell>
                                    <StyledTableCell align="left">Department</StyledTableCell>
                                    <StyledTableCell align="left">Phone Number</StyledTableCell>
                                    <StyledTableCell align="left">DOB</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            {!!students && students.length > 0 ? (
                                students.map((student, index) => (
                                    <TableBody key={index}>
                                        <StyledTableRow>
                                            <StyledTableCell align="left">{student.name}</StyledTableCell>
                                            <StyledTableCell align="left">{student.department}</StyledTableCell>
                                            <StyledTableCell align="left">{student.phoneNumber}</StyledTableCell>
                                            <StyledTableCell align="left">{student.dob}</StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            )}
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        count={20}
                                        rowsPerPage={state.rowsPerPage}
                                        page={state.page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={"No. of items per page:"}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default StudentList;