import TreeVisualization from "./treeVisualization";

const RenderVisualization = ({
  data,
  output,
  animations,
  currentStep,
  algorithmType,
  speed,
  algorithm,
  renderGraphVisualization,
  renderArrayVisualization,
}) => {
  if (algorithmType === "Sorting" || algorithmType === "Array" || algorithmType === "Searching") {
    return renderArrayVisualization();
  } else if (algorithmType === "Graph") {
    return renderGraphVisualization();
  } else if (algorithmType === "Tree") {
    return (
      <TreeVisualization
        data={data}
        output={output}
        animations={animations}
        currentStep={currentStep}
        algorithmType={algorithmType}
        speed={speed}
        algorithm={algorithm}
      />
    );
  }
  return (
    <p className="bg-gradient-text text-transparent bg-clip-text">
      Select an algorithm to see its visualization.
    </p>
  );
};

export default RenderVisualization;
