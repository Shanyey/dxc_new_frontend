import styles from './Docs.module.css'
import PageLayout from '../../../components/qap/PageLayout/PageLayout.jsx';
import Header from '../../../components/qap/Header/Header.jsx';
import graphPartitionGoodImg from '../../../assets/qap/graph_partition_good.jpg'
import graphPartitionBadImg from '../../../assets/qap/graph_partition_bad.jpg'
import maxCutImg from '../../../assets/qap/max_cut_graph.jpg'
import stableSetImg from '../../../assets/qap/stable_set_graph.png'
import tspImg from '../../../assets/qap/tsp.jpg'
import vertexCoverImg from '../../../assets/qap/vertex_cover_graph.png'
import exactCoverImg1 from '../../../assets/qap/exact_cover_eg1.png'
import exactCoverImg2 from '../../../assets/qap/exact_cover_eg2.png'
import exactCoverImg3 from '../../../assets/qap/exact_cover_eg3.png'
import knapsackImg from '../../../assets/qap/knapsack.png'
import numberPartitionImg from '../../../assets/qap/number_partition_eg.png'

export default function Docs(){

    return(
        <PageLayout>
            <Header header="Documentation"/>
            <div id="quantum-solver" className={styles.problemContainer + " " + styles.intro}>
                <h2>Quantum App Platform</h2>
                <p>
                    QAP is a platform that leverages the power of quantum computing to tackle problems that are 
                    computationally hard for classical computers. In theory, quantum computers can solve such problems 
                    significantly faster than classical ones. However, due to current hardware limitations, only small-scale 
                    instances can be effectively solved for now.
                </p>
                <p>
                    This platform provides hands-on exposure to how quantum computing can be applied to optimization problems. 
                    As the technology matures, we anticipate quantum computers will take on larger and more complex challenges 
                    in areas like cryptography, drug discovery, logistics, and machine learning — unlocking solutions that 
                    remain out of reach for even today’s most powerful classical systems.
                </p>
                <h3>How does QAP work?</h3>
                <p>
                    QAP uses a quantum algorithm called the Quantum Approximate Optimization Algorithm (QAOA).
                    QAOA is designed to find approximate solutions to hard optimization problems. It encodes these problems
                    into a quantum circuit, uses tunable parameters to guide the system toward better answers, and iteratively 
                    refines those parameters using feedback from classical computation.
                </p>
            </div>
            <div id="clique" className={styles.problemContainer}>
                <h2>Clique Problem</h2>
                <h3>What is it?</h3>
                <p>The Clique problem is about finding a group of nodes 
                    where every node is directly connected to every other 
                    node in the group
                </p>
                <img 
                    className={styles.cliqueImg}
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/VR_complex.svg/500px-VR_complex.svg.png" 
                    alt="Clique Problem Graph Representation"
                />
                <p>The image shows 2 shades of blues within the graphs, 
                    the darker shade represents a clique of 4 nodes,
                    while the lighter shade repesents a clique of 3 nodes. 
                    Each node in a clique is connected to every other node 
                    in the clique through an edge. In this version of the clique problem,
                    only one instance of the clique can be presented in the solution.
                </p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Social Circle Finder</h4>
                        <p>Within a community of people, cliques where everyone knows each other, 
                            can be found through the help of the quantum clique solver.
                        This can help identify close-knit groups or social circles.</p>
                    </li>
                </ul>

            </div>
            <div id="graph-partition" className={styles.problemContainer}>
                <h2>Graph Partition Problem</h2>
                <h3>What is it?</h3>
                <p>The Graph Partition problem is about splitting a network 
                    into two equal halves while keeping the connections <br/>
                    between them as few or as light as possible
                </p>
                <img 
                    className={styles.graphPartitionGoodImg}
                    src={graphPartitionGoodImg}
                    alt="Graph Partition Good Example"
                />
                <img 
                    className={styles.graphPartitionBadImg}
                    src={graphPartitionBadImg}
                    alt="Graph Partition Bad Example"
                />
                <p>These 2 images represents a good partition and a bad partition.
                     Both partitions the graph into 2 equal groups of 3 nodes, 
                     however the left image shows 2 edges resulting from the partition,
                     while the right image results in 3 edges in the partition. <br/>Note that
                     in this graph configuration, there is more than 1 optimal solution.</p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Immunization</h4>
                        <p>The Graph Partition Problem can help identify the smallest set of individuals 
                            or connections that, if immunized, would block the spread of a disease through a network. 
                            By targeting these key nodes or links, health resources can be used more efficiently to prevent 
                            large-scale outbreaks.</p>
                    </li>
                    <li>
                        <h4>Prevent Spread of Fake News/Viral Messages</h4>
                        <p>The Graph Partition Problem helps in dividing the network into smaller groups with 
                            minimal connections between them. By identifying and targeting these few critical connections (or nodes), 
                            the spread can be contained more effectively.</p>
                    </li>
                </ul>
            </div>
            <div id="max-cut" className={styles.problemContainer}>
                <h2>Max Cut Problem</h2>
                <h3>What is it?</h3>
                <p>The Max-Cut problem is about dividing a network into 
                    two parts so that as many heavy connections as possible 
                    run between the two sides
                </p>
                <img 
                    className={styles.maxCutImg}
                    src={maxCutImg}
                    alt="Max Cut Problem Graph Representation"
                />
                <p>The red-dotted line indicates the cut in the graph, separating the nodes into two groups (red and blue).
                    The goal is to maximize the sum of weights of the edges that cross the cut. In this case, the max-cut value
                    is 18.
                </p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Machine Learning</h4>
                        <p>Max-Cut can be used to split data into two groups for tasks like 
                            yes/no or true/false decisions. It treats each item as a point 
                            and uses the "distance" between them to decide how to separate them. 
                            Unlike other methods, it doesn’t need detailed features—just 
                            how similar or different the items are.</p>
                    </li>
                    <li>
                        <h4>Circuit Design</h4>
                        <p>In designing electronic circuits, Max-Cut helps split components into 
                            two groups so that the number of connections between the groups is as large as possible. 
                            Why? Because once the parts are grouped, engineers can place them on separate sections of a chip. 
                            This reduces long wires and interference, making the circuit more efficient and easier to build.</p>
                    </li>                
                </ul>
            </div>
            <div id="stable-set" className={styles.problemContainer}>
                <h2>Stable Set Problem</h2>
                <p>The Stable Set problem is about picking the largest 
                    group of points in a network where none of them are 
                    directly connected
                </p>
                <img 
                    className={styles.stableSetImg}
                    src={stableSetImg}
                    alt="Stable Set Problem Graph Representation"
                />
                <p>Notice that each red node is not directly connected to another red node.
                    In this case, the largest stable set is 4 nodes.
                </p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Resource Allocation</h4>
                        <p>The Stable Set Problem can help in resource allocation by identifying 
                            the largest set of non-conflicting tasks or resources. Each task or resource
                            can be represented as a node, and a conflict would represent an edge between
                            the corressponding nodes. Through the quantum stable set solver, it ensures that 
                            resources are used efficiently without conflicts.</p>
                    </li>
                    <li>
                        <h4>Scheduling</h4>
                        <p>In scheduling, the Stable Set Problem can be used to find the largest set of 
                            non-overlapping tasks or events. This helps in maximizing the number of tasks 
                            that can be scheduled without conflicts.</p>
                    </li>
                </ul>
            </div>
            <div id="tsp" className={styles.problemContainer}>
                <h2>Traveling Salesman Problem</h2>
                <p>The Traveling Salesman Problem is about finding the 
                    shortest route that visits every city once and 
                    returns to the starting city
                </p>
                <div className={styles.imgContainer}>   
                    <img 
                        className={styles.tspImg}
                        src={tspImg}
                        alt="Traveling Salesman Problem Graph Representation"
                    />
                </div>
                <p>In this example, the best route for the man would be: 3 → 2 → 1 → 0 → 3.</p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Logistics and Supply Chain</h4>
                        <p>The Traveling Salesman Problem can help in optimizing delivery routes for 
                            logistics companies. By finding the shortest path that visits all delivery points, 
                            companies can save time and fuel costs.</p>
                    </li>
                    <li>
                        <h4>Robotics</h4>
                        <p>In robotics, the Traveling Salesman Problem can be used to plan the most efficient 
                            path for robots to follow when performing tasks in an environment. </p>
                    </li>
                </ul>
            </div>
            <div id="vertex-cover" className={styles.problemContainer}>
                <h2>Vertex Cover Problem</h2>
                <p>The Vertex Cover problem is about choosing the 
                    smallest number of key points in a network so 
                    that every connection is watched or covered
                </p>
                <img 
                    className={styles.vertexCoverImg}
                    src={vertexCoverImg}
                    alt="Vertex Cover Problem Graph Representation"
                />
                <p>Verify that every edge in the graph touches at least one red node.</p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Urban Surveilance System</h4>
                        <p>Each node represents an area, and each edge represents a connection between areas. 
                            The Vertex Cover Problem helps find the smallest number of surveillance cameras 
                            needed so that every connection is watched. This ensures full coverage while 
                            using as few cameras as possible.</p>
                    </li>
                    <li>
                        <h4>Network Security</h4>
                        <p>In network security, the Vertex Cover Problem helps identify the smallest set of nodes 
                            (or devices) that need to be monitored or secured to protect all connections in a network. 
                            This is important for preventing unauthorized access and maintaining data integrity.</p>
                    </li>
                </ul>
            </div>
            <div id="exact-cover" className={styles.problemContainer}>
                <h2>Exact Cover Problem</h2>
                <p>The Exact Cover problem is about picking just the 
                    right groups from a collection so that every item 
                    is included once, with no repeats and nothing left out.
                </p>
                <img 
                    className={styles.exactCoverImg1}
                    src={exactCoverImg1}
                    alt="Subets 1 to 3 for exact cover problem example"
                />
                <img 
                    className={styles.exactCoverImg2}
                    src={exactCoverImg2}
                    alt="Subsets 4 to 6 for exact cover problem example"
                />
                <img 
                    className={styles.exactCoverImg3}
                    src={exactCoverImg3}
                    alt="Solution for exact cover problem example"
                />
                <p>This is an example showing the Exact Cover Problem. Given Subsets 1 to 6, the solution
                    would be to pick Subsets 2, 4 and 6. <br/>This way every element is covered exactly once.
                </p>
                <p className={styles.tryIt}>Try it for yourself! Go to the quantum exact cover solver. 
                    <br/>Click on each subset to edit the elements in it.</p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Puzzle Problems (eg. Tiling, Sudoku)</h4>
                        <p>In a tiling puzzle, like covering a board with L-shaped tiles, 
                            each way you place a tile is a subset of the board — it covers certain squares. 
                            The goal is to choose a set of tile placements so that every square is covered 
                            exactly once and no squares overlap. This is the essence of the Exact Cover Problem.
                            <br/>
                            <br/>
                            Similarly, in Sudoku, each possible move (placing a number in a cell) is a subset 
                            that satisfies four constraints: one cell, one row, one column, and one box. 
                            The Exact Cover solver selects a combination of moves so that every constraint 
                            is satisfied exactly once, giving a valid solution.</p>
                    </li>
                </ul>
            </div>
            <div id="knapsack" className={styles.problemContainer}>
                <h2>Knapsack Problem</h2>
                <p>The Knapsack problem is about choosing a set of items to 
                    carry so that the total weight stays within a limit and 
                    the total value is as high as possible.
                </p>
                <img 
                    className={styles.knapsackImg}
                    src={knapsackImg}
                    alt="Knapsack Problem Representation"
                />
                <p>The Knapsack Problem asks which item we should choose given the weight limit
                    such that the total value is maximized.
                </p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Investment Portfolio</h4>
                        <p>The Knapsack Problem can help choose the best mix of investments to 
                            maximize returns while staying within a fixed budget. Each investment 
                            is like an item with a cost (weight) and an expected return (value).</p>
                    </li>
                    <li>
                        <h4>Resource Allocation</h4>
                        <p>In resource allocation, the Knapsack Problem helps select the best set of 
                            resources to maximize output or efficiency while staying within limited 
                            capacity or cost constraints.</p>
                    </li>
                </ul>
            </div>
            <div id="number-partition" className={styles.problemContainer}>
                <h2>Number Partition Problem</h2>
                <p>The Number Partition problem is about splitting a group of 
                    numbers into two smaller groups so that both sides add up 
                    to the same total.
                </p>
                <img 
                    className={styles.numberPartitionImg}
                    src={numberPartitionImg}
                    alt="Number Partition Problem Example"
                />
                <p>This is an example taken from the Quantum Number Partition Solver.
                    Given the inputs above, the solution would split the numbers into
                    two groups, with each group adding up to 11.
                </p>
                <h3>What can it be used for?</h3>
                <ul>
                    <li>
                        <h4>Load Balancing</h4>
                        <p>The Number Partition Problem can help in distributing tasks or resources 
                            evenly across multiple servers or processors. By ensuring that each server 
                            has an equal load, it prevents overloading and improves overall system performance.</p>
                    </li>
                    <li>
                        <h4>Workload Distributer</h4>
                        <p>In a team setting, the Number Partition Problem can help divide tasks 
                            or projects among team members so that everyone has an equal amount of work. 
                            This ensures fairness and helps in managing workloads effectively.</p>
                    </li>
                </ul>
            </div>
        </PageLayout>

    )
}