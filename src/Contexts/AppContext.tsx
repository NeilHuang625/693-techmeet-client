import { createContext, Dispatch, SetStateAction } from "react";
import { AppEvent } from "../App";

interface AppContextProps {
  events: AppEvent[];
  setEvents: Dispatch<SetStateAction<AppEvent[]>>;
}

export const AppContext = createContext<AppContextProps>({
  events: [],
  setEvents: () => {},
});
