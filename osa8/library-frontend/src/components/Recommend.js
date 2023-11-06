/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery, useLazyQuery } from "@apollo/client";
import { CURRENT_USER, GENRE_BOOKS } from "../queries";
import { useEffect } from "react";

const Recommend = () => {
  const userResult = useQuery(CURRENT_USER);
  const [getBooks, { data }] = useLazyQuery(GENRE_BOOKS);

  useEffect(() => {
    if (!userResult.loading) {
      getBooks({ variables: { genres: [userResult.data.me.favoriteGenre] } });
    }
  }, [userResult]);

  if (userResult.loading || !data) {
    return <div>loading...</div>;
  }

  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <p>books in your favorite genre: {userResult.data.me.favoriteGenre} </p>
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

export default Recommend;
