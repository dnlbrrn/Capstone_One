import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import axios from 'axios';
import Footer from './Footer';
import Search from './Search';

const columns = [
  {
    width: 200,
    label: 'Producer',
    dataKey: 'producer',
  },
  {
    width: 400,
    label: 'Cuv\u00E9e',
    dataKey: 'name',
  },
  {
    width: 60,
    label: 'Frontline',
    dataKey: 'frontline',
  },
  {
    width: 60,
    label: 'Discount',
    dataKey: 'discount',
  },
  {
    width: 80,
    label: 'Country',
    dataKey: 'country',
  },
  {
    width: 80,
    label: 'Region',
    dataKey: 'region',
  },
  {
    width: 80,
    label: 'Sub Region',
    dataKey: 'subregion',
  },
  {
    width: 180,
    label: 'Varietals',
    dataKey: 'varietals',
  }
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell style={row.low_stock ? { color: 'red' } : { color: 'black' }}
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))
      }
    </React.Fragment >
  );
}

export default function ReactVirtualizedTable() {
  const [wines, setWines] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  console.log('searchvalue', searchValue)
  useEffect(() => {
    const getWines = async () => {
      try {
        const response = await axios.get('/wines');
        console.log(response.data)
        if (searchValue != '') {
          const regEx = new RegExp(searchValue, 'i')
          const w = response.data.filter(res => regEx.test(res.name) || regEx.test(res.producer) || regEx.test(res.country) || regEx.test(res.varietals))
          setWines(w.filter(wine => wine.is_active === true))
        } else {
          setWines(response.data.filter(wine => wine.is_active === true))
        }
      } catch (error) {
        console.log(error)
      }
    }
    getWines()
  }, [searchValue])

  return (
    <>
      <Paper style={{ height: '80vh', width: '100%' }}>
        <TableVirtuoso
          data={wines}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
      <Search callback={(searchValue) => setSearchValue(searchValue)} />
      <Footer />
    </>
  );
}