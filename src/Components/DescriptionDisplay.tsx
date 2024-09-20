const DescriptionDisplay = ({ description }) => {
  return <div dangerouslySetInnerHTML={{ __html: description }} />;
};

export default DescriptionDisplay;
