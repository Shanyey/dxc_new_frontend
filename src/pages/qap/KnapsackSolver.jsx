import { useState } from 'react';
import PageLayout from '../../components/qap/PageLayout/PageLayout.jsx';
import Header from '../../components/qap/Header/Header.jsx';
import Intro from '../../components/qap/Intro/Intro.jsx';
import KnapsackConfig from '../../components/qap/Config/KnapsackConfig.jsx';
import QiskitOpResult from '../../components/qap/QiskitOpResult/QiskitOpResult.jsx';
import LoadingAnimation from '../../components/qap/LoadingAnimation/LoadingAnimation.jsx';
import MainContainer from '../../components/qap/MainContainer/MainContainer.jsx';
import CenteredContainer from '../../components/qap/CenteredContainer/CenteredContainer.jsx';
import ErrorMsg from '../../components/qap/ErrorMsg/ErrorMsg.jsx';

export default function KnapsackSolver() {

    const [result, setResult] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([
        {id: 0, value:2, weight:1},
        {id: 1, value:3, weight:1},
        {id: 2, value:4, weight:1}
    ]);
    const [valueSum, setValueSum] = useState("");



    return (
        <PageLayout>
            <CenteredContainer>
                <Header header="Quantum Knapsack Solver"/>
                <Intro 
                    problem="Knapsack Problem" 
                    description="The Knapsack problem is about 
                    choosing a set of items to carry so that the 
                    total weight stays within a limit and the total 
                    value is as high as possible."
                    id="knapsack"
                />
                <MainContainer>
                    <KnapsackConfig
                        problemType="knapsack"
                        setResult={setResult} 
                        setIsLoaded={setIsLoaded}
                        setIsLoading={setIsLoading}
                        setError={setError}
                        setGraphImage={()=>{}}
                        items={items}
                        setItems={setItems}
                    />
                    {error && <ErrorMsg error={error} />}
                    {isLoading && <LoadingAnimation />}
                    {isLoaded && 
                        <QiskitOpResult 
                            result={result} 
                            graphImage={null}
                            problemType="knapsack"
                            valueSum={valueSum}
                            setValueSum={setValueSum}
                            items={items}
                        />
                    }
                </MainContainer>
            </CenteredContainer>
        </PageLayout>
    )
}