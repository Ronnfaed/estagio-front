// Importa os hooks useEffect e useState do React.
import {useEffect, useState} from "react";

// Importa o axios para fazer requisições HTTP.
import axios from "axios";

// Importa o arquivo de estilos CSS.
import './App.css';

function App() {
  // Define o estado 'motivo' com o valor inicial como uma string vazia.
  const[motivo, setMotivo] = useState("");

  // Define o estado 'title' com o valor inicial como uma string vazia.
  const[title, setTitle] = useState("");

  // Define o estado 'file' com o valor inicial como uma string vazia.
  const[file, setFile] = useState("");

  // Define o estado 'allImage' com o valor inicial como null.
  const [allImage, setAllImage] = useState(null);

  // Função assíncrona para buscar PDFs do servidor.
  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files");
    console.log(result.data.data);
    // Atualiza o estado 'allImage' com os dados recebidos do servidor.
    setAllImage(result.data.data);
  };

  // useEffect que executa a função getPdf quando o componente é montado.
  useEffect(() => {
    getPdf();
  }, []);

  // Função assíncrona para enviar o arquivo PDF para o servidor.
  const submitImage = async(e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário.
    const formData = new FormData(); // Cria um novo objeto FormData.
    formData.append("title", title); // Adiciona o título ao FormData.
    formData.append("file", file); // Adiciona o arquivo ao FormData.
    console.log(title, file);

    // Envia o FormData para o servidor.
    const result = await axios.post(
      "http://localhost:5000/upload-files", 
      formData, {
      header: {"Content-Type": "multipart/form-data"},
      }
    );
  
    console.log(result);

    // Se o upload for bem-sucedido, exibe um alerta e atualiza a lista de PDFs.
    if(result.data.status === "ok"){
      alert("PDF subido com sucesso");
      getPdf();
    }
  };

  // Função para abrir o PDF em uma nova janela.
  const showPdf = (pdf) => {
    window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
  }

  return (
    <div className="Main">
      {/* Formulário para upload de arquivos */}
      <form className="formUpload" onSubmit={submitImage}>
        <h4>Leitor de PDF</h4>
        <br></br>
        <input type="text" className="formInputs" placeholder="Título" required onChange={(e)=>setTitle(e.target.value)}/>
        <br></br>
        <input type="file" className="formInputs" accept="application/pdf" required onChange={(e)=>setFile(e.target.files[0])}/>
        <br></br>
        <button className="btn" type="submit">Enviar</button>
      </form>

      {/* Seção de saída dos PDFs */}
      <div className="saida">
        <h4>Saída:</h4>
        <div className="output-div">
          {allImage == null
          ? ""
          : allImage.map((data)=>{
            return (
              <div className="output-inner-div">
                <h6>Título: {data.title}</h6>
                <button className="btn btn-primary" onClick={()=>showPdf(data.pdf)}>Mostrar PDF</button>
                <button className="btn btn-secondary" style={{ marginTop: '10px'}}>Converter Documento</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* TextBox para motivo */}
      <div className="textBox" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h4 style={{ margin: '0 0 5px 0', textAlign: 'center' }}>Teste</h4>
        <textarea
          name="motivo"
          value={motivo}
          style={{ width: '400%', boxSizing: 'border-box' }}
          onChange={(e) => setMotivo(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default App;
