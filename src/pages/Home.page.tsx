import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Practice List</h1>
      <ul>
        <li>
          <Link to="/overlay">Overlay</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
