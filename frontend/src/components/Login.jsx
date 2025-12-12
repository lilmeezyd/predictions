import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "sonner";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";

const Login = (props) => {
  const { registerView } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/predictions");
    }
  }, [navigate, userInfo]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
        console.log(err)
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <div className="p-2">
      <h1 className="text-3xl mb-2">Sign In</h1>
      <form onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            className="my-2"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            className="my-2"
          />
        </div>
        <div className='my-2'>
          <Button type="submit">
            Login
          </Button>
        </div>
      </form>
      <div>
        New user?&nbsp;
        <span className="home-link text-blue-900" onClick={registerView}>
          Register
        </span>
      </div>
    </div>
  );
};

export default Login;
