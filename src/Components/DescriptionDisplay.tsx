import React from "react";

interface DescriptionDisplayProps {
  description: string;
}

const DescriptionDisplay: React.FC<DescriptionDisplayProps> = ({
  description,
}) => {
  return <div dangerouslySetInnerHTML={{ __html: description }} />;
};

export default DescriptionDisplay;
