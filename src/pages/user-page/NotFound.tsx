import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notfound">
      <img
        style={{
          marginTop: "-150px",
        }}
        src="https://cdn.svgator.com/images/2022/01/funny-404-error-page-design.gif"
        alt="notfound"
      />
      <div style={{ textAlign: "center", padding: "50px", marginTop: "-250px" }}>
        <h1 style={{marginBottom: "20px"}}>404 - Page Not Found</h1>
        <NavLink
          style={{
            marginTop: "50px",
            backgroundColor: "#ffc700",
            padding: "10px",
            color: "#000",
            fontWeight: "700",
            fontSize: "22px",
            borderRadius: "10px"
          }}
          to={"/"}
        >
          Go To Home
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
