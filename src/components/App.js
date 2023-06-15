import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import StartScreen from './StartScreen';
import Loader from './Loader';
import Error from './Error';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';

const initialState = {
  questions: [],
  //'loading','error','ready','active','finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  secondRemaining: null,
};

const SEC_PER_QUESTION = 30;

const reducer = (state, action) => {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };

    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };

    case 'start':
      return {
        ...state,
        status: 'active',
        secondRemaining: state.questions.length * SEC_PER_QUESTION,
      };

    case 'newAnswer':
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case 'finish':
      return {
        ...state,
        status: 'finished',
      };
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
      };

    case 'tick':
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? 'finished' : state.status,
      };

    default:
      throw new Error('Action is unknown');
  }
};

/************************************************************************************************/

function App() {
  const [
    { questions, status, index, answer, points, secondRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const totalMaxPoints = questions.reduce(
    (prev, current) => prev + current.points,
    0
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('http://localhost:8000/questions');
        const data = await response.json();
        dispatch({ type: 'dataReceived', payload: data });
      } catch (error) {
        dispatch({ type: 'dataFailed' });
      }
    };
    getData();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index + 1}
              numQuestions={numQuestions}
              totalMaxPoints={totalMaxPoints}
              points={points}
              answer={answer}
            />
            <Question
              questionData={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            totalMaxPoints={totalMaxPoints}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
