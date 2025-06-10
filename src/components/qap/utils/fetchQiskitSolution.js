export async function fetchQiskitSolution(
    problemType,
    payload,
    setResult,
    setError,
    setGraphImage,
    setIsLoaded,
    setIsLoading
){
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    
    setIsLoading(true);
    try {
        // Step 1: Fetch soluion from backend
        const solutionResponse = await fetch(`${BASE_URL}/qap/${problemType}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (solutionResponse.ok){
            const solutionData = await solutionResponse.json();
            setResult(solutionData); 
        } else{
            const errorData = await solutionResponse.json();
            console.error("Error fetching solution:", solutionResponse.statusText);
            setError(errorData.error || "An error occurred while fetching the solution.");
            return;
        }

        // Step 2: Fetch graph image from backend
        const nonGraphProblemTypes = ["knapsack", "number-partition", "exact-cover"]
        if (!nonGraphProblemTypes.includes(problemType)){
            const imageResponse = await fetch(`${BASE_URL}/qap/${problemType}/graph-image`);
            if (imageResponse.ok){
                const imageData = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageData);
                setGraphImage(imageUrl);
            } else {
                const errorData = await imageResponse.json();
                console.error("Error fetching graph image:", imageResponse.statusText);
                setError(errorData.error || "An error occurred while fetching the graph image.");
                return;
            }
        }
    } catch (error){
        console.error("Error:", error);
        setError("An error occurred while fetching the solution.");
    } finally {
        setIsLoaded(true);
        setIsLoading(false);
    }
}