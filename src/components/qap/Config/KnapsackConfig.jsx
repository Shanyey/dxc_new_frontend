import FormBtn from '../FormInputs/FormBtn.jsx';
import KnapsackInput from '../FormInputs/KnapsackInput.jsx';
import shared from './Config.module.css';
import styles from './KnapsackConfig.module.css'
import { useState } from 'react'; 
import RemoveItemsButton from '../ui/Buttons/RemoveItemsButton.jsx';
import { fetchQiskitSolution } from '../utils/fetchQiskitSolution.js';

function KnapsackConfig(props){
    const [newItem, setNewItem] = useState(
        {weight:"", value:""}
    );
    const [maxWeight, setMaxWeight] = useState("");

    function addItem(){
        if (newItem.weight <= 0 || newItem.value <= 0){
            props.setError("Inputs must be a positive number")
            return;
        }

        if (newItem.weight==="" || newItem.value===""){
            props.setError("weight and value inputs cannot be empty")
            return;
        }

        props.setError("");
        props.setItems(itemArray => {
            const nextId = itemArray.length === 0 ?
            0: Math.max(...itemArray.map(item => item.id)) + 1;
            return [
                ...itemArray, 
                {
                    id:nextId,
                    value:newItem.value,
                    weight:newItem.weight
                }
            ]});
        setNewItem({weight:"", value:""});
    }

    function removeItem(id){
        props.setItems(prevItems => 
            prevItems.filter(item => item.id !== id))
        props.setError("");
    }
    
    async function handleSubmit(e){
        e.preventDefault();

        if (props.items.length === 0) {
            props.setError("Please add at least one item");
            return;
        }

        if (maxWeight <= 0){
            props.setError("Max weight must be a positive number");
            return;
        }

        props.setError("");

        const valueArray = [];
        const weightArray = [];

        for (let i=0;i<props.items.length;i++){
            valueArray.push(props.items[i].value);
            weightArray.push(props.items[i].weight);
        }


        let payload = {
            values: valueArray,
            weights: weightArray,
            max_weight: maxWeight
        };

        await fetchQiskitSolution(
            props.problemType,
            payload,
            props.setResult,
            props.setError,
            props.setGraphImage,
            props.setIsLoaded,
            props.setIsLoading
        );
    };

    function handleReset(){
        props.setResult(null);
        props.setIsLoading(false);
        props.setError("");
        props.setIsLoaded(false);
        setNewItem({weight:"", value:""});
        props.setItems([]);
        setMaxWeight("");
    }

    return(
        <section className={shared.configurationSection}>
            <h2 className={shared.sectionHeader}>Configuration</h2>
            <form className={styles.knapsackForm}>
                <KnapsackInput
                    newItem={newItem}
                    maxWeight={maxWeight}
                    setNewItem={setNewItem}
                    setMaxWeight={setMaxWeight}
                    addItem={addItem}
                    setError={props.setError}
                />
                {props.items.length > 0 && (
                    <div className={shared.addItemsContainer}>
                        <h4>Items added:</h4>
                        <ul>
                            {props.items.map((item, index) =>(
                                <li key={item.id} className={styles.items}>
                                    <div className={styles.itemContainer}>
                                        <p className={styles.itemId}>Item {index+1} </p>
                                        <p className={styles.itemDescription}>[ value: {item.value} , weight: {item.weight} ]</p>
                                    </div>
                                    <RemoveItemsButton
                                        type="button"
                                        onClick={() => {removeItem(item.id)}}
                                    />
                                </li>
                            ))}
                        </ul>
                        {maxWeight>0 && <div className={styles.inlineContainer}>
                            <h4>Max Weight: </h4>
                            <p>{maxWeight}</p>
                        </div>}
                    </div>
                )}
                <FormBtn handleSubmit={handleSubmit} handleReset={handleReset}/>
            </form>
        </section>
    )
}

export default KnapsackConfig;