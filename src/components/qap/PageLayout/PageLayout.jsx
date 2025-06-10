import SideBar from '../Sidebar/Sidebar.jsx';
import styles from './PageLayout.module.css';

export default function PageLayout({children}){
    return(
        <div className={styles.layout}>
            <SideBar />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}

