import "./loader.css";

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="loader mt-48">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Loader;
