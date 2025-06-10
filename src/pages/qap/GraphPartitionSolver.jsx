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

export default function GraphPartitionSolver() {
    const [result, setResult] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState('');
    const [graphImage, setGraphImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <PageLayout>
            <CenteredContainer>
                <Header header="Quantum Graph Partition Solver"/>
                <Intro 
                    problem="Graph Partition Problem" 
                    description="The Graph Partition problem is about splitting 
                    a network into two equal halves while keeping the connections 
                    between them as few or as light as possible"
                    id="graph-partition"
                />
                <MainContainer>
                    <GraphConfig 
                        problemType="graph-partition"
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
                            problemType="graph-partition"
                        />
                    }
                </MainContainer>
            </CenteredContainer>
        </PageLayout>
    )
}