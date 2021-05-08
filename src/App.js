import './App.css';
import Classifier from './components/ImageClassification/Classifier';

function App() {
  return (
    <div className="App">
      
      <div>OTHER STUFF</div>
      
      <Classifier height={224} width={224}></Classifier>
   
    </div>
  );
}

export default App;
