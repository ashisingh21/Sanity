import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Locations from './Locations'
import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import Button from '@mui/material/Button'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {useState, useEffect} from 'react'
import {sanityFetch, urlFor} from './sanity'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import groq from 'groq'
import AccordionComp from './AccordionComp'
import {set} from 'sanity'
import CircularProgress from '@mui/material/CircularProgress'

function App() {

  // all locations
  const [locations, setLocations] = useState([])

  // search state and city
  const [searchState, setSearchState] = useState('All')
  const [searchCity, setSearchCity] = useState('All')

 
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  // define the number of items per page
  const perPage = 2

  const [loading, setLoading] = useState(false)

  // for dropdown items
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  // first and last id of the fetched locations
  const [lastId, setLastId] = useState(null)
  const [firstId, setFirstId] = useState(null)

  // additional query for filtering
  const [additionalQuery, setAdditionalQuery] = useState('')

  const handleTotalNumberOfPageSet = async () => {
  
    const LOCATION_QUERY_All = `count(*[_type == "location" ${additionalQuery}])`

    const fetchedLocationsAll = await sanityFetch({query: LOCATION_QUERY_All})
 
    setTotalPage(Math.ceil(fetchedLocationsAll / perPage))
    setPage(1)
  }

  useEffect(() => {
    handleTotalNumberOfPageSet()
  }, [additionalQuery])

  const handleSetNewLocations = async (fetchedLocations) => {
    setLoading(true)
    setLocations(fetchedLocations)
    setFirstId(fetchedLocations[0]._id)
    setLastId(fetchedLocations[fetchedLocations.length - 1]._id)
    setLoading(false)
  }

  const handleAllStateChange = async () => {
    setLoading(true)
    const LOCATION_QUERY = `*[_type == "location"] | order(_id asc)[0...${perPage}]`
    const fetchedLocations = await sanityFetch({query: LOCATION_QUERY})
    setAdditionalQuery('')
    setSearchCity('All')
    setSearchState('All')
    handleSetNewLocations(fetchedLocations)
    setLoading(false)

  }

  const handleStateChange = async (state) => {

    setLoading(true)
    const LOCATION_QUERY = `*[_type == "location" && state == "${state}"] | order(_id asc)[0...${perPage}]`
    setAdditionalQuery(`&& state == "${state}"`)
    const fetchedLocations = await sanityFetch({query: LOCATION_QUERY})
    const cities = new Set(fetchedLocations.map((location) => location.city))
    setCities(Array.from(cities))
    handleSetNewLocations(fetchedLocations)
    setSearchState(state)
    
    setLoading(false)
  }


  const handleAllCityChange = async () => {
    const LOCATION_QUERY = `*[_type == "location" && state == "${searchState}"] | order(_id asc)[0...${perPage}]`
    const fetchedLocations = await sanityFetch({query: LOCATION_QUERY})
    handleSetNewLocations(fetchedLocations)
    setAdditionalQuery(`&& state == "${searchState}"`)  
    setSearchCity('All')
  }


  const handleCityChange = async (city) => {
    setLoading(true)
    const LOCATION_QUERY = `*[_type == "location" && city == "${city}"]`
    setAdditionalQuery(`&& city == "${city}"`)
    const fetchedLocations = await sanityFetch({query: LOCATION_QUERY})
    handleSetNewLocations(fetchedLocations)
    setSearchCity(city)
    setLoading(false)
  }

  const fetchPreviousPage = async () => {
    setLoading(true)
    if (page === 1) {
      alert('Already on the first page!')
      return
    }

    const previousPage = page - 1
    const offset = (previousPage - 1) * perPage

    const LOCATION_QUERY = groq`*[_type == "location" ${additionalQuery}] | order(_id asc) [${offset}...${offset + perPage}] {
      _id, name, address, city, state, mapUrl, image, zomato, swiggy, contact, state, timings, createdAt
    }`

    try {
      const fetchedLocations = await sanityFetch({query: LOCATION_QUERY})
      if (fetchedLocations.length === 0) {
        alert('No more locations to fetch')
        return
      }
      setPage(previousPage)
      setLocations(fetchedLocations)
    } catch (error) {
      console.error('Error fetching previous page:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNextPage = async () => {
    setLoading(true)
    const nextPage = page + 1
    const offset = (nextPage - 1) * perPage
    const LOCATION_QUERY = groq`*[_type == "location" ${additionalQuery}] | order(_id asc) [${offset}...${offset + perPage}] {
      _id, name, address, city, state, mapUrl, image, zomato, swiggy, contact, state, timings, createdAt
    }`
    try {
      const fetchedLocations = await sanityFetch({query: LOCATION_QUERY})
      if (fetchedLocations.length === 0) {
        alert('No more locations to fetch')
        return
      }
      setPage(nextPage)
      setLocations(fetchedLocations)
    } catch (error) {
      console.error('Error fetching next page:', error)
    } finally {
      setLoading(false)
    }
  }


  // useEffect(() => {
  //   handleTotalNumberOfPageSet()
  // }, [ searchState, searchCity, page])


  useEffect(() => {
    const LOCATION_QUERY = `*[_type == "location"] | order(_id asc)[0...${perPage}]`
    const fetchAllLocations = async () => {
      setLoading(true)
      const fetchedLocations = await sanityFetch({query: LOCATION_QUERY})
      handleSetNewLocations(fetchedLocations)

      const LOCATION_QUERY_All = `count(*[_type == "location" ${additionalQuery}])`
      const fetchedLocationsAll = await sanityFetch({query: LOCATION_QUERY_All})
      setTotalPage(Math.ceil(fetchedLocationsAll / perPage))
      const states = new Set(fetchedLocations.map((location) => location.state))
      setStates(Array.from(states))
      setLoading(false)
    }
    fetchAllLocations()
  }, [])



  return (
    <>
      <h1>Locators</h1>
      <div style={{display: 'flex'}}>
        <TextField
          select
          size="small"
          sx={{my: 2, width: '90%', backgroundColor: '#f5f5f5', textAlign: 'left'}}
          id="outlined-basic"
          label="Search for State"
          value={searchState}
          variant="outlined"
        >
          <MenuItem value={"All"} onClick={() => handleAllStateChange()}>All</MenuItem>
          {states &&
            states.map((option, index) => (
              <MenuItem onClick={() => handleStateChange(option)} key={index} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          disabled={!searchState || searchState === 'All'}
          select
          value={searchCity}
          size="small"
          sx={{mx: 2, my: 2, width: '90%', backgroundColor: '#f5f5f5', textAlign: 'left'}}
          id="outlined-basic"
          label="Search for City"
          variant="outlined"
        >
          <MenuItem value={"All"} onClick={() => handleAllCityChange()}>All</MenuItem>
          {cities &&
            cities.map((option, index) => (
              <MenuItem onClick={() => handleCityChange(option)} key={index} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
      </div>

      {loading && (
        <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', padding: '80px 0'}}>
          <CircularProgress />
        </Box>
      )}

      <div style={{textAlign: 'left'}}>
        {locations &&
          !loading &&
          locations.map((location, index) => (
            <Accordion key={index} style={{background: '#F5F5F5 ', marginBottom: '20px'}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <div style={{display: 'flex'}}>
               
                  <div>
                    <p style={{fontWeight: 'bold', marginBottom: '8px'}}>
                      {location.name} | {location?.state} ( {location?.city}){' '}
                    </p>
                    Timings : {location.timings}
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>{location.address}</AccordionDetails>
              <AccordionActions>
                <Button
                  target="_blank"
                  size="small"
                  href={location.zomato}
                  variant="contained"
                  color="error"
                >
                  Zomato
                </Button>
                <Button
                  target="_blank"
                  size="small"
                  href={location.swiggy}
                  variant="contained"
                  color="secondary"
                >
                  Swiggy
                </Button>
                <Button
                  rel="tel"
                  size="small"
                  href={`tel:+91${location.contact}`}
                  variant="contained"
                  color="primary"
                >
                  Call Us
                </Button>
                <Button target="_blank" href={location.mapUrl} variant="contained" color="success">
                  Get Direction
                </Button>
              </AccordionActions>
            </Accordion>
          ))}

        {!loading && (
          <>
            {' '}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button
                disabled={page == 1}
                variant="contained"
                color="success"
                onClick={fetchPreviousPage}
              >
                Fetch Previous Page
              </Button>
              <p>
                Page {page} of {totalPage} Pages
              </p>
              <Button
                disabled={page == totalPage}
                variant="contained"
                color="success"
                onClick={fetchNextPage}
              >
                Fetch Next Page
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
