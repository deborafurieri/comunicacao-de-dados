import React, { Component } from "react";
import axios from "axios";
import { Row, Col } from 'react-materialize';

import Table from './TableData'

class App extends Component {
  // inicializando os estados 
  state = {
    data: [],
    message: null,
    slaveId: 1,
    setPoint: null,
    value: null,
    intervalIsSet: false,
  };

  // quando o componente monta, ele da um fetch em todo data existente no db
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // mata o processo
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // metodo get que usa a api backend, fetch data da nossa data base
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData", {
        method: "GET",
        headers: new Headers({
          'Content-Type': 'application/json',
      })
    })
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }))
      .catch(error => console.error(error));
  };

  // metodo post que usa a api backend, att valor de setpoint
  putDataToDB = () => {
    let currentSetPoint = this.state.data.map(data => data.setPoint);

    axios.post("http://localhost:3001/api/update", {
      slaveId: 1,
      setPoint: currentSetPoint,
    });
  };

  // front
  render() {
    const { data } = this.state;
    console.log('data', data)
    return (
      <div>
        data ? 
          <ul>
            {data.map(dat => (
              <li style={{ padding: "10px" }} key={data.value}>
                <span style={{ color: "gray" }}> slaveId: </span> {dat.slaveId} <br />
                <span style={{ color: "gray" }}> setPoint: </span> {dat.setPoint} <br />
                <span style={{ color: "gray" }}> data: </span>
                {dat.value}
              </li>
            ))}
          </ul>
        : ()
        <Row>
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              onChange={e => this.setState({ setPoint: e.target.value })}
              placeholder="Setpoint"
              style={{ width: "200px" }}
            />
            <button onClick={() => this.putDataToDB(this.state.setPoint)}>
              Editar
            </button>
          </div>
        </Row>
        <Row>
          <Col><Table /></Col>
        </Row>
        
      </div>
    );
  }
}

export default App;