import React, { useState, useEffect } from "react";

const Search = ({ callback }) => {
    const [searchWines, setSearchWines] = useState('')
    const [table, setTable] = useState('Producer')
    const handleSubmit = (e) => {
        e.preventDefault()
        callback(searchWines, table)
    }
    return (
        <form className="searchBar" onChange={handleSubmit} onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                placeholder='Search...'
                className="searchBarInput"
                value={searchWines}
                onChange={(e) => setSearchWines(e.target.value)} />
            <select name="value" id="" onChange={(e) => setTable(e.target.value)}>
                <option value="producer">Producer</option>
                <option value="country">Country</option>
                <option value="varietal">Varietal</option>
            </select>
        </form>
    )
}

export default Search

