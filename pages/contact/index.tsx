import React, { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useRouter } from "next/router";

type Props = {};

function Contact({}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const web = "MintIT.CZ";
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log("Sending");
    let data = {
      web,
      name,
      email,
      phone,
      message,
    };
    console.log(data);
    fetch("/api/contact", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.push("/thankyou");
  };
  return (
    <main className="max-w-6xl mx-auto">
      <Header />
      <div className="justify-center items-center px-20 py-10 ">
        <div></div>
        <div>
          <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
            <h3 className="text-sm text-[#6D285F]">
              Líbí se Vám naše myšlenka nebo nám s tím chcete píchnout
            </h3>
            <h4 className="text-3xl font-bold pt-2">Nechte nám vzkaz</h4>
            <hr className="py-3 mt-2" />
            <label className="block mb-5">
              <span className="text-gray-700">Jméno</span>
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                placeholder="Jméno a příjmení"
                type="text"
                name="name"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">E-mail</span>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                placeholder="jmeno@domena.cz"
                type="email"
                name="email"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Telefon</span>
              <input
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                placeholder="+420 ...."
                type="text"
                name="phone"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Komentář</span>
              <textarea
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                placeholder="Váš komentář"
                name="comment"
                rows={8}
              />
            </label>

            <button
              onClick={handleSubmit}
              className="shadow bg-[#6D285F] hover:bg-[#EF85D1] hover:text-[#6D285F] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer "
            >
              Odeslat
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Contact;
