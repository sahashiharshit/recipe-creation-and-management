
import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="back-home-link">Go Back Home</a>
    </div>
  );
};

export default NotFound;
