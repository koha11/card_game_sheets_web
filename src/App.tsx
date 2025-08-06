import { Routes, Route, Link } from "react-router-dom";
import XiDach from "./pages/XiDach";

function Home() {
  return <h1>Home Page</h1>;
}

export default function App() {
  return (
    <div>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/tien-len">Tiến lên</Link>
        <Link to="/xi-dach">Xì Dách</Link>
      </nav>

      <Routes>
        <Route path="/tien-len" element={<Home />} />
        <Route path="/xi-dach" element={<XiDach />} />
      </Routes>
    </div>
  );
}
