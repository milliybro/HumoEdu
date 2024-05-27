import "./loading.scss";
import loading from "../../assets/portfolio-loading.png";
const Loading = () => {
  return (
    <div id="nima" className="loadingAuth">
      <div className="loading-image">
         <img src={loading} alt="" />
      </div>
      <div className="loading-text">
         <div className="first">
            <span>M</span>
            <span>i</span>
            <span>l</span>
            <span>l</span>
            <span>i</span>
            <span>y</span>
            <span>B</span>
            <span>r</span>
            <span>o'</span>
            <span>s</span>
         </div>
         <div className="second">
            <span>P</span>
            <span>o</span>
            <span>r</span>
            <span>t</span>
            <span>f</span>
            <span>o</span>
            <span>l</span>
            <span>i</span>
            <span>o</span>
         </div>

      </div>
   </div>
  );
};

export default Loading;
