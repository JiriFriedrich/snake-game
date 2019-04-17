import {Snake, IState} from './snake'
import * as base from './base'

const ONE_LOOP_IN_MILISECONDS = 50;

/**
 * Snake game web implementation
 */
export function SnakeWeb(canvas_id: string) {

    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let state: IState
    let x; let y;

    const snake = Snake();

    canvas = <HTMLCanvasElement> document.getElementById(canvas_id)
    ctx = canvas.getContext('2d')

    state = snake.initialState()

    // Position helpers
    x = c => Math.round(c * canvas.width / state.cols)
    y = r => Math.round(r * canvas.height / state.rows)

    // Key events
    window.addEventListener('keydown', e => {
        switch (e.key) {
            case 'w': case 'ArrowUp':    state = snake.addMove(state, base.NORTH); break
            case 'a': case 'ArrowLeft':  state = snake.addMove(state, base.WEST);  break
            case 's': case 'ArrowDown':  state = snake.addMove(state, base.SOUTH); break
            case 'd': case 'ArrowRight': state = snake.addMove(state, base.EAST);  break
        }
    })

    const start = () => {
        draw()
        window.requestAnimationFrame(step(0))
    }

    const draw = () => {
        ctx.fillStyle = '#232323'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#00C832'
        state.snake.map(el => ctx.fillRect(x(el.x), y(el.y), x(1), y(1)))

        ctx.fillStyle = '#FF0000'
        ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1))
    }

    // Game loop update
    const step = (t1: number) => (t2: number) => {
        if (t2 - t1 > ONE_LOOP_IN_MILISECONDS) {
            state = snake.nextState(state)
            draw()
            window.requestAnimationFrame(step(t2))
        } else {
            window.requestAnimationFrame(step(t1))
        }
    }

    /**
     * Return object that can't be changed
     */
    return Object.freeze({
        start
    })
}
