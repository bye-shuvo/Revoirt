import { createBrowserRouter } from "react-router";
import Home from "../components/Home";
import App from "../components/App";

const router = createBrowserRouter([{
    path : "/" ,
    element : <Home />,
    children : [{
        path : "/app",
        element : <App />
    }]
}])

export default router ;