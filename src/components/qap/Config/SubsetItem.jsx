import styles from './SubsetItem.module.css';
import shared from './Config.module.css';
import RemoveItemsButton from '../ui/Buttons/RemoveItemsButton';
import ErrorMsg from '../ErrorMsg/ErrorMsg';

function SubsetItem(props){
    function resetInputValue(){
        props.setSubsets(prevSubsets => {
            const resetSubset = [...prevSubsets];
            const currentSubset = resetSubset[props.subsetIndex];
            resetSubset[props.subsetIndex] = {
                ...currentSubset,
                newElement:""
            }
            return resetSubset;
        })
    }

    function removeElement(e, elementIndex){
        e.preventDefault();
        e.stopPropagation();
        props.setSubsets(prevSubsets => {
            const updatedSubsets = [...prevSubsets];
            const currentSubset = updatedSubsets[props.subsetIndex];
            updatedSubsets[props.subsetIndex] = {
                ...currentSubset,
                elements:currentSubset.elements.toSpliced(elementIndex,1)
            }
            return updatedSubsets;
        })
        setSubsetErrorMsg("", props.subsetIndex);
    }


    function editSubset(subsetIndex){
        const newSubsets = [...props.subsets];
        newSubsets[subsetIndex] = {
            ...newSubsets[subsetIndex],
            isEditing:!newSubsets[subsetIndex].isEditing
        };
        props.setSubsets(newSubsets);
        setSubsetErrorMsg("", subsetIndex);
    }

    function setSubsetErrorMsg(message, subsetIndex){
        props.setSubsets(prevSubsets => {
            const updated = [...prevSubsets];
            updated[subsetIndex] = {
                ...updated[subsetIndex],
                error:message
            };
            return updated;
        })
    }

    function handleAddElement(subsetIndex, element){
        if (element === ""){
            setSubsetErrorMsg("Element cannot be empty. ", subsetIndex)
            return;
        } 
        if (props.subsets[subsetIndex].elements.includes(element)){
            setSubsetErrorMsg("Element is already in subset. ", subsetIndex)
            return;
        }

        props.setSubsets(prevSubsets => {
            const newSubsets = [...prevSubsets];
            const currentSubset = newSubsets[subsetIndex];
            newSubsets[subsetIndex] = {
            ...currentSubset,
            elements: [...currentSubset.elements, element],
            error:""
            }
            return newSubsets;
        });
    }

    return(
        <li key={props.subsetIndex} className={styles.subsetItem} onClick={() => editSubset(props.subsetIndex)}>
            {props.problemType === "exact-cover" && <div className={styles.inlineContainer}>
                <h4 className={styles.subsetHeader}>Subset {props.subsetIndex+1}</h4>
                <button 
                    className={styles.removeSubsetBtn}
                    onClick={(e) => props.removeSubset(e)}
                >×</button>
            </div>}
            {props.subset.elements.length === 0 && !props.subset.isEditing &&
            <p className={shared.instruction}>click to add elements...</p>}
            {props.subset.elements.length>0 && !props.subset.isEditing &&
                <p className={styles.subsetElementsArray}>Elements: [ {props.subset.elements.join(", ")} ]</p>
            }
            {props.subset.isEditing && <ul className={styles.subsetElementsList}>
                {props.subset.elements.map((element, elementIndex) => (
                    <li 
                        key={elementIndex} 
                        className={styles.subsetElements}
                    >{element}
                    <RemoveItemsButton 
                        className={styles.removeItemsButton}
                        onClick={(e) => removeElement(e, elementIndex)}
                    />
                    </li>
                ))}
            </ul>}
            {props.subset.isEditing && 
            <div className={styles.addElementsContainer}>
                <label htmlFor={`Subset${props.subsetIndex}addElements`} className={styles.addElementsLabel}>Add Elements:</label>
                <input 
                    type="number" 
                    id={`Subset${props.subsetIndex}addElements` }
                    className={styles.addElementsInput}
                    placeholder="Enter an integer"
                    onClick={(e) => e.stopPropagation()}
                    value={props.subset.newElement}
                    onChange={(e) => {
                        const value = e.target.value;
                        props.setSubsets(prevSubsets => {
                            const updated = [...prevSubsets];
                            updated[props.subsetIndex] = {
                                ...updated[props.subsetIndex],
                                newElement: value === "" ? "" : Number(value)
                            };
                            return updated;
                        });
                    }}
                    
                    onKeyDown={(e) => {
                        if (e.key === "Enter"){
                            e.preventDefault();
                            handleAddElement(props.subsetIndex, props.subset.newElement);
                            resetInputValue();
                        }
                    }}/>
            </div>}
            {props.error && <ErrorMsg error={props.error}/>}
        </li>
    )
}

export default SubsetItem;