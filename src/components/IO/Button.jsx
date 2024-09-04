const Button = ({ onClickHandler, disabled = false, children }) => {
    return <button onClick={onClickHandler} disabled={disabled} >{children}</button>;
}

export default Button;