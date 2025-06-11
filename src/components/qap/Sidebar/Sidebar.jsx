import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'

export default function Sidebar(){
    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <Link to="/qap">QAP</Link>
            </div>
            <nav className={styles.nav}>
                <h4>Graph Problems</h4>
                <Link to="/qap/clique-solver">Clique</Link>
                <Link to="/qap/graph-partition-solver">Graph Partition</Link>
                <Link to="/qap/max-cut-solver">Max Cut</Link>
                <Link to="/qap/stable-set-solver">Stable Set</Link>
                <Link to="/qap/tsp-solver">Traveling Salesman</Link>
                <Link to="/qap/vertex-cover-solver">Vertex Cover</Link>
                <h4>Non-graph Problems</h4>
                <Link to="/qap/exact-cover-solver">Exact Cover</Link>
                <Link to="/qap/knapsack-solver">Knapsack</Link>
                <Link to="/qap/number-partition-solver">Number Partition</Link>
            </nav>
        </div>
    )
}