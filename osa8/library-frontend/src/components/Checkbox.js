const Checkbox = ({ toggle, subject, checked }) => {
  const handleChange = () => {
    toggle(subject);
  };

  return (
    <label>
      <input type="checkbox" defaultChecked={checked} onClick={handleChange} />
      <span>{subject}</span>
    </label>
  );
};

export default Checkbox;
