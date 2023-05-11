import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Footer from './Footer';
import Search from './Search';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  if (array) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Cuvee',
  },
  {
    id: 'producer',
    numeric: true,
    disablePadding: false,
    label: 'Producer',
  },
  {
    id: 'frontline',
    numeric: true,
    disablePadding: false,
    label: 'Frontline',
  },
  {
    id: 'discount',
    numeric: true,
    disablePadding: false,
    label: 'Discount',
  },
  {
    id: 'country',
    numeric: true,
    disablePadding: false,
    label: 'Country',
  },
  {
    id: 'region',
    numeric: true,
    disablePadding: false,
    label: 'Region',
  },
  {
    id: 'sub_region',
    numeric: true,
    disablePadding: false,
    label: 'Sub Region',
  },
  {
    id: 'varietals',
    numeric: true,
    disablePadding: false,
    label: 'Varietals',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// function EnhancedTableToolbar(props) {
//   const { numSelected } = props;

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: (theme) =>
//             alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography
//           sx={{ flex: '1 1 100%' }}
//           color="inherit"
//           variant="subtitle1"
//           component="div"
//         >
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Typography
//           sx={{ flex: '1 1 100%' }}
//           variant="h6"
//           id="tableTitle"
//           component="div"
//         >
//           Nutrition
//         </Typography>
//       )}

//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton>
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title="Filter list">
//           <IconButton>
//             <FilterListIcon />
//           </IconButton>
//         </Tooltip>
//       )}
//     </Toolbar>
//   );
// }

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('producer');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [wines, setWines] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [tableValue, setTableValue] = useState('producer')


  useEffect(() => {
    const getWines = async () => {
      try {
        const response = await axios.get(`/wines?${tableValue}=${searchValue}`)
        setWines(response.data.filter(wine => wine.is_active === true))
        console.log(`/wines?${tableValue}=${searchValue}`)
      } catch (error) {
        console.log(error)
      }
    }
    getWines()
    console.log('search value: ' + searchValue)
    console.log('table value: ' + tableValue)
  }, [searchValue, tableValue])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelected = rows.map((n) => n.name);
  //     setSelected(newSelected);
  //     return;
  //   }
  //   setSelected([]);
  // };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1),
  //     );
  //   }

  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(wines, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [wines, order, orderBy, page, rowsPerPage],
  );

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='small'
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                // onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={wines.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      {/* <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell> */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      // padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.producer}</TableCell>
                      <TableCell align="right">{row.frontline}</TableCell>
                      <TableCell align="right">{row.discount}</TableCell>
                      <TableCell align="right">{row.country}</TableCell>
                      <TableCell align="right">{row.region}</TableCell>
                      <TableCell align="right">{row.sub_region}</TableCell>
                      <TableCell align="right">{row.varietals}</TableCell>
                    </TableRow>
                  );
                })}
                {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={wines.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
      </Box>
      <Search callback={(searchValue, tableValue) => {
        setTableValue(tableValue)
        setSearchValue(searchValue)
      }} />
      <Footer />
    </>
  );
}


// import * as React from 'react';
// import { useState, useEffect } from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { TableVirtuoso } from 'react-virtuoso';
// import axios from 'axios';
// import Footer from './Footer';
// import Search from './Search';

// const columns = [
//   {
//     width: 150,
//     label: 'Producer',
//     dataKey: 'producer',
//   },
//   {
//     width: 300,
//     label: 'Cuv\u00E9e',
//     dataKey: 'name',
//   },
//   {
//     width: 60,
//     label: 'Frontline',
//     dataKey: 'frontline',
//   },
//   {
//     width: 60,
//     label: 'Discount',
//     dataKey: 'discount',
//   },
//   {
//     width: 80,
//     label: 'Country',
//     dataKey: 'country',
//   },
//   {
//     width: 80,
//     label: 'Region',
//     dataKey: 'region',
//   },
//   {
//     width: 80,
//     label: 'Sub Region',
//     dataKey: 'subregion',
//   },
//   {
//     width: 180,
//     label: 'Varietals',
//     dataKey: 'varietals',
//   }
// ];

// const VirtuosoTableComponents = {
//   Scroller: React.forwardRef((props, ref) => (
//     <TableContainer component={Paper} {...props} ref={ref} />
//   )),
//   Table: (props) => (
//     <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
//   ),
//   TableHead,
//   TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
//   TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
// };

// function fixedHeaderContent() {
//   return (
//     <TableRow>
//       {columns.map((column) => (
//         <TableCell
//           key={column.dataKey}
//           variant="head"
//           align={column.numeric || false ? 'right' : 'left'}
//           style={{ width: column.width }}
//           sx={{
//             backgroundColor: 'background.paper',
//           }}
//         >
//           {column.label}
//         </TableCell>
//       ))}
//     </TableRow>
//   );
// }

// function rowContent(_index, row) {
//   return (
//     <React.Fragment>
//       {columns.map((column) => (
//         <TableCell style={row.low_stock ? { color: 'red' } : { color: 'black' }}
//           key={column.dataKey}
//           align={column.numeric || false ? 'right' : 'left'}
//         >
//           {row[column.dataKey]}
//         </TableCell>
//       ))
//       }
//     </React.Fragment >
//   );
// }

// export default function ReactVirtualizedTable() {
//   const [wines, setWines] = useState(null)
//   const [searchValue, setSearchValue] = useState('')
//   console.log('searchvalue', searchValue)
//   useEffect(() => {
//     const getWines = async () => {
//       try {
//         const response = await axios.get('/wines');
//         console.log(response.data)
//         if (searchValue != '') {
//           const regEx = new RegExp(searchValue, 'i')
//           const w = response.data.filter(res => regEx.test(res.name) || regEx.test(res.producer) || regEx.test(res.country) || regEx.test(res.varietals))
//           setWines(w.filter(wine => wine.is_active === true))
//         } else {
//           setWines(response.data.filter(wine => wine.is_active === true))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getWines()
//   }, [searchValue])

//   return (
//     <>
//       <Paper style={{ height: '75vh', width: '100%' }}>
//         <TableVirtuoso
//           data={wines}
//           components={VirtuosoTableComponents}
//           fixedHeaderContent={fixedHeaderContent}
//           itemContent={rowContent}
//         />
//       </Paper>
//       <Search callback={(searchValue) => setSearchValue(searchValue)} />
//       <Footer />
//     </>
//   );
// }

// import * as React from 'react';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

// export default function BasicTable() {
//   const [wines, setWines] = useState(null)
//   useEffect(() => {
//     const getWines = async () => {
//       try {
//         const response = await axios.get('/wines');
//         console.log(response.data)
//         setWines(response.data.filter(wine => wine.is_active === true))
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getWines()
//   }, [])
//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Dessert (100g serving)</TableCell>
//             <TableCell>Calories</TableCell>
//             <TableCell>Fat&nbsp;(g)</TableCell>
//             <TableCell>Carbs&nbsp;(g)</TableCell>
//             <TableCell>Protein&nbsp;(g)</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {wines ? wines.map((row) => (
//             <TableRow
//               key={row.id}
//               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//             >
//               <TableCell component="th" scope="row">
//                 {row.producer}
//               </TableCell>
//               <TableCell>{row.name}</TableCell>
//               <TableCell>{row.country}</TableCell>
//               <TableCell>{row.region}</TableCell>
//               <TableCell>{row.sub_region}</TableCell>
//             </TableRow>
//           )) : 'loading'}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }