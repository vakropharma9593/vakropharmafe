"use-client";

import ACTIONS from "@/store/actions";
import { Context } from "@/store/context";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { toast, Bounce } from "react-toastify";

export default function LoginPage() {
  const { dispatch } = useContext(Context);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone === process.env.NEXT_PUBLIC_PHONE && password === process.env.NEXT_PUBLIC_PASSWORD) {
        const authData = { username: phone, isLoggedIn: true };
        localStorage.setItem("auth", JSON.stringify(authData));
        dispatch({ type: ACTIONS.SET_AUTH, payload: { username: phone, isLoggedIn: true }});
        router.replace("/admin");
    } else {
        toast("Phone and password is incorrect", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            type: "error",
            transition: Bounce,
        });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
           <button onClick={() => router.push("/")} className="login-btn" style={{ backgroundColor: "#C9A25E"}}>
            Home
          </button>
          <h1>Login</h1>
          <p>Access your account</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="string"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}