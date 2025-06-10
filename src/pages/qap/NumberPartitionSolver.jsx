import { useState } from 'react';
import PageLayout from '../../components/qap/PageLayout/PageLayout.jsx';
import Header from '../../components/qap/Header/Header.jsx';
import Intro from '../../components/qap/Intro/Intro.jsx';
import NumberPartitionConfig from '../../components/qap/Config/NumberPartitionConfig.jsx';
import QiskitOpResult from '../../components/qap/QiskitOpResult/QiskitOpResult.jsx';
import LoadingAnimation from '../../components/qap/LoadingAnimation/LoadingAnimation.jsx';
import MainContainer from '../../components/qap/MainContainer/MainContainer.jsx';
import CenteredContainer from '../../components/qap/CenteredContainer/CenteredContainer.jsx';
import ErrorMsg from '../../components/qap/ErrorMsg/ErrorMsg.jsx';

export default function NumberPartitionSolver() {

    const [result, setResult] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [subsets, setSubsets] = useState(
        [{elements:[1,4,7,3,5,2], isEditing:false, newElement:"", error:""}]);   

    return (
        <PageLayout>
            <CenteredContainer>
                <Header header="Quantum Number Partition Solver"/>
                <Intro 
                    problem="Number Partition Problem" 
                    description="The Number Partition problem is about splitting 
                    a group of numbers into two smaller groups so that both sides 
                    add up to the same total."
                    id="number-partition"
                />
                <MainContainer>
                    <NumberPartitionConfig
                        problemType="number-partition"
                        subsets={subsets}
                        setResult={setResult} 
                        setIsLoaded={setIsLoaded}
                        setIsLoading={setIsLoading}
                        setFormError={setFormError}
                        setSubsets={setSubsets}
                        setGraphImage={()=>{}}
                    />
                    {formError && <ErrorMsg error={formError} />}
                    {isLoading && <LoadingAnimation />}
                    {isLoaded && 
                        <QiskitOpResult 
                            result={result} 
                            graphImage={null}
                            problemType="number-partition"
                            subsets={subsets}
                        />
                    }
                </MainContainer>
            </CenteredContainer>
        </PageLayout>
    )
}