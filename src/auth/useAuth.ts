import { useContext } from "react";
import AuthContext from "../auth/AuthContext";
export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("useAuth context:", context);
  // console.trace()
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
