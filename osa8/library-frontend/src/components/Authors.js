import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import { useUserValue } from "../UserContext";

const Authors = () => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const user = useUserValue();
  const result = useQuery(ALL_AUTHORS);
  const [changeBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const updateBirthYear = (event) => {
    event.preventDefault();

    changeBirthYear({
      variables: { name: name, setBornTo: parseInt(birthYear) },
    });

    setName("");
    setBirthYear("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {user && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={updateBirthYear}>
            <label>Pick author</label>
            <select
              value={name}
              onChange={({ target }) => setName(target.value)}
            >
              {authors
                .filter((n) => !n.born)
                .map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
            </select>
            <br />
            <label>Born</label>
            <input
              value={birthYear}
              onChange={({ target }) => setBirthYear(target.value)}
            />
            <br />
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
