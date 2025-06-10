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

export default function CliqueSolver() {
    const [result, setResult] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState('');
    const [graphImage, setGraphImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <PageLayout>
            <CenteredContainer>
                <Header header="Quantum Clique Solver"/>
                <Intro 
                    problem="Clique Problem" 
                    description="The Clique problem is about finding a 
                    group of nodes where every node is directly connected 
                    to every other node in the group"
                    id="clique"
                />
                <MainContainer>
                    <GraphConfig 
                        problemType="clique"
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
                            problemType="clique"
                        />
                    }
                </MainContainer>
            </CenteredContainer>
        </PageLayout>
    )
}