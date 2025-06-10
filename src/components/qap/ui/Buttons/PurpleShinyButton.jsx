import styles from './PurpleShinyButton.module.css';

export default function PurpleShinyButton({className='', ...props}){
    return(
        <button
            className={`${styles.button} ${className}`}
            {...props}
        />
    )
}