import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";
import { toast } from "sonner";

const Register = (props) => {
  const { loginView } = props;
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { firstName, lastName, email, password, confirmPassword } = details;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo?.roles?.NORMAL_USER) {
      navigate("/predictions/selections");
    }
    if (userInfo && userInfo?.roles?.ADMIN) {
      navigate("/admin");
    }
  }, [navigate, userInfo]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          firstName,
          lastName,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/predictions");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const onChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="w-[100%] md:w-[80%] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-lg">
      <h1 className="text-3xl mb-2">Register</h1>
      <form onSubmit={onSubmit}>
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            className="my-2"
            placeholder="First Name"
            value={firstName}
            onChange={onChange}
            type="text"
            name="firstName"
            id="firstName"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            className="my-2"
            placeholder="Last Name"
            value={lastName}
            onChange={onChange}
            type="text"
            name="lastName"
            id="lastName"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            className="my-2"
            placeholder="Email"
            value={email}
            onChange={onChange}
            type="email"
            name="email"
            id="email"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            className="my-2"
            placeholder="Password"
            value={password}
            onChange={onChange}
            type="password"
            name="password"
            id="password"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            className="my-2"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={onChange}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
          />
        </div>
        <div className="my-2">
          <Button type="submit">Register</Button>
        </div>
      </form>
      <div>
        Have an account?&nbsp;
        <span className="home-link text-blue-90" onClick={loginView}>
          Login
        </span>
      </div>
    </div>
  );
};

export default Register;
