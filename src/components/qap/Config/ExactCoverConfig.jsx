import PurpleGlowButton from '../ui/Buttons/PurpleGlowButton';
import shared from './Config.module.css';
import styles from './ExactCoverConfig.module.css';
import FormBtn from '../FormInputs/FormBtn';
import SubsetItem from './SubsetItem.jsx';
import { fetchQiskitSolution } from '../utils/fetchQiskitSolution.js';

function ExactCoverConfig(props){

    function addSubset(){
        props.setSubsets([...props.subsets, {elements:[], isEditing:false, newElement:"", error:""}]);
    }

    function removeSubset(e){
        e.preventDefault();
        e.stopPropagation();
        props.setSubsets(prevSubsets => {
            const updatedSubsets = prevSubsets.toSpliced(props.subsetIndex,1)
            return updatedSubsets;
        })
    }

    async function handleSubmit(e){
        e.preventDefault();
        props.setFormError("");

        const subsetsArray = [];
        for (let i=0;i<props.subsets.length;i++){
            subsetsArray.push(props.subsets[i].elements);
        }

        const payload = {
            subsets:subsetsArray
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
        props.setSubsets([{elements:[], isEditing:false, newElement:"", error:""},
                    {elements:[], isEditing:false, newElement:"", error:""}]);
        props.setFormError("")
    }

    return(
        <section className={shared.configurationSection}>
            <h2 className={shared.sectionHeader}>Configuration</h2>
            <form className={styles.exactCoverForm}>
                <div className={styles.subsetContainer}>
                    <ul className={styles.subsetList}>
                        {props.subsets.map((subset, subsetIndex) => (
                                    <SubsetItem 
                                        key={subsetIndex}
                                        subset={subset}
                                        subsetIndex={subsetIndex}
                                        setSubsets={props.setSubsets}
                                        subsets={props.subsets}
                                        error={subset.error}
                                        removeSubset={removeSubset}
                                        problemType={props.problemType}
                                    />
                            ))}
                    </ul>
                    {props.subsets.length === 0 && <p className={shared.instruction}>click to add a subset...</p>}
                    <PurpleGlowButton
                        type="button"
                        className={styles.addSubsetsBtn}
                        onClick={addSubset}
                    >Add Subset</PurpleGlowButton>
                </div>
                {props.subsets.length>1 && 
                <FormBtn 
                    handleSubmit={(e) => handleSubmit(e)} 
                    handleReset={handleReset} 
                />}
            </form>
        </section>
    )
}

export default ExactCoverConfig;