import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(()=>{
      if (!isAuthenticated) navigate("/", { replace: true });
    }, 1000)
    
    return () => clearTimeout(id);
  }, [isAuthenticated]);

  return isAuthenticated ? children : <Spinner/>;
}
