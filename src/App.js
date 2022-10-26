import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  let formValues = {
    _id: "",
    name: "",
    age: "",
    email: "",
    gender: "",
    courses: "",
    file: "",
    image: "",
    error: {
      name: "",
      age: "",
      email: "",
      gender: "",
      courses: "",
    },
  };
  const [formData, setFormData] = useState(formValues);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get("http://localhost:3002/employees/get");
      setUserData(response.data);
    }
    getData();
  }, []);

  const handleChange = (e) => {
    let error = { ...formData.error };
    if (e.target.value === "") {
      error[e.target.name] = `${e.target.name} is Required`;
    } else {
      error[e.target.name] = "";
    }
    setFormData({ ...formData, [e.target.name]: e.target.value, error });
  };

  const onPopulateData = (id) => {
    const selectedData = userData.filter((row) => row._id === id)[0];
    console.log(selectedData);
    setFormData({
      ...formData,
      ...selectedData,
    });
  };
  const handleDelete = async (id) => {
    const response = await axios.delete(
      `http://localhost:3002/employees/delete/${id}`
    );
    console.log(response);
    const user = userData.filter((row) => row._id !== id);
    setUserData(user);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Delete
    const errKeys = Object.keys(formData).filter((key) => {
      if (
        formData[key] === "" &&
        key != "error" &&
        key != "_id" &&
        key != "file" &&
        key != "image"
      ) {
        return key;
      }
    });
    console.log(errKeys);
    if (errKeys.length >= 1) {
      alert("Please fill all values");
    } else {
      let response = {};
      let fd = new FormData();
      fd.append("name", formData.name);
      fd.append("age", formData.age);
      fd.append("email", formData.email);
      fd.append("gender", formData.gender);
      fd.append("courses", formData.courses);

      if (formData._id) {
        // Update
        fd.append("files", formData.file || formData.image);
        response = await axios.put(
          `http://localhost:3002/employees/update/${formData._id}`,
          fd
        );
      } else {
        fd.append("files", formData.file);

        response = await axios.post(
          "http://localhost:3002/employees/create",
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      let getResponse = {};
      if (response.status === 200) {
        getResponse = await axios.get("http://localhost:3002/employees/get");
        setUserData(getResponse.data);
      }
      setFormData(formValues);
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h3> User Form </h3>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "30ch" },
        }}
        autoComplete="off"
        onSubmit={(e) => handleSubmit(e)}
      >
        <TextField
          id="name"
          label="Name"
          variant="standard"
          value={formData.name}
          name="name"
          onChange={(e) => handleChange(e)}
        />
        <br />
        <span style={{ color: "red" }}>{formData.error.name}</span>
        <br />
        <TextField
          id="age"
          label="Age"
          variant="standard"
          type="number"
          name="age"
          value={formData.age}
          onChange={(event) => handleChange(event)}
        />
        <br />
        <span style={{ color: "red" }}>{formData.error.age}</span>
        <br />
        <TextField
          id="email"
          type="email"
          label="Email"
          variant="standard"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e)}
        />
        <br />
        <span style={{ color: "red" }}>{formData.error.email}</span>
        <br />
        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="gender"
          value={formData.gender}
          onChange={(e) => handleChange(e)}
        >
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Other" control={<Radio />} label="Other" />
        </RadioGroup>
        <br />
        <span style={{ color: "red" }}>{formData.error.gender}</span>
        <FormControl fullWidth>
          <InputLabel id="Courses">Courses</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Courses"
            name="courses"
            value={formData.courses}
            onChange={(e) => handleChange(e)}
          >
            <MenuItem value="React">React</MenuItem>
            <MenuItem value="Node">Node</MenuItem>
            <MenuItem value="Javascript">Javascript</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl>
          {/* <InputLabel id="Courses">Upload Image</InputLabel> */}
          <TextField
            type="file"
            id="file"
            name="file"
            key={formData.image || formData.file}
            accept="image/*"
            onChange={(event) => {
              setFormData({
                ...formData,
                file: event.target.files[0],
                image: "",
              });
            }}
          />{" "}
          <br />
          {formData.image ? (
            <span>
              {formData.image}{" "}
              <CloseIcon
                onClick={() => {
                  setFormData({ ...formData, image: "" });
                }}
              />
            </span>
          ) : (
            <> </>
          )}
        </FormControl>
        <br />
        <span style={{ color: "red" }}>{formData.error.courses}</span>
        <br /> <br />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
      <h3> User Data </h3>
      <TableContainer component={Paper}>
        <Table sx={{ width: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Courses</TableCell>
              <TableCell align="right">Images</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((row) => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                  {row._id}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.age}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.gender}</TableCell>
                <TableCell align="right">{row.courses}</TableCell>
                <TableCell align="right">
                  <img
                    src={`http://localhost:3002/images/${row.image}`}
                    height={50}
                    width={50}
                    style={{ borderRadius: "50%" }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    onClick={() => onPopulateData(row._id)}
                  >
                    Edit
                  </Button>
                  <br />
                  <Button variant="text" onClick={() => handleDelete(row._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
