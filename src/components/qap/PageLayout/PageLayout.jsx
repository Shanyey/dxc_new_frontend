import SideBar from '../Sidebar/Sidebar.jsx';
import styles from './PageLayout.module.css';
import TopBar from '../../TopBar/TopBar.jsx';

export default function PageLayout({children}){
    return(
        <>
            <div className={styles.page}>
                <TopBar />
            </div>
            <div className={styles.layout}>
                <SideBar />
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </>
        
    );
}

