import MainApp from "./MainApp";
import { Toaster } from "sonner";
import "./styles/globals.css";

function App() {
  return (
    <>
      <MainApp />
      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </>
  );
}

export default App;
