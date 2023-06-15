import Options from './Options';

const Question = ({ questionData, dispatch, answer }) => {
  const { question, options, correctOption } = questionData;

  return (
    <div>
      <h4>{question}</h4>
      <Options
        options={options}
        dispatch={dispatch}
        answer={answer}
        correctOption={correctOption}
      />
    </div>
  );
};

export default Question;
