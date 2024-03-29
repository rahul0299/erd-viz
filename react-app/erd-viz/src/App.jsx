import './App.css'
import Panel from './components/Panel'
import Diagram from "./components/DiagramWrapper.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";
import Editor from "./components/Editor/Editor.jsx";
import Palette from "./components/Palette/Palette.jsx";
import DiagramWrapper from "./components/DiagramWrapper.jsx";

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
    <Palette />
    <DiagramWrapper />
    {/*<div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>*/}
    {/*  <Editor />*/}
    {/*</div>*/}
    <CodeButton />
  </div>
}

export default App
