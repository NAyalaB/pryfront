"use client";

//Vendors
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";


const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
    contact_number: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    email: "",
    message: "",
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    emailjs.init("yHq_wXYUIweiHBmtf");
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedFormData = {
        ...formData,
        contact_number: new Date().toISOString(),
      };

      const formElement = formRef.current;
    if (formElement) {

        const contactNumberInput = formElement.querySelector(
            'input[name="contact_number"]'
          ) as HTMLInputElement;
    
          if (contactNumberInput) {
            contactNumberInput.value = updatedFormData.contact_number;
          }

      emailjs
        .sendForm(
          "service_lnk9hb5",
          "contact_form",
          formRef.current as HTMLFormElement
        )
        .then(
          () => {
            Swal.fire({
              title: "Successful contact",
              text: "Your message has been sent successfully!",
              icon: "success",
              confirmButtonText: "OK",
            });
            router.push("/home");
          },
          (error) => {
            console.log("FAILED...", error);
          }
        );
    }
  };

  return (
    <div className="text-black flex items-center justify-center p-10 ml-6">
      <title>Contact</title>
      <div className="rounded-lg max-w-md p-16 bg-slate-800 mt-2 mb-12 w-full">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">
          Contact Us
        </h2>
        <div className="flex items-center justify-center space-x-2"></div>
        <form ref={formRef} id="contact-form" onSubmit={sendEmail}>
          <div className="mb-4 mt-4 text-white">
            <label className="block text-gray-700 text-sm font-bold mb-2 peer-focus:font-medium">
              FullName
            </label>
            <input
              type="text"
              name="user_name"
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-b-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer input:valid:border-blue-600 input-autofill"
              onChange={handleChange}
              value={formData.user_name}
              placeholder="Tu nombre"
            />
            {errorMessage.name && (
              <p className="text-red-500 text-xs mt-2">{errorMessage.name}</p>
            )}
          </div>

          <div className="mb-4 mt-4 text-white">
            <label className="block text-gray-700 text-sm font-bold mb-2 peer-focus:font-medium">
              Email
            </label>
            <input
              type="email"
              name="user_email"
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-b-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer input:valid:border-blue-600 input-autofill"
              onChange={handleChange}
              value={formData.user_email}
              placeholder="Tu email"
            />
            {errorMessage.email && (
              <p className="text-red-500 text-xs mt-2">{errorMessage.email}</p>
            )}
          </div>

          <div className="mb-6 text-white">
            <label className="block text-gray-700 text-sm font-bold mb-2 peer-focus:font-medium">
              Message
            </label>

            <textarea
              name="message"
              className="bg-slate-700 items-center flex pt-4 pl-2 px-0 w-full text-sm text-white  border-0 border-b-2 border-b-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer input:valid:border-blue-600 input-autofill"
              onChange={handleChange}
              value={formData.message}
            />
          </div>

          <input type="hidden" name="contact_number" value={formData.contact_number} />

          
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
     
        </form>
      </div>
    </div>
  );
};

export default Contact;
