import { IUser } from "@/src/types/IUser";
import { isBirthdayValid } from "../helpers/validationBirthday";

export function validateFormEditProfile(dataUser: IUser) {
    let errors: { [key: string]: string } = {};

    if (!dataUser.name) {
        errors.name = "Name is required.";
    }

    if (dataUser.phone && !/^\d{10,15}$/.test(dataUser.phone)) {
        errors.phone = "Phone number must be between 10 and 15 digits.";
    }

    if (dataUser.birthday && !isBirthdayValid(dataUser.birthday)) {
        errors.birthday = "You must be at least 18 years old.";
    }

    if (!dataUser.address) {
        errors.address = "Address is required.";
    }
    
    if (!dataUser.country) {
        errors.country = "Country is required.";
    }

    if (!dataUser.allergies) {
        errors.allergies = "Allergies is required. If you have any, please specify.";
    }

    return errors;
}
