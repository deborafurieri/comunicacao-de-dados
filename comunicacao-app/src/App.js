import React, { Component } from "react";
import { Row } from 'react-materialize';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import socketIOClient from "socket.io-client";

import TableData from './TableData'
import Chart from './Chart'

class App extends Component {
  // inicializando os estados 
  constructor(props) {
    super(props);

    this.state = {
      firstSlave: [
        {
          slaveId: null,
          setPoint: 0,
          value: null,
        }
      ],
      secondSlave: [
        {
          slaveId: null,
          setPoint: 0,
          value: null,
        }
      ],
      setPoint: 0,
      intervalIsSet: false,
      valueFirst: 0,
      valueSecond: 0,
    };
  }

  // quando o componente monta, ele da um fetch em todo data existente no db
  componentDidMount() {
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getData(), 1000);
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
  
  getData() {
    const socket = socketIOClient('http://localhost:3001');
    socket.on('test', data => {
      let allData = JSON.parse(data);
      let slaveId = allData.slaveId;
      if (slaveId === 1) {
        this.setState({ firstSlave: [allData], valueFirst: allData.value.toFixed(3) });
      } else {
        this.setState({ secondSlave: [allData], valueSecond: allData.value.toFixed(3) });
      }
    });
  }

  sendSetPoint(setPoint) {
    const socket = socketIOClient('http://localhost:3001');
    socket.emit('client_data', setPoint);
    console.log('setpoint', setPoint)
  }

  // front
  render() {
    return (
      <div>
        <Row>
          <h1 style={{ height: '40px', backgroundColor: '#FFF', textAlign: 'center' }}>Comunicação de Dados</h1>
          <h2 style={{ textAlign: 'center' }}>Sistema de Comunicação real baseado no Padrão RS-485</h2>
          <h3 style={{ textAlign: 'center' }}>Débora Furieri, José Martins, Roberto Vasconcellos</h3>
        </Row>
        <Row style={{ paddingLeft: '60px' }}>
          <Row>
            <div style={{ padding: "10px" }}>
              <p style={{ fontWeight: 'bold' }}>Altere o SetPoint</p>
              <input
                type="text"
                onChange={e => this.setState({ setPoint: e.target.value })}
                placeholder="Setpoint"
                style={{ width: "100px", marginRight: '10px'}}
              />
              <button onClick={() => this.sendSetPoint(this.state.setPoint)}>
                Enviar
              </button>
            </div>
          </Row>
          <Row>
            <Paper  
              style={{ 
                width: "50%",
                marginTop: 10,
                overflowX: 'auto',
                marginLeft: "10px",
              }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }} align="center">Server ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }} align="center">SetPoint</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }} align="center">Data</TableCell>
                  </TableRow>
                </TableHead>
                  {this.state.firstSlave.map((dado) => (
                    <TableData 
                      //slaveId={dado.slaveId} // primeiro escravo
                      slaveId={1}
                      setPoint={dado.setPoint}
                      value={dado.value}
                    />
                  ))}
                  {this.state.secondSlave.map((dado) => (
                    <TableData 
                      // slaveId={dado.slaveId} // segundo escravo
                      slaveId={2}
                      setPoint={dado.setPoint}
                      value={dado.value}
                    />
                  ))}
            </Table>
          </Paper>
          </Row>
          <Row>
            <Chart 
              valueFirstSlave={this.state.valueFirst}
              valueSecondSlave={this.state.valueSecond}
            />
          </Row>
        </Row>
      </div>
    );
  }
}

export default App;