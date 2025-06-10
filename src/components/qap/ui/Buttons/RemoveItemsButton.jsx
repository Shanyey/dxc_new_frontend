import styles from './RemoveItemsButton.module.css';

function RemoveItemsButton({className = "", ...props}){
    return (
        <button 
            className={`${styles.removeItemsBtn} ${className}`} 
            {...props}
        >×</button>
    )
}

export default RemoveItemsButton;