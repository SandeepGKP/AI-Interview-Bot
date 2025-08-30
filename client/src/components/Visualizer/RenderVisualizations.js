import React from 'react';
import { useTranslation } from 'react-i18next';
import TreeVisualizations from "./TreeVisualizations";
import StackVisualization from "./StackVisualization"; // Import StackVisualization
import QueueVisualization from "./QueueVisualization"; // Import QueueVisualization

const RenderVisualization = React.memo(({
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
  const { t } = useTranslation();
  if (algorithmType === "Sorting" || algorithmType === "Array" || algorithmType === "Searching") {
    return renderArrayVisualization();
  } else if (algorithmType === "Graph") {
    return renderGraphVisualization();
  } else if (algorithmType === "Tree") {
    return (
      <TreeVisualizations
        data={data}
        output={output}
        animations={animations}
        currentStep={currentStep}
        algorithmType={algorithmType}
        speed={speed}
        algorithm={algorithm}
      />
    );
  } else if (algorithmType === "Stack") {
    return (
      <StackVisualization
        data={data}
        output={output}
        animations={animations}
        currentStep={currentStep}
        speed={speed}
      />
    );
  } else if (algorithmType === "Queue") {
    return (
      <QueueVisualization
        data={data}
        output={output}
        animations={animations}
        currentStep={currentStep}
        speed={speed}
      />
    );
  }
  return (
    <p className="bg-gradient-text text-transparent bg-clip-text">
      {t('select_algorithm_for_visualization')}
    </p>
  );
});

export default RenderVisualization;
