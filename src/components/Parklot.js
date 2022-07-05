import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
const Parklot = () => {
  const [number, setNumber] = useState("");
  const [show, setShow] = useState(false);
  const [alrt, showalrt] = useState(false);
  const [arr, setarr] = useState([]);
  const [parkingNo, setParkingNo] = useState([]);
  const [value, setValue] = useState(new Date());
  const [carReg, setCarReg] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [carNumber, setCarNumber] = useState("");
  const [noSpaceAlert, setNoSpaceAlert] = useState(false);
  const [parkingBill, setParkingBill] = useState(0);
  const [deallocate, setDeallocate] = useState(0);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  useEffect(() => {
    setTimeout(() => {
      setValue(value);
    }, [60000]);

    return () => {
      clearTimeout();
    };
  }, [value]);
  const [carAlert, setCarAlert] = useState(false);
  const handleChange = (e) => {
    setNumber(e.target.value);
  };
  const handleSubmit = () => {
    if (number !== "" && number !== "0") {
      setShow(true);
      for (let i = 1; i <= number; i++) {
        setarr((prev) => [...prev, i]);
        setParkingNo((prev) => [...prev, i]);
      }
    } else {
      showalrt(true);
    }
  };
  const handleChangeNumber = (e) => {
    e.preventDefault();
    setCarNumber(e.target.value);
  };
  const handleClose = () => {
    showalrt(false);
  };
  const getSpace = () => {
    if (arr.length >= 1) {
      if (carNumber !== "") {
        const getRandom = Math.ceil(Math.random() * arr.length);
        const final = arr.filter((val) => val === arr[getRandom - 1]);
        setCarReg((prev) => [
          ...prev,
          { number: carNumber, time: Date.now(), allocated: final[0] },
        ]);
        const freelot = arr.filter((val) => val !== arr[getRandom - 1]);
        setarr([...freelot]);
        setCarNumber("");
      } else {
        setCarAlert(true);
      }
    } else {
      setNoSpaceAlert(true);
    }
  };
  const handleNoSpaceClose = () => {
    setNoSpaceAlert(false);
  };
  const handleNoCarNumber = () => {
    setCarAlert(false);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };
  const calculate = (ele) => {
    var now = moment(new Date());
    // var end = moment(1656933091000);
    var end = moment(ele.time);
    var duration = moment.duration(now.diff(end));
    var hours = Math.ceil(duration.asHours());
    setOpenModal(true);
    if (hours <= 2) {
      setParkingBill(10);
    } else {
      let final = hours * 10 - 10;
      setParkingBill(final);
    }

    setDeallocate(ele.allocated);
  };
  const paymentCheck = () => {
    let deallocated = carReg.filter((val) => val.allocated !== deallocate);
    setCarReg([...deallocated]);
    setarr([...arr, deallocate]);
    setOpenModal(false);
  };
  return (
    <div>
      <Typography component="div" variant="h4">
        Parking Lot Page
      </Typography>
      {!show && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography>Enter Parking Lot:</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder="Enter Here"
              type="number"
              value={number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleSubmit} variant="contained">
              Parking lot
            </Button>
          </Grid>
        </Grid>
      )}
      <Grid item container spacing={3}>
        {show === true ? (
          <>
            {parkingNo.map((num) => {
              return (
                <Grid item xs={4}>
                  <div key={num}>
                    <Box
                      style={{
                        border: "2px solid black",
                        width: "100%",
                        height: "100px",
                      }}
                    >
                      <Typography>{num}</Typography>
                      {carReg.map((ele) => {
                        // console.log(arr[nu]);
                        if (ele.allocated === num) {
                          return (
                            <div>
                              <Typography>Car Number:{ele.number}</Typography>
                              <Typography>
                                Time:{moment(ele.time).format(`h:mm:ss:a`)}
                              </Typography>
                              <Button onClick={() => calculate(ele)}>
                                Exit
                              </Button>
                            </div>
                          );
                        }
                      })}
                    </Box>
                  </div>
                </Grid>
              );
            })}
            <Grid item container spacing={2}>
              <Grid item xs={12}>
                <Typography component="div" variant="h4">
                  Enter Car Detail:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Enter Car Number"
                  value={carNumber}
                  onChange={handleChangeNumber}
                  placeholder="Enter Car Number"
                  style={{ marginRight: "20px" }}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Current Time"
                    value={value}
                    onChange={() => {
                      setValue(Date.now());
                    }}
                    readOnly
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={getSpace}>Check Parking Lot</Button>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>
      <Snackbar open={alrt} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          Please Enter the parking lot Number
        </Alert>
      </Snackbar>
      <Snackbar
        open={noSpaceAlert}
        autoHideDuration={3000}
        onClose={handleNoSpaceClose}
      >
        <Alert
          onClose={handleNoSpaceClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Parking is Full
        </Alert>
      </Snackbar>
      <Snackbar
        open={carAlert}
        autoHideDuration={3000}
        onClose={handleNoCarNumber}
      >
        <Alert
          onClose={handleNoCarNumber}
          severity="error"
          sx={{ width: "100%" }}
        >
          Please Enter Car Number
        </Alert>
      </Snackbar>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid item container>
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Your Total Parking Charge is: {parkingBill}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" onClick={paymentCheck}>
                Payment taken
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" onClick={handleModalClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};
export default Parklot;
