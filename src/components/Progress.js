const Progress = ({ index, numQuestions, points, totalMaxPoints, answer }) => {
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={index - 1 + Number(answer !== null)}
      />
      <p>
        Question
        <strong>
          {index}/{numQuestions}
        </strong>
      </p>
      <p>
        <strong>{points}</strong> / {totalMaxPoints}
      </p>
    </header>
  );
};

export default Progress;
