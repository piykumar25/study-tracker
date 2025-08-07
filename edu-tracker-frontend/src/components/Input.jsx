import './Input.css';

function Input({ label, type = "text", value, onChange, placeholder, name }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input 
        type={type}
        value={value}
        onChange={onChange} // ✅ Pass event directly
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
}

export default Input;
