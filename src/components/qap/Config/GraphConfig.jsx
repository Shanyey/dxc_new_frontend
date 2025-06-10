import NodesInput from '../FormInputs/NodesInput.jsx';
import EdgeInput from '../FormInputs/EdgeInput.jsx';
import FormBtn from '../FormInputs/FormBtn.jsx';
import CliqueSizeInput from '../FormInputs/CliqueSizeInput.jsx';
import styles from './Config.module.css';
import { useState } from 'react'; 
import RemoveItemsButton from '../ui/Buttons/RemoveItemsButton.jsx';
import { fetchQiskitSolution } from '../utils/fetchQiskitSolution.js';

function GraphConfig(props){
    const [nodes, setNodes] = useState(0);
    const [edgeFrom, setEdgeFrom] = useState("");
    const [edgeTo, setEdgeTo] = useState("");
    const [edges,setEdges] = useState([]);
    const [edgeWeight, setEdgeWeight] = useState("");
    const [cliqueSize, setCliqueSize] = useState("");

    const isWeightedProblemTypes = ["tsp", "max-cut"];
    const isWeighted = isWeightedProblemTypes.includes(props.problemType);
    const isCliqueProblem = props.problemType === "clique" ? true : false;
    
      

    function addEdge(){
        if (nodes === 0){
            props.setError("Please enter number of nodes");
            return;
        }
        if (isNaN(edgeFrom) || isNaN(edgeTo)) {
            props.setError("Please enter valid numbers for the edges");
            return;
        }

        if (edgeFrom === "" || edgeTo === "") {
            props.setError("Please enter a number in both edge inputs");
            return;
        }

        if (edgeFrom === edgeTo) {
            props.setError("Self-loops are not allowed");
            return;
        }

        if (edgeFrom < 0 || edgeTo < 0) {
            props.setError("Edge inputs must be positive numbers");
            return;
        }

        if (edgeFrom >= nodes || edgeTo >= nodes) {
            props.setError(`Edge inputs must be 0 - ${nodes-1}`);
            return;
        }
        
        if (edges.some(edge => (edge[0] === edgeFrom && edge[1] === edgeTo) 
            || (edge[0] === edgeTo && edge[1] === edgeFrom))) {
            props.setError("Edge already exists");
            return;
        } 

        if (isWeighted && isNaN(edgeWeight)) {
            props.setError("Edge weight must be a number");
            return;
        }

        if (isWeighted && edgeWeight <= 0) {
            props.setError("Edge weight must be a positive number");
            return;
        }


        props.setError("");
        if (isWeighted){
            setEdges(edgeList => [...edgeList, [edgeFrom, edgeTo, edgeWeight]]);
        } else {
            setEdges(edgeList => [...edgeList, [edgeFrom, edgeTo]]);
        }
        setEdgeFrom("");
        setEdgeTo("");
        setEdgeWeight(""); 
    }

    function removeEdge(index){
        setEdges(prevEdges => {
            const newEdges = [...prevEdges];
            newEdges.splice(index, 1)
            return newEdges;
    })}

    async function handleSubmit(e){
        e.preventDefault();

        if (edges.length === 0) {
            props.setError("Please add at least one edge");
            return;
        }

        props.setError("");

        let payload = {
            nodes: nodes,
            edges: edges
        };

        if (isCliqueProblem && cliqueSize > 0) {
            payload.size = cliqueSize;
        }

        await fetchQiskitSolution(
            props.problemType,
            payload,
            props.setResult,
            props.setError,
            props.setGraphImage,
            props.setIsLoaded,
            props.setIsLoading
            )
    };
    
    function handleReset(){
        props.setResult(null);
        props.setIsLoading(false);
        props.setError("");
        props.setGraphImage(null);
        props.setIsLoaded(false);
        setNodes(0);
        setEdges([]);
        setEdgeFrom("");
        setEdgeTo("");
        setEdgeWeight("");
    }

    return(
        <section className={styles.configurationSection}>
            <h2 className={styles.sectionHeader}>Graph Configuration</h2>
            <form className={styles.graphForm}>
                <NodesInput 
                    nodes={nodes}
                    setNodes={setNodes}
                />
                {isCliqueProblem && <CliqueSizeInput 
                                        cliqueSize={cliqueSize}
                                        setCliqueSize={setCliqueSize}
                                    />
                }
                <EdgeInput
                    nodes={nodes}
                    edgeList={edges}  
                    edgeTo={edgeTo} 
                    edgeFrom={edgeFrom}
                    edgeWeight={edgeWeight}
                    isWeighted={isWeighted}
                    addEdge={addEdge}
                    setEdgeFrom={setEdgeFrom}
                    setEdgeTo={setEdgeTo}
                    setEdgeWeight={setEdgeWeight}
                    
                />
                {edges.length > 0 && (
                    <div className={styles.addItemsContainer}>
                        <h4>Edges added:</h4>
                        <ul>
                            {edges.map((item,index) =>(
                                <li key={index}>
                                    ( {item[0]}, {item[1]} )  {isWeighted && `Weight: ${item[2]}` }
                                    <RemoveItemsButton
                                        type="button"
                                        onClick={() => {removeEdge(index)}}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <FormBtn handleSubmit={handleSubmit} handleReset={handleReset}/>
            </form>
        </section>
    )
}

export default GraphConfig;