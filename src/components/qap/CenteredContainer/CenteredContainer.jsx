import styles from './CenteredContainer.module.css';

function CenteredContainer({ children }) {
  return (
    <div className={styles.centeredContainer}>
      {children}
    </div>
  );
}

export default CenteredContainer;