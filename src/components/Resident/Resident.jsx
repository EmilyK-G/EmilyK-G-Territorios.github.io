import React, { useEffect, useState } from 'react'
import { colRef } from '../../firebase';
import { 
    getDocs,
    addDoc
} from "firebase/firestore";
import ResidentDetails from '../ResidentDetails/ResidentDetails';
import PreviewBtn from '../PreviewBtn/PreviewBtn';
import "./Resident.css";

function Resident(props) {
    const [preview, setPreview] = useState(false);
    const [newResArray, setNewResArray] = useState([]);
    const [house, setHouse] = useState("");
    const [addResident, setAddResident] = useState(false);
    const [phoneArray, setPhoneArray] = useState([]); //From Resident Details
    const [addHouseAlert, setAddHouseAlert] = useState(false);
    const residents = {
        Street: "",
        Resident: [],
        House: "",
        Territory: ""
    };
    
    useEffect(()=>{
         //get collection data
         getDocs(colRef).then( (snapshot) => {
         let addresses = []
         snapshot.docs.forEach((doc)=> {
             addresses.push({ ...doc.data(), id: doc.id })
         })
        //  console.log(addresses)
         })
         .catch(err => {
            console.log(err.message)
         })
     }, [])
    
    function handleSubmitClick() {
      residents.Street = props.street; //from App.js
      residents.House = document.querySelector('.add_house_js').value;
      residents.Resident = newResArray;
      residents.Territory = props.terrSelected;
      addDoc(colRef, residents)
      .then(() => {
        document.querySelector('.resident_form_js').reset();
        setNewResArray([]);
      })
      .catch(e => console.log(e.message));
      setAddHouseAlert(false);
      setHouse("")
    }

    function handleEnterKey(e) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    }

  return (
      <>
        <form className="resident_form_js">
            <div className="form-group">
              <label htmlFor="formHouseNumber">House Number</label>
              <input 
                type="text" 
                onChange={e => setHouse(e.target.value)} 
                className="form-control add_house_js" 
                name="HouseNumber" 
                id="formHouseNumber" 
                placeholder="Ex. 144"
                onKeyPress={(e)=>handleEnterKey(e)}
                required />
            </div>
            <div className="form-group">
              {addResident ? <ResidentDetails setNewResArray={setNewResArray} setPhoneArray={setPhoneArray} phoneArray={phoneArray}/> : 
                <div className="form-group col-auto my-1">
                  {addHouseAlert ? <p className="add_house_alert">Add a House Number</p> : ""}
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {(house === "") ? setAddHouseAlert(true) : setAddResident(true)}}>
                      New Resident List
                  </button>
              </div>}  
            </div>
            {preview ? <PreviewBtn newResArray={newResArray} house={house} street={props.street} phoneArray={phoneArray}/> : "..." }
            <div className="col-auto my-1">
              <button 
                className={"btn" + (preview ? " btn-secondary" : " btn-info")} 
                type="button" 
                onClick={(e) => {
                    e.preventDefault()
                    setPreview(!preview);
                }}>
                    {(preview ? "Close preview" : "Preview")}
                </button>
            </div>
            <div className="col-auto my-1">
              <button 
                className="btn btn-success" 
                type="submit" 
                onClick={(e) => {
                    e.preventDefault()
                    handleSubmitClick()
                    setAddResident(false)
                    setPreview(false)
                }}>
                    Submit form
                </button>
            </div>
        </form>
      </>
  )
}

export default Resident