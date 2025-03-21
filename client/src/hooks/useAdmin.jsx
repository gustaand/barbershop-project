import { useContext } from "react";
import adminContext from "../context/AdminProvider";

const useAdmin = () => {
  return useContext(adminContext)
}

export default useAdmin