import './Button.css';

function Button({ label, onClick, type = "submit" }) {
  return (
    <button type={type} className="btn" onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
