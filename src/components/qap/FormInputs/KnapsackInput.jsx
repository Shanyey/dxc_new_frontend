import shared from './FormInputs.module.css'
import styles from './KnapsackInput.module.css'
import PurpleGlowButton from '../ui/Buttons/PurpleGlowButton';
import global from '../qapStyles.module.css';

function KnapsackInput(props){

    return(
        <>
            <div className={shared.formGroup}>
                <label className={global.qapBaseLabel} htmlFor="values">
                    Items: 
                </label>
                <div className={styles.itemInputs}>
                    <input
                        className={global.qapBaseInput}
                        id="values" 
                        aria-label='Item value'
                        type="number"
                        placeholder="value"
                        min="0"
                        value={props.newItem.value}
                        onChange={(e) => {
                            const value = e.target.value;
                            props.setNewItem(prevItem => {
                                const newItem = {
                                    ...prevItem,
                                    value:value === "" ? "" : Number(value)
                                }
                                return newItem;
                            })
                        }}
                    />
                    <input 
                        className={global.qapBaseInput}
                        id="weight"
                        type="number"
                        aria-label='Item weight'
                        placeholder="weight"
                        min="0"
                        value={props.newItem.weight}
                        onChange={(e) => {
                            const value = e.target.value;
                            props.setNewItem(prevItem => {
                                const newItem = {
                                    ...prevItem,
                                    weight:value === "" ? "" : Number(value)
                                }
                                return newItem;
                            })
                        }}
                    />
                    <PurpleGlowButton
                        type="button"
                        onClick={props.addItem}
                    >Add Item</PurpleGlowButton>
                </div>        
            </div>
            <div className={shared.formGroup}>
                <label className={global.qapBaseLabel} htmlFor="maxWeight">
                    Max weight:
                </label>
                <input 
                    className={`${styles.maxWeightInput} ${global.qapBaseInput}`}
                    id="maxWeight"
                    type="number"
                    aria-label="Max weight of knapsack"
                    placeholder="10"
                    min="0"
                    value={props.maxWeight}
                    onChange={(e) => {
                        const value = e.target.value;
                        props.setMaxWeight(
                            value === "" ? "" : Number(value)
                        )
                        if (value>0) props.setError("");
                    }}
                />
            </div>
        </>
    )
}
export default KnapsackInput;