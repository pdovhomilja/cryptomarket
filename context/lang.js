import { createContext, useContext, useState } from "react";

const Context = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState("cz");
  const [search, setSearch] = useState("");
  return (
    <Context.Provider value={[lang, setLang]}>{children}</Context.Provider>
  );
}

export function useLangContext() {
  return useContext(Context);
}
