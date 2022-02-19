import Speech2Text from "./Speech2Text"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Speech2Text></Speech2Text>
    </div>
  );
}

function voiceInput(curContent, setCurContent, results){
  setCurContent(curContent+results[results.length-1].transcript);
}

export default App;



