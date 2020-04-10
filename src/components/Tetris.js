import React, {useState} from 'react';
import {createStage, checkCollision} from '../gameHelpers';

// Styled components
import {StyledTetrisWrapper, StyledTetris} from './styles/StyledTetris';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

// Custom Hooks
import {usePlayer} from '../hooks/usePlayer';
import {useStage} from '../hooks/useStage';
import {useInterval} from '../hooks/useInterval';
import {useGameStatus} from '../hooks/useGameStatus';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  console.log('re-render');

  const movePlayer = dir => {
    if (!checkCollision(player, stage, {x: dir, y: 0})) {
      updatePlayerPos({x: dir, y: 0});
    }
  };

  const startGame = () => {
    // RESET
    setStage(createStage());
    setDropTime(800);
    resetPlayer();
    setGameOver(false);
    setScore(0)
    setRows(0)
    setLevel(0)
  };

  const drop = () => {
    // INCREASE LEVEL AFTER 10 ROWS
    if(rows > (level + 1) * 10) {
      setLevel(prev => prev + 1)
      // INCREASE SPEED ON NEW LEVEL
      setDropTime(800/ (level + 1) + 200)
    }

    if (!checkCollision(player, stage, {x: 0, y: 1})) {
      updatePlayerPos({x: 0, y: 1, collided: false});
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log('GAME OVER!!!');
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({x: 0, y: 0, collided: true});
    }
  };

  const keyUp = ({keyCode}) => {
    if (!gameOver) {
      if (keyCode === 40) {
        console.log('interval on');
        setDropTime(800/ (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    console.log('interval off');
    setDropTime(null);
    drop();
  };

  const move = ({keyCode}) => {
    if (!gameOver) {
      if (keyCode === 37) {
        // MOVE LEFT
        movePlayer(-1);
      } else if (keyCode === 39) {
        // MOVE RIGHT
        movePlayer(1);
      } else if (keyCode === 40) {
        // MOVE DOWN
        dropPlayer();
        // ROTATE
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      }
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level + 1}`} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
