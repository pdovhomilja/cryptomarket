import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
  lang: "en",
  network: "Mumbai",
});

export { useGlobalState, setGlobalState };
