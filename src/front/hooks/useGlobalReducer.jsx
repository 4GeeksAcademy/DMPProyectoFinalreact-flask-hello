import { createContext, useReducer, useContext } from "react";

const GlobalContext = createContext();

const initialState = {
  todos: [
    { id: 1, title: "Aprender React", background: "#ccc" },
    { id: 2, title: "Conectar backend", background: "#eee" }
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "add_task":
      return {
        ...state,
        todos: state.todos.map((item) =>
          item.id === action.payload.id
            ? { ...item, background: action.payload.color }
            : item
        ),
      };
    default:
      return state;
  }
}

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={{ store, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalReducer = () => useContext(GlobalContext);
export default useGlobalReducer;
