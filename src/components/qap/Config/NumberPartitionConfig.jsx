import shared from './Config.module.css'
import styles from './NumberPartitionConfig.module.css'
import FormBtn from '../FormInputs/FormBtn';
import SubsetItem from './SubsetItem.jsx';
import { fetchQiskitSolution } from '../utils/fetchQiskitSolution.js';

function NumberPartitionConfig(props){
    async function handleSubmit(e){
        e.preventDefault();

        if (props.subsets[0].elements.length === 0){
            props.setFormError("Set cannot be empty")
            return;
        }

        props.setFormError("");

        const payload = {
            number_set:props.subsets[0].elements
        }

        fetchQiskitSolution(
            props.problemType,
            payload,
            props.setResult,
            props.setFormError,
            props.setGraphImage,
            props.setIsLoaded,
            props.setIsLoading
        )


    }

    function handleReset(){
        props.setSubsets([{elements:[], isEditing:false, newElement:"", error:""}]);
        props.setFormError("")
    }

    return(
            <section className={shared.configurationSection}>
                <h2 className={shared.sectionHeader}>Configuration</h2>
                <form className={styles.numberPartitionForm}>
                    <ul className={styles.subsetList}>
                        {props.subsets.map((subset, subsetIndex) => (
                                    <SubsetItem 
                                        key={subsetIndex}
                                        subset={subset}
                                        subsetIndex={subsetIndex}
                                        setSubsets={props.setSubsets}
                                        subsets={props.subsets}
                                        error={subset.error}
                                        problemType={props.problemType}
                                    />
                            ))}
                        {props.subsets.length === 0 && <p className={shared.instruction}>click to add numbers...</p>}
                    </ul> 
                <FormBtn 
                    handleSubmit={(e) => handleSubmit(e)} 
                    handleReset={handleReset} 
                />
            </form>
            </section>
    )
}

export default NumberPartitionConfig;