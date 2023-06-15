const FinishScreen = ({ points, totalMaxPoints, dispatch }) => {
  const percentage = (points / totalMaxPoints) * 100;
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {totalMaxPoints} (
        {Math.ceil(percentage)}%)
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'restart' })}
      >
        Restart quiz
      </button>
    </>
  );
};

export default FinishScreen;
