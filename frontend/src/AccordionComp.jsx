import React from 'react'
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { sanityFetch, urlFor } from "./sanity";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
const AccordionComp = ({location}) => {
  return (
    <Accordion key={index} style={{background:"#F5F5F5 ",marginBottom:"20px"}} >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel3-content"
      id="panel3-header"
    >
      <div style={{display:"flex"}}>
      <img style={{marginRight:"20px"}} src={urlFor(location.image).width(140).url()}></img>

      <div >
 
     <p  style={{fontWeight:"bold",marginBottom:"8px"}}>{location.name} </p> 
      Timings : {location.timings}  
 </div>
     
      </div>
  
   
    </AccordionSummary>
    <AccordionDetails>
     {location.address}
    </AccordionDetails>
    <AccordionActions>
    <Button target="_blank" size="small" href={location.zomato} variant="contained" color="error">
        Zomato
      </Button>
      <Button target="_blank" size="small" href={location.swiggy} variant="contained" color="secondary">
        Swiggy
      </Button>
      <Button rel="tel" size="small" href={`tel:+91${location.contact}`} variant="contained" color="primary">
        Call Us
      </Button>
      <Button target="_blank" href={location.mapUrl} variant="contained" color="success">
       Get Direction
      </Button>
    </AccordionActions>
  </Accordion>
  )
}

export default AccordionComp
