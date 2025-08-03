import './Input.css';

function Input({ label, type = "text", value, onChange, placeholder, name }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange({ name: e.target.name, value: e.target.value })}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
}

export default Input;