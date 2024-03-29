import './App.css'
import Panel from '../components/Panel'
import Diagram from "../components/Diagram.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";
import Editor from "../components/Editor/Editor.jsx";

function Canvas() {
  return <div className='canvas'>Canvas</div>
}

function CodeButton() {
  return <div className="code-button">
    <FontAwesomeIcon icon={faCode} />
  </div>
}

function App() {

  return <div className='container'>
    <Diagram />
    <CodeButton />
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Editor />
    </div>
  </div>
}

export default App
