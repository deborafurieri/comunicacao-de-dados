import React, { Component } from "react";
import { Row, Col } from 'react-materialize';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import socketIOClient from "socket.io-client";

import TableData from './TableData';
import Chart from './Chart';

class App extends Component {
  // inicializando os estados 
  constructor(props) {
    super(props);

    // cria uma instância que comunica com o backend
    this.socket = socketIOClient('http://localhost:3001');

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
    this.socket.on('test', data => {
      let allData = JSON.parse(data);
      let slaveId = allData.slaveId;
      if (slaveId === 1) {
        this.setState({ firstSlave: [allData], valueFirst: allData.value });
      } else {
        this.setState({ secondSlave: [allData], valueSecond: allData.value });
      }
    });
  }

  sendSetPoint(setPoint) {
    const json = {
      setPoint: parseInt(setPoint)
    }
    this.socket.emit('client_data', json);
    console.log('this.state', json);
  }

  // front
  render() {
    return (
      <div>
        <Row>
          <h1 style={{ textAlign: 'center' }}>Engenharia de Controle e Automação, IFES - Campus Serra</h1>
          <h2 style={{ textAlign: 'center' }}>Sistema de Comunicação real baseado no Padrão RS-485</h2>
          <h3 style={{ textAlign: 'center' }}>Débora Furieri, José Martins, Roberto Vasconcellos</h3>
        </Row>
        <Row style={{ paddingLeft: '60px' }}>
          <Row style={{ paddingLeft: "10px" }}>
            <Col style={{ width: '10%', display: 'inline-block' }}>
              <p style={{ fontWeight: 'bold' }}>Altere o SetPoint: </p>
            </Col>
            <Col style={{ width: '20%', display: 'inline-block' }}>
              <input
                type="text"
                onChange={e => this.setState({ setPoint: e.target.value })}
                style={
                  {
                    width: "100px",
                    marginRight:'10px',
                    borderWidth: 0,
                    borderBottomWidth: '1px',
                    borderColor: 'black',
                    background: 'none',
                    marginLeft: '8px',
                    fontSize: '15px'
                  }
                }
              />
              <button 
                onClick={() => this.sendSetPoint(this.state.setPoint)}
                style={
                  {
                    backgroundColor: 'black',
                    color: '#fff',
                    textShadow: '0px 1px 0px #528009',
                    width: '60px',
                    height: '25px',
                    fontSize: '12px'
                  }
                }
              >
                Enviar
              </button>
            </Col>
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
                    <TableCell style={{ fontWeight: 'bold', fontSize: 15 }} align="center">Server ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: 15 }} align="center">SetPoint</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: 15 }} align="center">Temperatura</TableCell>
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
            <Col style={{ width: '50%', display: 'inline-block' }}>
              <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold'  }}>Escravo 1</p>
              <Chart 
                valueSlave={this.state.valueFirst}
              />
            </Col>
            <Col style={{ width: '50%', display: 'inline-block' }}>
              <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Escravo 2</p>
              <Chart 
                valueSlave={this.state.valueSecond}
              />
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}

export default App;