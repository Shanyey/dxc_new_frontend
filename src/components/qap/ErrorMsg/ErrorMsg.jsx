import styles from './ErrorMsg.module.css';

function ErrorMsg(props){
    return(
        <p className={styles.error}>Error: {props.error}</p>
    )
}

export default ErrorMsg;