"use client"

import styles from "../page.module.css";
import Header from '@/components/header';
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { taskTypes } from "@/helpers/constants";
import AddModal from "./_modal/add";
import DetailsModal from "./_modal/details";
import moment from "moment";

export default function Admin(){


  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState();

  const types = taskTypes;
  const [selectedTypeId, setSelectedTypeId] = useState(1);
  const [selectedTask, setSelectedTask] = useState({});

  const getTasks = async() => {

    const request = await fetch('/api/task/list', {
      method: "GET"
    });

    const result = await request.json();

    if(!request.ok){
      console.log('Error in retrieving TASKS: ', result.message || 'Not sure what happend 🤷🏻‍♀️');
    }

    setTasks(result.list || []);
  };

  const generateTypes = () => {
    const display = types.map((t) => {
      return (
        <Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} key={t.name}>
          <Row><h4 className={styles.c_title}>{t.name}</h4></Row>
          <Row className={styles.c_div_margin_5}><Button variant="light" onClick={()=>handleAddTask(t.id)}>➕</Button></Row>
          <Row></Row>
          <Row className={styles.c_div_margin_5}>
            {generateTasks(t.id)}
          </Row>
        </Col>
      );
    });

    return display;
  };

  const generateTasks = (typeId) => {
    const display = tasks.filter((t)=>t.type_id==typeId).map((t)=>{
      return (
        <Col xl={12} key={t._id}>
          <Button size="sm" variant="light" className={styles.c_btn_delete} onClick={()=>handleDeleteTask(t._id)}>❌</Button>
          <div className={styles.c_card} onClick={()=>handleClickCard(t)}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <small>Assigned to: {t.assignee?.name || '!ERR'}</small><br/><br/>
            <small>~{t.created_by}<br/>{moment(t.created_at).format("YYYY-MM-DD hh:mm:ss A")}</small>
          </div>
        </Col>
      );
    });

    return display;
  }

  const handleAddTask = (typeId) => {

    setSelectedTypeId(typeId);
    setShowAddModal(true);
  };

  const handleModalClose = (data) => {
    if(data){
      getTasks();
    }

    setShowAddModal(false);
    setShowDetailsModal(false);
  };

  const handleClickCard = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  }

  const handleDeleteTask = async(_id) => {

    const response = await fetch("/api/task/delete", {
      method: "POST",
      body: JSON.stringify({
        _id
      },{
        headers:{
          "Content-Type": "application/json"
        }
      })
    });

    const data = await response.json();

    if(!response.ok){
      console.log(data.message || "SOMETHING WENT WRONG!");
      return;
    }

    getTasks();
  }
  
  useEffect(()=>{
    getTasks();
  }, []);

  return(
    <main className={styles.main}>
      <Header pageTitle="Simply Tasky" activePage="Home" />
      <div className={styles.c_task_wrapper}>
        <div className={styles.c_task_container}>
          <Row className={styles.container}>
            {generateTypes()}
          </Row>
        </div>
      </div>
      <AddModal typeId={selectedTypeId} show={showAddModal} onModalClose={handleModalClose}/>
      <DetailsModal task={selectedTask} show={showDetailsModal} onModalClose={handleModalClose}/>
    </main>
  );
}