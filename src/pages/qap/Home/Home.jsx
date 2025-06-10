import PageLayout from '../../../components/qap/PageLayout/PageLayout.jsx';
import styles from "./Home.module.css";

export default function Home() {
  return (
    <PageLayout>
      <div className={styles.container}>
        <h1 className={styles.heading}>Welcome to the Quantum App Platform</h1>
        <p className={styles.subtext}>This platform allows you to solve problems with quantum.</p>
        <p className={styles.subtext}>Explore our features and start solving!</p>
      </div>
    </PageLayout>
  );
}