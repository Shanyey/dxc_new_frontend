import styles from './LoadingAnimation.module.css';
function LoadingAnimation(){
    return(
        <>
            <div className={styles.spinner}></div>
            <p className={styles.loadingDots}>Loading<span> .</span><span> .</span><span> .</span></p>
        </>
    )
}

export default LoadingAnimation;