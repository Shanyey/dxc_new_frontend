import { useState } from 'react';
import PageLayout from '../../components/qap/PageLayout/PageLayout.jsx';
import Header from '../../components/qap/Header/Header.jsx';
import Intro from '../../components/qap/Intro/Intro.jsx';
import ExactCoverConfig from '../../components/qap/Config/ExactCoverConfig.jsx';
import QiskitOpResult from '../../components/qap/QiskitOpResult/QiskitOpResult.jsx';
import LoadingAnimation from '../../components/qap/LoadingAnimation/LoadingAnimation.jsx';
import MainContainer from '../../components/qap/MainContainer/MainContainer.jsx';
import CenteredContainer from '../../components/qap/CenteredContainer/CenteredContainer.jsx';
import ErrorMsg from '../../components/qap/ErrorMsg/ErrorMsg.jsx';

export default function ExactCoverSolver() {

    const [result, setResult] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [subsets, setSubsets] = useState(
        [{elements:[1,4,7], isEditing:false, newElement:"", error:""}, 
        {elements:[1,4], isEditing:false, newElement:"", error:""},
        {elements:[4,5,7], isEditing:false, newElement:"", error:""},
        {elements:[3,5,6], isEditing:false, newElement:"", error:""},
        {elements:[2,3,6,7], isEditing:false, newElement:"", error:""},
        {elements:[2,7], isEditing:false, newElement:"", error:""}
        ]);   
    
    return (
        <PageLayout>
            <CenteredContainer>
                <Header header="Quantum Exact Cover Solver"/>
                <Intro 
                    problem="Exact Cover Problem" 
                    description="The Exact Cover problem is about picking 
                    just the right groups from a collection so that every item 
                    is included once, with no repeats and nothing left out."
                    id="exact-cover"
                />
                <MainContainer>
                    <ExactCoverConfig
                        problemType="exact-cover"
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
                            problemType="exact-cover"
                            subsets={subsets}
                        />
                    }
                </MainContainer>
            </CenteredContainer>
        </PageLayout>
    )
}