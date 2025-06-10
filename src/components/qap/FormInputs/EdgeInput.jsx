import styles from './FormInputs.module.css'
import PurpleGlowButton from '../ui/Buttons/PurpleGlowButton';
import global from '../qapStyles.module.css';

function EdgeInput(props){

    return(
        <div className={styles.formGroup}>
            <label className={global.qapBaseLabel} htmlFor="edges">
                Edges: 
            </label>
            <div className={styles.edgeInputs}>
                <input
                    className={global.qapBaseInput}
                    id="edges" 
                    aria-label='From Node'
                    type="number"
                    placeholder="From"
                    min="0"
                    value={props.edgeFrom}
                    onChange={(e) => {
                        const value = e.target.value;
                        props.setEdgeFrom(value === "" ? "" : Number(value))
                    }}
                />
                <input 
                    className={global.qapBaseInput}
                    type="number"
                    aria-label='To Node'
                    placeholder="To"
                    min="0"
                    value={props.edgeTo}
                    onChange={(e) => {
                        const value = e.target.value;
                        props.setEdgeTo(value === "" ? "" : Number(value))
                        }}
                />
                {props.isWeighted && <input 
                    className={global.qapBaseInput}
                    type="number"
                    aria-label='Edge Weight'
                    placeholder="Weight"
                    min="0"
                    value={props.edgeWeight}
                    onChange={(e) => {
                        const value = e.target.value;
                        props.setEdgeWeight(value === "" ? "" : Number(value))
                        }}
                />}
                <PurpleGlowButton
                    type="button"
                    onClick={props.addEdge}
                >Add Edge</PurpleGlowButton>
            </div>
        </div>
    )
}

export default EdgeInput;