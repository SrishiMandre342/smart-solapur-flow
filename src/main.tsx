import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedParkingZonesOnce } from "@/firebase/seedParkingZones";

seedParkingZonesOnce();

createRoot(document.getElementById("root")!).render(<App />);
