import React, { useState, useEffect } from 'react';
import { Button, Collapse, CardBody, Card, Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";

function AnswerCard(props) {
  const [answer, setAnswer] = useState(props.answer ? props.answer : '');

  useEffect( () => {

    console.log(props)

  }, [props]);

  const defaultIfEmpty = (object, value, placeholder) => {
    return object === undefined ? placeholder : object[value];
  };

  const handleChange = e => { //wegwerken
    const { name, value } = e.target;
    setAnswer(prevState => ({
        ...prevState,
        [name]: value
    }));
  }

  const nextoptions = props.tool.questions.map((question, index) => {
    return(<option value={question.pk}>{question.text}</option>)
  })

  const onBlur = e => { 
    if (!props.isnew) {
      if (e.target.name === 'text' && e.target.value === '') {
          console.log("kill")
          // axios.delete(API_URL + 'answers/' + answer.pk + '/');
      } else {
        console.log("change")
        axios.patch(API_URL + 'answers/' + answer.pk + '/', { [e.target.name]: e.target.value });
      }
    } else if (e.target.name === 'text') {
      console.log("create")
      // axios.post(API_URL + 'answers/', { 'text': e.target.value, 'tool': props.toolpk }); //jammer dan voor de uitleg
    }
  }

  return(
    <>
      <div>
          <Card className="mb-3">
            <CardBody>
              <FormGroup>
                <Label for="text">Text:</Label>
                <Input
                  type="text"
                  name="text"
                  placeholder="Question text"
                  onChange={handleChange}
                  onBlur={onBlur}
                  defaultValue={defaultIfEmpty(answer, 'text', '')}
                />
              </FormGroup>
              <FormGroup>
              <Label for="nextquestion">Next question:</Label>
                <Input type="select" name="nextquestion" id="nextQuestion" value={answer.nextquestion}>
                  <option value=''>Next in order</option>
                  {nextoptions}
                </Input>
              </FormGroup>
            </CardBody>
          </Card>
      </div>
    </>
  )
}


function QuestionCard(props) {

  const [question, setQuestion] = useState(props.question);
  const [isOpen, setIsOpen] = useState(false);

  useEffect( () => {
    //future onmount
  }, []);
  
  const toggle = () => setIsOpen(!isOpen);

  const answerRows = !props.question 
    ? "No answers." 
    : props.question.answers.map((answer, index) => {
      return(<AnswerCard key={index} answer={answer} tool={props.tool}/>)
    });

  const defaultIfEmpty = (object, value, placeholder) => {
    return object === undefined ? placeholder : object[value];
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setQuestion(prevState => ({
        ...prevState,
        [name]: value
    }));
  }

  const onBlur = e => { //alles herschrijven naar state
    if (!props.isnew) {
      if ( !question.text || question.text === '[Question text missing]') {
        if (!question.expl) {
          console.log("kill")
          // axios.delete(API_URL + 'questions/' + question.pk + '/');
        }
        setQuestion(prevState => ({
          ...prevState,
          text: '[Question text missing]'
      }));
      } else {
        console.log("change")
        axios.patch(API_URL + 'questions/' + question.pk + '/', { [e.target.name]: e.target.value });
      }
    } else if (e.target.name === 'text') {
      console.log("create")
      // axios.post(API_URL + 'questions/', { 'text': e.target.value, 'tool': props.tool.pk }); //jammer dan voor de uitleg
    }
  }

  

  return(
    <>
      <div>
        <Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>{defaultIfEmpty(question, 'text', "New question")}</Button>
        <Collapse isOpen={isOpen}>
          <Card className="mb-3">
            <CardBody>
              <FormGroup>
                <Label for="text">Text:</Label>
                <Input
                  type="text"
                  name="text"
                  placeholder="Question text"
                  onChange={handleChange}
                  onBlur={onBlur}
                  defaultValue={defaultIfEmpty(question, 'text', '')}
                />
                </FormGroup>
                <FormGroup>
                <Label for="expl">Explanation (optional):</Label>
                <Input
                  type="text"
                  name="expl"
                  placeholder="Explanation (optional)"
                  onChange={handleChange}
                  defaultValue={defaultIfEmpty(question, 'expl', '')}
                  onBlur={onBlur}
                />
              </FormGroup>
              {answerRows}
              <AnswerCard isnew='true' tool={props.tool}/>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    </>
  )
}



class ToolForm extends React.Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      tool: {
        name: '',
        desc: '',
        questions: []
      },
      newquestion: false
    };
  }

  componentDidMount() {
    this.getTools();
  }

  getTools = () => {
    axios.get(API_URL + 'tools/3/').then(res => this.setState({ tool: res.data })); 
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
    const questionRows = this.state.tool.questions.map((question, index) => {
      return(
        <QuestionCard key={index} question={question} tool={this.state.tool}/>
      )
  
    });
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
        {questionRows}
        <QuestionCard tool={this.state.tool} isnew='1' changeHandler={this.onChange} />
        <div><Button>Send</Button></div>
      </Form>
    );
  }
}

export default ToolForm;