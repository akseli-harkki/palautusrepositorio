import { useQuery } from "@apollo/client";
import { ALL_BOOKS, GENRE_BOOKS } from "../queries";
import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";

const Books = () => {
  const [genres, setGenres] = useState({});
  const [selectedGenres, setSelectedGenres] = useState([]);
  const result = useQuery(ALL_BOOKS);
  const genreResult = useQuery(GENRE_BOOKS, {
    variables: { genres: selectedGenres },
  });

  useEffect(() => {
    if (!result.loading) {
      const allBooks = result.data.allBooks;
      const allgenres = allBooks.reduce((genres, book) => {
        const newGenres = book.genres.filter((n) => !(n in genres));
        newGenres.map((n) => (genres[n] = false));
        return genres;
      }, {});
      setGenres(allgenres);
    }
  }, [result]);

  if (result.loading || genreResult.loading) {
    return <div>loading...</div>;
  }

  let books = [];

  if (selectedGenres.length === 0) {
    books = result.data.allBooks;
  } else {
    books = genreResult.data.allBooks;
  }

  const toggleGenres = (genreToToggle) => {
    genres[genreToToggle] = !genres[genreToToggle];

    let updatedGenres = [];

    for (let genre in genres) {
      if (genres[genre]) {
        updatedGenres = updatedGenres.concat(genre);
      }
    }
    setSelectedGenres(updatedGenres);
    genreResult.refetch();
  };

  return (
    <div>
      <h2>books</h2>
      <div className="genres">
        {Object.keys(genres).map((n) => (
          <Checkbox
            key={n}
            toggle={toggleGenres}
            subject={n}
            checked={genres[n]}
          />
        ))}
      </div>
      <br />
      <span>Chosen genres: </span>
      {selectedGenres.map((n) => (
        <span key={n}>{n} </span>
      ))}
      <br />
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
