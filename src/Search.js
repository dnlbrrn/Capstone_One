import React, { useState, useEffect } from "react";

const Search = ({ callback }) => {
    const [searchWines, setSearchWines] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        callback(searchWines)
    }
    return (
        <form className="searchBar" onChange={handleSubmit}>
            <input
                type="text"
                placeholder='Search...'
                className="searchBarInput"
                value={searchWines}
                onChange={(e) => setSearchWines(e.target.value)} />
        </form>
    )
}

export default Search

