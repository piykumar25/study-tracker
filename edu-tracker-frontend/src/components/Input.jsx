import './Input.css';

function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default Input;
