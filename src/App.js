import {useEffect, useState} from "react";
import axios from "axios";
import './App.css';


function App() {
  const[motivo, setMotivo] = useState("");
  const[title, setTitle] = useState("");
  const[file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);

  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files");
    console.log(result.data.data);
    setAllImage(result.data.data);
  };

  useEffect(() => {

    getPdf();

  }, []);


  const submitImage = async(e) => {
    e.preventDefault(); 
    const formData = new FormData(); 
    formData.append("title", title); 
    formData.append("file", file); 
    console.log(title, file);
    const result = await axios.post(
      "http://localhost:5000/upload-files", 
      formData, {
      header: {"Content-Type": "multipart/form-data"},
      }
    );
  
    console.log(result);

    if(result.data.status === "ok"){
      alert("PDF subido com sucesso");
      getPdf();
    }
  
  };

  const showPdf=(pdf)=>{
    window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
  }

  return (
    <div className="Main">

      <form className="formUpload" onSubmit={submitImage}>

        <h4>Leitor de PDF</h4>
        <br></br>
        <input type="text" className="formInputs" placeholder="Título" required onChange={(e)=>setTitle(e.target.value)}/>
        <br></br>
        <input type="file" className="formInputs" accept="application/pdf" required onChange={(e)=>setFile(e.target.files[0])}/>
        <br></br>
        <button class="btn" type="submit">
        Enviar
        </button>

      </form>

      <div className = "saida">

        <h4>Saída:</h4>

        <div className="output-div">
          {allImage == null
          ?""
          : allImage.map((data)=>{
            return (
              <div className="output-inner-div">
              <h6>Título: {data.title}</h6>
              <button className="btn btn-primary" onClick={()=>showPdf(data.pdf)}>Mostrar PDF</button>
              <button className="btn btn-secondary" style = {{ marginTop: '10px'}}>Converter Documento</button>
              </div>
            );
          })}

        </div>
      </div>

      
  <div className="textBox" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

    <h4 style={{ margin: '0 0 5px 0', textAlign: 'center' }}>Teste</h4>

    <textarea
      name="motivo"
      value={motivo}
      style={{ width: '400%', boxSizing: 'border-box' }}
    ></textarea>

  </div>









    </div>
  );
}

export default App;
