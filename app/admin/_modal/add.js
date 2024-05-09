"use client"

import { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Row, Col, Toast } from "react-bootstrap";

export default function AddModal({ typeId, show, onModalClose }){

  const [validated, setValidated] = useState(false);
  const [users, setUsers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    variant: "success",
    message: ""
  });

  const titleRef = useRef();
  const descriptionRef = useRef();
  const assignedRef = useRef();

  function handleModalClose(data){
    setValidated(false);
    onModalClose(data);
  }
  
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    createTask();
    
    setValidated(true);
  };

  const createTask = async() => {

    const eTitle = titleRef.current.value;
    const eDescription = descriptionRef.current.value;
    const eAssigned = assignedRef.current.value;

    const response = await fetch("/api/task/add", {
      method: "POST",
      body: JSON.stringify({
        type_id: typeId,
        title: eTitle,
        description: eDescription,
        assigned: eAssigned,
      },{
        headers:{
          "Content-Type": "application/json"
        }
      })
    });

    const data = await response.json();

    if(!response.ok){
      setToastMsg((prev)=>{
        const newState = prev;
        newState.variant = "danger";
        newState.message = data.message || "SOMETHING WENT WRONG!";
        return newState;
      });

      setShowToast(true);
      return;
    }

    handleModalClose({
      message: "Success 🎉"
    });
  }

  const getUsers = async() => {

    const request = await fetch('/api/users/list', {
      method: "GET"
    });

    const result = await request.json();
    
    if(!request.ok){
      return;
    }

    setUsers(result.list);
  }

  useEffect(()=>{
    getUsers();
  }, [show]);

  return (
    <>
      <Modal 
        show={show} 
        onHide={handleModalClose} 
        size="sm" 
        centered
        backdrop="static"
        keyboard={false}
      >
          <Modal.Header closeButton>
            <Modal.Title>Create Task 📝</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Toast 
              bg={toastMsg.variant}
              onClose={() => setShowToast(false)} 
              show={showToast} 
              delay={5000} 
              autohide
              position="top-center"
              className="mt-2 mb-3"
            >
              <Toast.Body className="text-white">{toastMsg.message}</Toast.Body>
            </Toast>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="mb-3">                
                {/* Title */}
                <Form.Group 
                  as={Col} 
                  xs={12}
                  className="mb-3"
                >
                  <Form.Control
                    required
                    id="title"
                    type="text"
                    placeholder="title"
                    ref={titleRef}
                  />
                </Form.Group>
                {/* Description */}
                <Form.Group 
                  as={Col} 
                  xs={12}
                  className="mb-3"
                >
                  <Form.Control 
                    as="textarea" 
                    rows={2} 
                    id="description" 
                    placeholder="description"
                    ref={descriptionRef}
                  />
                </Form.Group>

                {/* Assign Member */}
                <Form.Group
                  as={Col}
                  xs={12}
                  className="mb-3"
                >
                  <Form.Select 
                    aria-label="Assign Member" 
                    required
                    ref={assignedRef}
                    defaultValue=""
                  >
                    <option disabled value="">Assign Member</option>
                    {users.map((user, i)=>{
                      return (<option value={user._id} key={i}>{user.name}</option>)
                    })}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Button type="submit">Save</Button>
            </Form>
          </Modal.Body>
        </Modal>
    </>
  );
}