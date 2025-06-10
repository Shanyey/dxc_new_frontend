import { useState } from 'react';
import PageLayout from '../../components/qap/PageLayout/PageLayout.jsx';
import Header from '../../components/qap/Header/Header.jsx';
import Intro from '../../components/qap/Intro/Intro.jsx';
import GraphConfig from '../../components/qap/Config/GraphConfig.jsx';
import QiskitOpResult from '../../components/qap/QiskitOpResult/QiskitOpResult.jsx';
import LoadingAnimation from '../../components/qap/LoadingAnimation/LoadingAnimation.jsx';
import MainContainer from '../../components/qap/MainContainer/MainContainer.jsx';
import CenteredContainer from '../../components/qap/CenteredContainer/CenteredContainer.jsx';
import ErrorMsg from '../../components/qap/ErrorMsg/ErrorMsg.jsx';

export default function TspSolver() {
    const [result, setResult] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState('');
    const [graphImage, setGraphImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <PageLayout>
            <CenteredContainer>
                <Header header="Quantum Tsp Solver"/>
                <Intro 
                    problem="Traveling Salesman Problem (Tsp)" 
                    description="The Traveling Salesman Problem is about 
                                finding the shortest route that visits every 
                                city once and returns to the starting city"
                    id="tsp"
                />
                <MainContainer>
                    <GraphConfig 
                        problemType="tsp"
                        setResult={setResult} 
                        setIsLoaded={setIsLoaded}
                        setGraphImage={setGraphImage}
                        setIsLoading={setIsLoading}
                        setError={setError}
                    />
                    {error && <ErrorMsg error={error} />}
                    {isLoading && <LoadingAnimation />}
                    {isLoaded && 
                        <QiskitOpResult 
                            result={result}
                            graphImage={graphImage}
                            problemType="tsp"
                        />}
                </MainContainer>
            </CenteredContainer>    
        </PageLayout>
    )
}