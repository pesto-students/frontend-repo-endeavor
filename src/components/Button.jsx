const Button = ({ onClickHandler, content }) => {
    return <button onClick={onClickHandler}>{content}</button>;
}

export default Button;