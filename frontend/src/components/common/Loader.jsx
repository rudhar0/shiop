import '../../styles/loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner"></div>
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
