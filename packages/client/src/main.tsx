import { createRoot } from "react-dom/client";
import { Calendar } from "./Calendar";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/forma/theme.css";
import "@fullcalendar/react/themes/forma/palettes/blue.css";

createRoot(document.getElementById("root")!).render(<Calendar />);
