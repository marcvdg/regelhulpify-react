import React, { useState, useEffect } from 'react';
import { Button, Collapse, CardBody, Card, Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";

function QuestionCard(props) {

  // useEffect(() => {
  //   axios.get(API_URL + 'question/' + props.question + '/').then(res => useState({ tool: res.data })); 
  // }, []);
  
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const question = props.question;

  const defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  const onChange = e => {
    console.log(e)
    console.log(props)
    props.changeHandler(e);
  };

  const onBlur = e => {
    console.log("NOW!")
    axios.patch(API_URL + 'questions/' + question.pk + '/', { [e.target.name]: e.target.value });
  }


  return(
    <>
      <div>
        <Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>{question.text}</Button>
        <Collapse isOpen={isOpen}>
          <Card>
            <CardBody>
              <FormGroup>
                <Label for="text">Text:</Label>
                <Input
                  type="text"
                  name="text"
                  onChange={onChange}
                  onBlur={onBlur}
                  defaultValue={defaultIfEmpty(question.text)}
                />
                </FormGroup>
                <FormGroup>
                <Label for="expl">Explanation (optional):</Label>
                <Input
                  type="text"
                  name="expl"
                  onChange={onChange}
                  defaultValue={defaultIfEmpty(question.expl)}
                  onBlur={onBlur}
                />
              </FormGroup>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    </>
  )
}

function QuestionGroup(props) {

  const changeHandler = e => {
    props.changeHandler(e);
  };


  const questionRows = props.tool.questions.map((question, index) => {
    return(
      <QuestionCard key={index} question={question} changeHandler={changeHandler}/>
    )

  });
  return questionRows;
};



class ToolForm extends React.Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      tool: {
        name: '',
        desc: '',
        questions: []
      }
    };
  }

  componentDidMount() {
    this.resetTools();
  }

  getTools = () => {
    axios.get(API_URL + 'tools/3/').then(res => this.setState({ tool: res.data })); 
  };

  resetTools = () => {
    this.getTools();
  };

  onSubmitHandler = event => {
    console.log("right!" + event)
    event.preventDefault()
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.setState(prevState => ({
      tool: {                   
          ...prevState.tool,    
          [e.target.name]: e.target.value       
      }
    }))
    console.log(this.state)
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  render() {
    return (
      
      <Form onSubmit={this.onSubmitHandler}>       
      <h1>{this.state.tool.name}</h1>
        <FormGroup>
          <Label for="name">Name:</Label>
          <Input
            type="text"
            name="name"
            onChange={this.onChange}
            defaultValue={this.defaultIfEmpty(this.state.tool.name)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="desc">Desc:</Label>
          <Input
            type="text"
            name="desc"
            onChange={this.onChange}
            defaultValue={this.defaultIfEmpty(this.state.tool.desc)}
          />
        </FormGroup>
        <QuestionGroup tool={this.state.tool} changeHandler={this.onChange}/>
        <div><Button>Send</Button></div>
      </Form>
    );
  }
}

export default ToolForm;