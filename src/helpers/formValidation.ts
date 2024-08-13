import { IRegisterProps } from "../types/IRegisterProps";
import { IRegisterErrorProps } from "../types/IRegisterErrorProps";
import {isBirthdayValid} from "../helpers/validationBirthday";

export function validateFormRegister (dataUser: IRegisterProps) {
    let errors: IRegisterErrorProps = {
    }
    
    if(!dataUser.email){
        errors.email = "The email is required.";
    } else if (!/^.+@.+\..+$/.test(dataUser.email)){
        errors.email = "Invalid email address."

    } else if (!dataUser.password){
        errors.password = "Password is required.";
    }else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/.test(dataUser.password)){
        errors.password = "The password must be between 8 and 15 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.";

    } else if (!dataUser.name){
        errors.name = "Name is required.";


    } else if (!dataUser.address){
        errors.address = "Address is required.";

    } else if (!dataUser.country){
        errors.country = "Country is required."; 
         
    } else if (!dataUser.city){
        errors.city = "City is required."; 

    } else if (!dataUser.phone){
        errors.phone = "The phone number is required.";
    } else if (!isBirthdayValid(dataUser.birthday)) {
        errors.birthday = "You must be at least 18 years old to register.";

    }  else if (dataUser.passwordConfirm !== dataUser.password){
        errors.passwordConfirm = "The passwords do not match.";
    } 
    
        return errors;
}