import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from './EnhancedTableHead';
import axios from 'axios';


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

async function myAsyncAndAwaitFunction() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("I waited 10 seconds before displaying using Async/Await"), 10000)
  });

  let result = await promise; // wait till the promise resolves (*)

  alert(result); // "done!"
}


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class App extends React.Component {
  constructor() {
    super()
    
    this.state = {
      order: 'asc',
      orderBy: 'episode',
      data: [],
      page: 0,
      rowsPerPage: 9,
    };
  }

  componentDidMount(){
    axios.get(`https://swapi.co/api/films`).then( results => {
      const movieData = results.data.results.map((movie, idx) => {
        return { id: idx, episode: movie.episode_id, title: movie.title, director: movie.director, producer: movie.producer, release: movie.release_date }
      })
      this.setState({ data: movieData })
    });

    let sortOrder = localStorage.getItem('sortOrder');
    if (sortOrder) {
      this.setState({ order: sortOrder })
    }else{
      this.setState({ order: 'asc' })
    }

    let sortOrderBy = localStorage.getItem('sortOrderBy');
    if (sortOrderBy) {
      this.setState({ orderBy: sortOrderBy })
    }else{
      this.setState({ orderBy: 'episode' })
    }


    myAsyncAndAwaitFunction();

  }


  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });

    localStorage.setItem('sortOrder', order)
    localStorage.setItem('sortOrderBy', orderBy)

  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <Typography>
          Star Wars Films
        </Typography>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow hover key={n.id}>
                      <TableCell numeric>{n.episode}</TableCell>
                      <TableCell>{n.title}</TableCell>
                      <TableCell>{n.director}</TableCell>
                      <TableCell>{n.producer}</TableCell>
                      <TableCell numeric>{n.release}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
