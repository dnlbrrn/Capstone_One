import { tab } from "@testing-library/user-event/dist/tab";
import React, { useState, useEffect } from "react";

const Search = ({ callback }) => {
    const [searchWines, setSearchWines] = useState('')
    const [table, setTable] = useState('producer')

    useEffect(() => {
        console.log(table)
        callback(searchWines, table)
    }, [searchWines])

    return (
        <form className="searchBar">
            <input
                style={{ marginRight: '10px' }}
                type="text"
                placeholder='Search...'
                className="form-control"
                onChange={(e) => setSearchWines(e.target.value)}
            />
            <select className="form-select form-select-sm" name="value" id="" onChange={(e) => setTable(e.target.value)}>
                <option value="producer">Producer</option>
                <option value="country">Country</option>
                <option value="varietal">Varietal</option>
            </select>
        </form>
    )
}

export default Search

