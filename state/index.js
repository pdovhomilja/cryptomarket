import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
  lang: "cz",
  network: "Mumbai",
  search: "",
});

export { useGlobalState, setGlobalState };
