import axios from "axios";
import { showAlert } from "./alerts";
// prettier-ignore
export const singup = async (email, password,passwordConfim,name,role='user') => {
   
 try {
    const res = await axios({
      method: "POST",
      url: "api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfim,
        role,  
      },
    });  
    if (res.data.status === "success") {
      showAlert("success", "logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
