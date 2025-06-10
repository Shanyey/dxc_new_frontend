import styles from './PurpleGlowButton.module.css';

function PurpleGlowButton({className='', ...props}){
    return(
        <button
            className={`${styles.button} ${className}`}
            {...props}
        />
    )
}

export default PurpleGlowButton;