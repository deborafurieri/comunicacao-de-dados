import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#000',
    color: '#fff',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#fff',
    },
  },
}))(TableRow);

const CustomizedTables = (props) => {

  return (
    <TableBody>
      <StyledTableRow>
        <StyledTableCell align="right">{props.slaveId}</StyledTableCell>
        <StyledTableCell align="right">{props.setPoint}</StyledTableCell>
        <StyledTableCell align="right">{props.value}</StyledTableCell> 
      </StyledTableRow>
    </TableBody>
  );
}

export default CustomizedTables;