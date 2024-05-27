import { useState } from "react";
import { useAuth } from "../../../states/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import hide from "../../../assets/hide.png";
import show from "../../../assets/show.png";
import "./login.scss";
import image from "../../../assets/humo oquv markazi.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({username: "", password: ""});
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await auth.login(userForm, navigate);
      setLoading(false);
      toast.success("Login Success")
    } catch (err) {
      toast.error("Login or password reset failed");
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target; // Check both e.currentTarget and e.target
    setUserForm({ ...userForm, [name]: value });
  };
  if (loading) {
    return (
      <div className="loader">
        {/* <Loading /> */}
      </div>
    );
  }
  return (
    <main className="main">
      <section className="section-login">
        <div className="section-main">
          <div className="section-login-2">
            <div className="section-login-2-main">
              <h1 className="section-login-2-title poppins-bold">
                Tizimga kirish
              </h1>
              <p className="poppins-medium">
                Kirish uchun ma'lumotlarni kiriting
              </p>
              
              <form className="login-form" onSubmit={handleLogin}>
                <div className="login-form-1">
                  <label htmlFor="input-username">Username</label>
                  <input
                    className="input-form"
                    type="text"
                    onChange={handleChange}
                    name="username"
                    id="username"
                    // placeholder="Username"
                    required
                  />
                </div>
                <div className="login-form-3">
                  <label htmlFor="input-password">Password</label>
                  <div className="password-input-container">
                    <input
                    className="input-form"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      // placeholder="Password"
                      required
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={handlePasswordToggle}
                      >
                      {showPassword ? (
                        <img src={hide} alt="" />
                      ) : (
                        <img src={show} alt="" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="login-form-submit-btn">
                  <button className="login-button" type="submit">Kirish</button>
                      
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="login-image">
          <div className="login-image-text">
            <h1 className="poppins-bold">
              Humo Edu tizimiga <br />{" "}
              <span className="poppins-regular">Hush kelibsiz</span>
            </h1>
            {/* <p className="poppins-medium">Tizimga kiring</p> */}
            <div >
              <img className="animated-image" style={{ filter: 'invert(100%)' }} src={image} alt="" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
