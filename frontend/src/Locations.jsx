import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Link from "next/link";
import { useState, useEffect } from "react";  
import { sanityFetch } from "./sanity";

export default async function Locations() {
    const LOCATION_QUERY = `*[_type == "location"]{name, address,image,mapUrl}`;

    const [locations, setLocations] = useState([]);
      
    // useEffect(() => {
    //   const fetchLocations = async () => {
    //     const fetchedLocations = await sanityFetch({ query: LOCATION_QUERY });
    //     setLocations(fetchedLocations);
    //   };
    //   fetchLocations();
    // }, []);
  return (
    <>  
    <h2>Locator</h2>    

    <div>

    </div>


 
      </>
    
  )
}


