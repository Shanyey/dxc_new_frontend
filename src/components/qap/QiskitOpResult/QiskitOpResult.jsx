import styles from './QiskitOpResult.module.css';
import { useEffect } from 'react'

function QiskitOpResult(props){
    function displaySolution(){
        if (props.result.solution?.length === 0) {
            return <p>No solution available</p>;  // Handles missing solution
        }

        if (props.problemType === "tsp"){
            return <p><span className="bold">Solution:</span> {props.result.solution.join(' -> ')}</p>;
        } else if (props.problemType === "graph-partition" || props.problemType === "max-cut"
            || props.problemType === "number-partition"
        ){
            return (
                <>
                    <p><span className="bold">Solution:</span></p>
                    <p>Set A: [ {props.result.solution[0].join(', ')} ]</p>
                    <p>Set B: [ {props.result.solution[1].join(', ')} ]</p>
                </>
                
              );              
        } else if (props.problemType === "exact-cover"){
            const subsetIndexArray = [];
            const fullSet=[];
            props.result.solution.forEach(solutionSet => {
                fullSet.push(...solutionSet);
                for(let i=0;i<props.subsets.length;i++){
                    const subset = props.subsets[i].elements;
                if (
                    subset.length === solutionSet.length &&
                    subset.slice().sort().join(',') === solutionSet.slice().sort().join(',')
                )  {
                        subsetIndexArray.push(i+1);
                        break;
                    }
                }
            })
            const subsetElements = props.result.solution.map((subset, index) => (
                <p key={index}>Subset {subsetIndexArray[index]}: [ {subset.join(', ')} ]</p>
                ))
            
            return (
                <>
                    <p><span className="bold">Solution:</span></p>
                    {subsetElements}
                    <p>Full Set: [ {fullSet.sort().join(', ')} ]</p>
                </>
            )
        }else if (props.problemType === "knapsack"){
            const indexArray = props.result.solution.map(index => index + 1);

            useEffect(() => {
                const valueSum = props.result.solution.reduce((sum, index) => {
                    const item = props.items[index];
                    return item ? sum + item.value : sum;
                }, 0);
                props.setValueSum(valueSum);
            }, [props.result])

            return (
                <>
                    <p><span className="bold">Solution</span></p>
                    <p>Selected Items: {indexArray.join(', ')}</p>
                    <p>Total Value: {props.valueSum}</p>
                </>
            )

        }else {
            return <p><span className="bold">Solution:</span> [ {props.result.solution.join(', ')} ]</p>;
        }
    }
    return(
        <> 
            {props.result && <section className={styles.resultSection}>
                <h2 className={styles.sectionHeader}>Result</h2>
                <div className={styles.resultContainer}>
                    {props.graphImage && 
                        <div className={styles.resultGraph}>
                            <h3>Graph</h3>
                            <img src={props.graphImage} alt="Graph" className={styles.graphImage}/>
                        </div>
                    }
                    <div className={styles.resultOutput}>
                        {displaySolution()}
                        <p><span className="bold">Computation Time:</span>  {Math.round(props.result.time*100)/100}s</p>
                    </div>
                </div>
            </section>}
        </>
    )
}

export default QiskitOpResult;