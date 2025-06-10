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

export default function StableSetSolver() {
    const [result, setResult] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState('');
    const [graphImage, setGraphImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <PageLayout>
            <CenteredContainer>
                <Header header="Quantum Stable Set Solver"/>
                <Intro 
                    problem="Stable Set Problem" 
                    description="The Stable Set problem is about picking 
                    the largest group of points in a network where none 
                    of them are directly connected"
                    id="stable-set"
                />
                <MainContainer>
                    <GraphConfig 
                        problemType="stable-set"
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
                            problemType="stable-set"
                        />}
                </MainContainer>
            </CenteredContainer>
        </PageLayout>
    )
}