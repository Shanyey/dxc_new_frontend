import styles from './FormInputs.module.css';
import global from '../qapStyles.module.css';

function NodesInput(props){
    return(
        <div className={styles.formGroup}>
            <label className={global.qapBaseLabel} htmlFor="nodes">
                Number of Nodes:
            </label>
            <input
                className={global.qapBaseInput}
                type="number"
                id="nodes"
                min="2"
                placeholder='3'
                value = {props.nodes}
                onChange={(e) => {
                    const value = e.target.value;
                    props.setNodes(value === "" ? "" : Number(value))
                }}
                required
            />
        </div>
    )
}

export default NodesInput;