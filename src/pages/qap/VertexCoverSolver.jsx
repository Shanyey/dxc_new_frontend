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

export default function VertexCoverSolver() {
    const [result, setResult] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState('');
    const [graphImage, setGraphImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <PageLayout>
            <CenteredContainer>
                <Header header="Quantum Vertex Cover Solver"/>
                <Intro 
                    problem="Vertex Cover Problem" 
                    description="The Vertex Cover problem is about choosing the smallest number 
                    of key points in a network so that every connection is watched 
                    or covered"
                    id="vertex-cover"
                />
                <MainContainer>
                    <GraphConfig 
                        problemType="vertex-cover"
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
                            problemType="vertex-cover"
                        />
                    }
                </MainContainer>
            </CenteredContainer>
        </PageLayout>
        
    )
}