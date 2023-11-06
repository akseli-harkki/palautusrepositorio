/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient, useSubscription } from "@apollo/client";
import { useUserDispatch, useUserValue } from "./UserContext";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Recommend from "./components/Recommend";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

const App = () => {
  const client = useApolloClient();
  const user = useUserValue();
  const userDispatch = useUserDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`Book "${addedBook.title}" added to the library`);

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        };
      });
    },
  });

  const logout = () => {
    if (location.pathname === "/addBook" || "/recommend") {
      navigate("/authors");
    }
    userDispatch({ type: "SET", payload: null });
    localStorage.clear();
    client.resetStore();
    // Ilman sivun uudelleenlatausta esim. recommend-sivu ei toimi. Jos kirjaudutaan ulos ja heti takaisin sisään, ja mennään suoraan
    // recommend-sivulle niin tällöin jostain syystä backendin expressMiddleware ei laukea, eli contexia ei luoda.
    window.location.reload(false);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedLibraryUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET", payload: user });
    }
  }, []);

  return (
    <div>
      <nav className="navBar">
        <NavLink className="navLink" to="/authors">
          Authors
        </NavLink>
        <NavLink className="navLink" to="/books">
          Books
        </NavLink>
        {user && (
          <span>
            <NavLink className="navLink" to="/addBook">
              Add Book
            </NavLink>
            <NavLink className="navLink" to="/recommend">
              Recommend
            </NavLink>

            <div className="user-container">
              <span className="user-info">{user.username}</span>
              <button
                className="user-info btn btn-logout"
                id="logout-button"
                onClick={logout}
              >
                logout
              </button>
            </div>
          </span>
        )}
        {!user && (
          <div className="user-container">
            <NavLink to="/login">
              <button className="user-info btn btn-logout" id="login-button">
                login
              </button>
            </NavLink>
          </div>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/addBook" element={<NewBook />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
};

export default App;
