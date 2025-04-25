import { Toaster } from "react-hot-toast";
import "./App.css";
import AllFunctionalProducts from "./components/AllFunctionalProducts";
function App() {
  return <div>
    <Toaster />
    {/* <ProductPage /> */}
    <AllFunctionalProducts />
  </div>;
}

export default App;
