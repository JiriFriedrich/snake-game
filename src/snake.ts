import * as base from './base'
import * as R from "ramda"

export interface IPosition {
    x: number,
    y: number
}

export interface IState {
    cols: number,
    rows: number,
    moves: Array<IPosition>,
    snake: Array<IPosition>,
    apple: IPosition
}

/**
 * Snake game engine
 */
export function Snake() {

    const BASE_GAME_COLS = 20;
    const BASE_GAME_ROWS = 14;
    const BASE_SNAKE_POSITION_X = 2;
    const BASE_SNAKE_POSITION_Y = 2;
    const BASE_APPLE_POSITION_X = 16;
    const BASE_APPLE_POSITION_Y = 2;

    const modulo = (x : number) => (y : number) => ((y % x) + x) % x

    /**
     * Change or keep old move based on number of stored moves
     * @param state
     */
    const nextMoves = (state: IState) : Array<IPosition> =>
        state.moves.length > 1 ? state.moves.slice(1) : state.moves

    /**
     * Produce single position where the snake will be based on the last move
     * @param state
     */
    const nextHead = (state: IState) : IPosition => state.snake.length == 0
        ? { x: BASE_SNAKE_POSITION_X, y: BASE_SNAKE_POSITION_Y }
        : {
            x: modulo(state.cols)(state.snake[0].x + state.moves[0].x),
            y: modulo(state.rows)(state.snake[0].y + state.moves[0].y)
    }

    /**
     * Set up the snake
     * When snake eat the apple keep snake as it is otherwise remove last piece
     * @param state
     */
    const nextSnake = (state: IState) : Array<IPosition> => willCrash(state)
        ? []
        : (willEat(state)
            ? [nextHead(state)].concat(state.snake)
            : [nextHead(state)].concat(state.snake.slice(0, state.snake.length - 1)))

    /**
     * Generate new position when the snake eat the apple otherwise keep the apple position
     * @param state
     */
    const nextApple = (state: IState) : IPosition =>
        willEat(state) ? rndPos(state) : state.apple

    /**
     * Generates random position
     * @param state
     */
    const rndPos = (state : IState) : IPosition => ({
        x: Math.floor(Math.random() * (state.cols - 1)),
        y: Math.floor(Math.random() * (state.rows - 1))
    })

    /**
     * Determine whether the snake will eat apple in the next move
     * @param state
     */
    const willEat = (state: IState) : boolean => R.equals(nextHead(state), state.apple)

    /**
     * Determine whether the snake will bump to himself in the next move
     * @param state
     */
    const willCrash = (state: IState) : IPosition | undefined =>
        state.snake.find((position: IPosition) =>
            R.equals(nextHead(state), position))

    /**
     * Determine whether the snake won't go through himself in the next move
     * @param move
     */
    const validMove = (move: IPosition) => (state: IState) : boolean =>
        state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0

    /**
     * Returns initial state of the game
     */
    const initialState = () : IState => ({
        cols:  BASE_GAME_COLS,
        rows:  BASE_GAME_ROWS,
        moves: [base.EAST],
        snake: [],
        apple: { x: BASE_APPLE_POSITION_X, y: BASE_APPLE_POSITION_Y },
    })

    /**
     * Provide the new state by passing the old one (returns immutable object)
     * @param state
     */
    const nextState = (state: IState) => R.applySpec({
        cols:  R.prop('cols'),
        rows:  R.prop('rows'),
        moves: nextMoves,
        snake: nextSnake,
        apple: nextApple
    })(state)

    /**
     * If the next move is valid then add it to the list of moves,
     * otherwise return current state and do nothing
     * @param state
     * @param move
     */
    const addMove = (state: IState, move: IPosition) => validMove(move)(state)
        ? R.merge(state)({ moves: state.moves.concat([move]) })
        : state

    /**
     * Return object that can't be changed (encapsulation)
     */
    return Object.freeze({
        initialState,
        nextState,
        addMove
    })
}
