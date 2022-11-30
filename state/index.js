import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
  lang: "cz",
  network: "Mumbai",
});

export { useGlobalState, setGlobalState };
