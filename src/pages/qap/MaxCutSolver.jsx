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
                <Header header="Quantum Max-Cut Solver"/>
                <Intro 
                    problem="Max-Cut Problem" 
                    description="The Max-Cut problem is about dividing 
                    a network into two parts so that as many heavy connections 
                    as possible run between the two sides"
                    id="max-cut"
                />
                <MainContainer>
                    <GraphConfig 
                        problemType="max-cut"
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
                            problemType="max-cut"
                        />
                    }
                </MainContainer>
            </CenteredContainer>
        </PageLayout>
    )
}