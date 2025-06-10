import styles from './FormInputs.module.css';
import global from '../qapStyles.module.css'

function CliqueSizeInput(props){
    return(
        <div className={styles.formGroup}>
            <label className={global.qapBaseLabel} htmlFor="cliqueSize">
                Clique Size <span style={{fontSize:"0.8rem", fontStyle:"italic"}}>(Optional)</span>:
            </label>
            <input className={global.qapBaseInput}
                type="number"
                id="cliqueSize"
                min="1"
                placeholder='3'
                value = {props.cliqueSize}
                onChange={(e) => {
                    const value = e.target.value;
                    props.setCliqueSize(value === "" ? "" : Number(value))
                }}
                required
            />
        </div>
    )
}

export default CliqueSizeInput;