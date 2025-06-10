import styles from './Intro.module.css';
import { HashLink } from 'react-router-hash-link';

function Intro(props){
    return (
        <section className={styles.introSection}>
            <h3>What is the {props.problem}?</h3>
            <p> 
                {props.description}
            </p>
            <p className={styles.documentation}>refer to the documentation <HashLink to={`/qap/docs#${props.id}`}>here</HashLink></p>
        </section>
    )
}

export default Intro;