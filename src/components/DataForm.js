import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Container,
} from "@mui/material";

function DataForm() {
  const [dataItems, setDataItems] = useState([]);
  const [editData, setEditData] = useState({});
  const [newData, setNewData] = useState("");
  const [totalAdds, setTotalAdds] = useState(0);
  const [totalUpdates, setTotalUpdates] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/data");
        setDataItems(response.data);
        const initialEditData = {};
        response.data.forEach((item) => {
          initialEditData[item._id] = item.data;
        });
        setEditData(initialEditData);

        const counts = await axios.get("http://localhost:5000/count");
        setTotalAdds(counts.data.totalAdds);
        setTotalUpdates(counts.data.totalUpdates);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (id) => {
    if (!editData[id]) {
      alert("Input data is empty!");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/data/${id}`, {
        data: editData[id],
      });
      alert("Data updated successfully!");
      const updatedItems = dataItems.map((item) =>
        item._id === id ? { ...item, data: editData[id] } : item
      );
      setDataItems(updatedItems);
      setTotalUpdates((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data");
    }
  };

  const handleAdd = async () => {
    if (!newData.trim()) {
      alert("Cannot add empty data!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/data", {
        data: newData,
      });
      alert("Data added successfully!");
      const newItem = { _id: response.data._id, data: newData };
      setDataItems([...dataItems, newItem]);
      setNewData("");
      setEditData((prevEditData) => ({
        ...prevEditData,
        [newItem._id]: newItem.data,
      }));
      setTotalAdds((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Failed to add data");
    }
  };

  const handleChange = (id, value) => {
    setEditData({
      ...editData,
      [id]: value,
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" textAlign="center">
          Total Adds: {totalAdds} | Total Updates: {totalUpdates}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          marginBottom={2}
        >
          <TextField
            label="Add New Data"
            variant="outlined"
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            sx={{ width: "75%" }}
          />
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add
          </Button>
        </Stack>
        {dataItems.map((item) => (
          <Card key={item._id} sx={{ mt: 2 }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <TextField
                  variant="outlined"
                  label="Edit Data"
                  value={editData[item._id]}
                  onChange={(e) => handleChange(item._id, e.target.value)}
                  sx={{ width: "75%" }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdate(item._id)}
                >
                  Update
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default DataForm;
