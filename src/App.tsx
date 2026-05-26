import { BrowserRouter } from "react-router-dom";
import { AppContent } from "./content/AppContent";
import { routerBasename } from "./env";

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
