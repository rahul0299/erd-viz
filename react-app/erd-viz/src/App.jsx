import './App.css'
import Panel from '../components/Panel'
import Diagram from "../components/Diagram.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";

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
    <Panel />
    <Diagram />
    <CodeButton />
  </div>
}

export default App
