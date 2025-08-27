
import renderTreeVisualization from "./treeVisualization";

const renderVisualization = ({ data, output, animations, currentStep, algorithmType, speed, algorithm, renderGraphVisualization, renderArrayVisualization}) => {
  if (algorithmType === 'Sorting' || algorithmType === 'Array' || algorithmType === 'Searching') {
    return renderArrayVisualization();
  } else if (algorithmType === 'Graph') {
    return renderGraphVisualization();
  } else if (algorithmType === 'Tree') {
    return renderTreeVisualization({data, output, animations, currentStep, algorithmType, speed, algorithm});
  }
  return <p className="bg-gradient-text text-transparent bg-clip-text">Select an algorithm to see its visualization.</p>;
};

export default renderVisualization;