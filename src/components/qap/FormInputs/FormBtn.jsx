import styles from './FormInputs.module.css';
import PurpleShinyButton from '../ui/Buttons/PurpleShinyButton';

function FormBtn(props){
    return(
        <div className={styles.formBtn}>
            <PurpleShinyButton
                type="submit"
                className={styles.solveBtn}
                onClick={props.handleSubmit}
            >
                Solve Problem
            </PurpleShinyButton>

            <PurpleShinyButton
                type="submit"
                className={styles.resetBtn}
                onClick={props.handleReset}
            >
                Reset
            </PurpleShinyButton>
        </div>
    )
}

export default FormBtn;