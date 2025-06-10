import styles from './qapStyles.module.css';

export default function qapFontWrapper({ children }) {
  return (
    <div className={styles.qapBaseFont}>
      {children}
    </div>);
}
