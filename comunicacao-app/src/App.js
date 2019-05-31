import React, { Component } from "react";
import axios from "axios";
import { Row } from 'react-materialize';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import socketIOClient from "socket.io-client";

import TableData from './TableData'

class App extends Component {
  // inicializando os estados 
  state = {
    data: {
      slaveId: 1,
      setPoint: null,
      value: null,
      createdAt: null,
      updateAt: null,
    },
    intervalIsSet: false,
    isLoading: false,
  };

  // quando o componente monta, ele da um fetch em todo data existente no db
  componentDidMount() {
    this.getDataFromDb();
    // if (!this.state.intervalIsSet) {
    //   let interval = setInterval(this.getDataFromDb, 1000);
    //   this.setState({ intervalIsSet: interval });
    // }


    const socket = socketIOClient("http://localhost:3001");
    socket.on("test", data => console.log(data));
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
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data, isLoading: false }))
      .catch(error => console.error(error));
  };

  // metodo post que usa a api backend, att valor de setpoint
  putDataToDB = () => {
    let currentSetPoint = this.state.setPoint;

    axios.post("http://localhost:3001/api/update", {
      slaveId: 1,
      setPoint: currentSetPoint,
    });
  };

  // front
  render() {
    const dados = [
      {
        slaveId: 1,
        setPoint: 24.5,
        value: 0.112,
      },
      {
        slaveId: 1,
        setPoint: 24.5,
        value: 0.113,
      }
    ];
    return (
      <div>
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
          <Paper  
            style={{ 
              width: "60%",
              marginTop: 10,
              overflowX: 'auto',
            }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Server ID</TableCell>
                  <TableCell align="right">SetPoint</TableCell>
                  <TableCell align="right">Data</TableCell>
                </TableRow>
              </TableHead>
              {dados.map((dado) => (
                <TableData 
                  slaveId={dado.slaveId}
                  setPoint={dado.setPoint}
                  value={dado.value}
                />
              ))}
          </Table>
        </Paper>
        </Row>
      </div>
    );
  }
}

export default App;