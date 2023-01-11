import React, { useContext, useEffect, useState } from 'react'
import './edit.css'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spiner from '../../components/Spiner/Spiner'
import { useParams, useNavigate } from 'react-router-dom';
import { editApi, singleUserGetApi } from '../../services/Apis';
import { BASE_URL } from '../../services/helper';
import { updateData } from '../../components/context/ContextProvider';


const Edit = () => {

  const { id } = useParams();

  const [inputData, setInputData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    location: ""
  })

  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState("");
  const [imgData, setimgData] = useState("");
  const [preview, setPreview] = useState("");
  const [showSpin, setShowSpin] = useState(true)

  const { update, setUpdate } = useContext(updateData)

  const navigate = useNavigate();

  // status options
  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'InActive' },
  ];

  // setInput value
  const setInputValue = (e) => {
    const { name, value } = e.target
    setInputData({ ...inputData, [name]: value })
  }

  // status set
  const setStatusValue = (e) => {
    setStatus(e.value)
  }

  // profile set
  const setProfile = (e) => {
    setImage(e.target.files[0])
  }

  const userProfileGet = async () => {
    const response = await singleUserGetApi(id)
    if (response.status === 200) {
      setInputData(response.data)
      setStatus(response.data.status)
      setimgData(response.data.profile)
    } else {
      console.log("error")
    }
  }

  // submit userdata
  const submitUserData = async (e) => {
    e.preventDefault()
    const { fname, lname, email, mobile, gender, location } = inputData;

    if (fname === "") {
      toast.error("First name is Required !")
    } else if (lname === "") {
      toast.error("Last name is Required !")
    } else if (email === "") {
      toast.error("Email is Required !")
    } else if (!email.includes('@')) {
      toast.error("Enter Valid Email !")
    } else if (mobile === "") {
      toast.error("Mobile is Required !")
    } else if (mobile.length > 10) {
      toast.error("Enter Valid Mobile !")
    } else if (gender === "") {
      toast.error("Gender is Required !")
    } else if (status === "") {
      toast.error("Status is Required !")
    } else if (location === "") {
      toast.error("Location is Required !")
    } else {
      const data = new FormData();
      data.append("fname", fname)
      data.append("lname", lname)
      data.append("email", email)
      data.append("mobile", mobile)
      data.append("gender", gender)
      data.append("status", status)
      data.append("user_profile", image || imgData)
      data.append("location", location)

      const config = {
        "Content-Type": "multipart/form-data"
      }

      const response = await editApi(id, data, config)
      if (response.status === 200) {
        setUpdate(response.data)
        navigate("/")
      }
    }
  }

  useEffect(() => {
    userProfileGet();
  }, [id])

  useEffect(() => {
    if (image) {
      setimgData("")
      setPreview(URL.createObjectURL(image))
    }
    setTimeout(() => {
      setShowSpin(false)
    }, 1200)
  }, [image])

  return (
    <>
      {
        showSpin ? <Spiner /> :
          <div className="container">
            <h2 className='text-center mt-1'>Update Your Details</h2>
            <Card className='shadow mt-3 p-3'>
              <div className="profile_div text-center">
                <img src={image ? preview : `${BASE_URL}/uploads/${imgData}`} alt='img' />
              </div>
              <Form>
                <Row>
                  <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="text" name="fname" placeholder='Enter FirstName' value={inputData.fname} onChange={setInputValue} />
                  </Form.Group>

                  <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" name="lname" placeholder='Enter LastName' value={inputData.lname} onChange={setInputValue} />
                  </Form.Group>

                  <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder='Enter Email' value={inputData.email} onChange={setInputValue} />
                  </Form.Group>

                  <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control type="" name="mobile" placeholder='Enter Mobile' value={inputData.mobile} onChange={setInputValue} />
                  </Form.Group>

                  <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                    <Form.Label>Select Your Gender</Form.Label>
                    <Form.Check
                      type={"radio"}
                      label={"Male"}
                      name={"gender"}
                      checked={inputData.gender === "Male" ? true : false}
                      value={"Male"}
                      onChange={setInputValue}
                    />
                    <Form.Check
                      type={"radio"}
                      label={"Female"}
                      name={"gender"}
                      checked={inputData.gender === "Female" ? true : false}
                      value={"Female"}
                      onChange={setInputValue}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                    <Form.Label>Select Your Status</Form.Label>
                    <Select options={options} defaultValue={status} onChange={setStatusValue}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                    <Form.Label>Select Your Profile</Form.Label>
                    <Form.Control type="file" name="user_profile" placeholder='Select Your Profile' onChange={setProfile} />
                  </Form.Group>

                  <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                    <Form.Label>Enter Your Location</Form.Label>
                    <Form.Control type="text" name="location" value={inputData.location} placeholder='Enter Your Location' onChange={setInputValue} />
                  </Form.Group>

                  <Button variant="primary" type="submit" onClick={submitUserData}>
                    Submit
                  </Button>
                </Row>
              </Form>
            </Card>
            <ToastContainer position="top-center" />
          </div>
      }
    </>
  )
}

export default Edit