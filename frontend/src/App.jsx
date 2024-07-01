import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Locations from "./Locations";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { sanityFetch, urlFor } from "./sanity";

function App() {
  const [count, setCount] = useState(0);
  const LOCATION_QUERY = `*[_type == "location"]{name, address,image,mapUrl}`;

  const [locations, setLocations] = useState([]);

  useEffect(() => {
 
    const fetchLocations = async () => {
      const fetchedLocations = await sanityFetch({ query: LOCATION_QUERY });
      setLocations(fetchedLocations);
    };
    fetchLocations();
  }, []);
  return (
    <>
      <h1>Locators</h1>
      <div style={{textAlign:"left"}}>

        {locations.map((location,index) => (
          
          <Accordion key={index} style={{background:"#F5F5F5 ",marginBottom:"20px"}} >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <img style={{marginRight:"20px"}} src={urlFor(location.image).width(140).url()}></img>
            {location.name}
          </AccordionSummary>
          <AccordionDetails>
           {location.address}
          </AccordionDetails>
          <AccordionActions>
            <Button target="_blank" href={location.mapUrl} variant="contained" color="success">
              Get Direction
            </Button>
          </AccordionActions>
        </Accordion>
          
          
          ))}
   
      </div>
    </>
  );
}

export default App;
