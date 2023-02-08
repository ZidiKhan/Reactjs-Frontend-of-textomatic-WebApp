import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import axios from 'axios';
import { axiosInstance } from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Datacleaning = () => {

    const [file, setFile] = useState();
    const [opts,setOpts]=useState([]);
    const [pathslist,setPathslist]=useState([])// to store resultant paths
    const [locallist,setLocallist]=useState(pathslist)// to render the above path list by using useEffect
    const [filepath, setFilepath] = useState("");
    const [fileName, setFileName] = useState("");
     const [isLoading, setIsLoading] = useState(false);
    let p='';
 

    //toast appearance
    // toast.success("Great Success !", {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });
    //upload file
    const UploadNow=async()=>{
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      try {
        const res= await axiosInstance.post("/Datacleaning/upload",formData)
        p = res.data.toString();
        p=p.replace(/(\r\n|\n|\r)/gm, "");
        p=p.replace(/\\/g, '/');
        console.log("response was :",p);
        toast('File uploaded succesfully');
        setFilepath(p)

      } catch (ex) {
        console.log(ex);
      }
    }
    const saveFile = async(e) => {
       setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
       
      
      };
      const handleCheckboxChange=(e)=>{
            if(e.target.checked){
              setOpts([...opts, e.target.value]);
            
            }
            else{
              setOpts(opts.filter((item) => item !== e.target.value));
             
            }
            console.log(opts)
      }
      //upload to serveer
      const Apply = async (e) => {
        setIsLoading(true);
       opts.forEach((item) => {
          console.log(item)
          console.log("file path is ",filepath)
        
          try {
            axiosInstance.post("/Datacleaning/upload/"+item+"?param1="+ filepath.replace(/\\/g, '/')).then(
              res=>{ p = res.data.toString();
                console.log("aya"+res.data)
               p=p.replace(/(\r\n|\n|\r)/gm, "");
          
            setPathslist(prevList => [...prevList, {  [item]: p }])
          //  setPathslist({ ...pathslist, [item]: p });
          }
            )         
          } catch (ex) {
            console.log(ex);
            setFilepath(ex)
          }
        });      
        setIsLoading(false);
       
      };
      
      const handleDownload = async (e) => {
        let downloadpath=e.target.value;
        
        axios({
          url: 'http://localhost:8081/server/download',
          method: 'GET',
          params: { downloadpath },
          responseType: 'blob',
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          let name= e.target.value.toString() + ".csv"
          link.setAttribute('download', name);
          document.body.appendChild(link);
          link.click();
        });

      };
      useEffect(()=>{
          setLocallist(pathslist)
          setIsLoading(false)
      },[pathslist,isLoading])

  return (
    <>
  {isLoading ? <div className='load'><div>Processing...</div></div> 
  
  :<div>
  <div className='container text-black mb-5 text-center'>
    <br/>
    <br/>
    <br/>
   
    <ToastContainer />

    <h3 className='text-center mt-4 mb-5'>Data Cleaner</h3>
    <div className='bordergraylight text-center'>
    <div>
    <input type="file" onChange={saveFile} />
    <button disabled={!file} className="btn btn-outline-primary rounded-pill px-5" onClick={UploadNow}>Upload</button>   
    </div>
    <div className='row m-2'>
      <div className='col-sm-4 col-md-3'>
      <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                        <input type="checkbox" aria-label="Checkbox for following text input" value="binary"
                        onChange={(e)=>handleCheckboxChange(e)} />
                   </div>
                  </div>
                  <label  className="form-control" aria-label="Text input with checkbox"> Apply Binary</label>
               
            </div>
      </div>
      <div className='col-sm-4 col-md-3'>
      <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                        <input type="checkbox" aria-label="Checkbox for following text input"
                        value="entropy"
                        onChange={(e)=>handleCheckboxChange(e)} />
                   </div>
                  </div>
                  <label  className="form-control" aria-label="Text input with checkbox">Entropy</label>
               
            </div>
      </div>

      <div className='col-sm-4 col-md-3'>
      <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                        <input type="checkbox" aria-label="Checkbox for following text input" 
                          value="tfc"
                          onChange={(e)=>handleCheckboxChange(e)}
                        />
                   </div>
                  </div>
                  <label  className="form-control" aria-label="Text input with checkbox"> TFC</label>
               
            </div>
      </div>

      <div className='col-sm-4 col-md-3'>
      <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                        <input type="checkbox" aria-label="Checkbox for following text input" 
                          value="LTC"
                          onChange={(e)=>handleCheckboxChange(e)}
                        />
                   </div>
                  </div>
                  <label  className="form-control" aria-label="Text input with checkbox">LTC</label>
               
            </div>
      </div>
      <div className='col-sm-4 col-md-3 '>
      <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                        <input type="checkbox" aria-label="Checkbox for following text input"
                        value="tfidf"
                        onChange={(e)=>handleCheckboxChange(e)} />
                   </div>
                  </div>
                  <label  className="form-control" aria-label="Text input with checkbox">TFIDF</label>
               
            </div>
      </div>
    </div>

    <button disabled={opts.length === 0 || isLoading===true}  className="btn btn-outline-primary rounded-pill px-5"  onClick={Apply}>Apply</button>    
    
    

         <div className='row m-2'>
         
         { locallist.map((item) => {
              let k = Object.keys(item)[0];
              let value = item[k];
       
          if (k==="entropy") {
          return <div key={k} className="col-sm-4 col-md-3 py-5 text-center">
            <h3 className='text-center'>Result of {k}</h3>
            <div> {value}</div>
            </div>
        } 
        else {
          return <div key={k} className="col-sm-4 col-md-3 py-5 text-center">
          <h3 className='text-center'>Result of {k}</h3>
           <div>
           <button className='btn btn-success rounded-pill px-5' 
            onClick={(e)=>handleDownload(e)} 
            value={value}
            key={k} 
            >{k} Result</button>
            </div> 
          </div>
        }
        })}
                 
         </div> 

    </div>
    </div>  
    <div className='container text-black mb-5 text-center'>
    <br/>
    <br/>
    <br/>
    <ToastContainer />

    <h3 className='text-center mt-4 mb-5'>Techniques</h3>
    
    <div className='container'>
  

  <div className=' row mx-auto bordergraylight bg-blue'>
      <div className='col-sm-8'>
          <h3 style={{textAlign: 'left', margin: '20px', padding: '10px'}}>Apply Binary</h3>
          
      <ul style={{listStyleType: 'disc', textAlign: 'justify'}}>
        <li>What: Binary encoding is a technique used to convert categorical variables with multiple levels into binary variables. Each level is assigned a binary value (0 or 1) and a new binary variable is created for each level.</li>
        <li>Why: This can be useful for reducing the dimensionality of a dataset and making it more interpretable.</li>
        <li>When: Binary encoding is typically used when working with categorical variables that have multiple levels and you want to reduce the dimensionality of the data or make it more interpretable.</li>
     
      </ul>
      </div>
    
  </div>

  <div className=' row mx-auto bordergraylight bg-green'>
      <div className='col-sm-8'>
          <h3 style={{textAlign: 'left', margin: '20px', padding: '10px'}}>Entropy</h3>
          <ul style={{listStyleType: 'disc', textAlign: 'justify'}}>
          <li>What: Entropy encoding is a technique used to encode categorical variables by calculating the entropy (a measure of disorder or randomness) of the variable's levels.</li>
          <li>Why: Entropy encoding can be useful for reducing the dimensionality of a dataset and making it more interpretable.</li>
          <li>When: Entropy encoding is typically used when working with categorical variables that have multiple levels and you want to reduce the dimensionality of the data or make it more interpretable.</li>
          </ul>
      </div>
     
  </div>

  <div className=' row mx-auto bordergraylight bg-orange'>
      <div className='col-sm-8'>
          <h3 style={{textAlign: 'left', margin: '20px', padding: '10px'}}>TFC</h3>
          <ul style={{listStyleType: 'disc', textAlign: 'justify'}}>
          <li>What: TFC is a technique used to convert a set of text documents into numerical values by assigning a weight to each term based on its frequency in the document and the inverse frequency of the term across all documents in the dataset.</li>
          <li>Why: It is commonly used for text classification and information retrieval tasks.</li>
          <li>When: TFC is typically used when working with text data and you want to convert the text data into numerical values for further analysis.</li>
          </ul>
      </div>
     
  </div>

  <div className=' row mx-auto bordergraylight bg-purple'>
      <div className='col-sm-8'>
          <h3  style={{textAlign: 'left', margin: '20px', padding: '10px'}}>LTC</h3>
          <ul style={{listStyleType: 'disc', textAlign: 'justify'}}>
          <li>What: LTC is a technique used to extract co-occurrences of terms in a text document. It counts the number of times two terms appear together in a window of a fixed size around a given word.</li>
          <li>Why: LTC can be used for text classification, clustering, and information retrieval tasks.</li>
          <li>When: LTC is typically used when working with text data and you want to extract co-occurrences of terms in the text documents.</li>
          </ul>
      </div>
     
  </div>

  <div className=' row mx-auto bordergraylight bg-yellow'>
      <div className='col-sm-8'>
          <h3  style={{textAlign: 'left', margin: '20px', padding: '10px'}}>TFIDF</h3>
          <ul style={{listStyleType: 'disc', textAlign: 'justify'}}>
        <li>What: TF-IDF is a technique used to convert a set of text documents into numerical values by assigning a weight to each term based on its frequency in the document and the inverse frequency of the term across all documents in the dataset.</li>
        <li>Why: It is commonly used for text classification, information retrieval, and document similarity tasks.</li>
        <li>When: TF-IDF is typically used when working with text data and you want to convert the text data into numerical values for further analysis.</li>
          </ul>
      </div>
     
  </div>
         </div> 

         </div> 
         </div>
      }

    </>
    
  )
}
