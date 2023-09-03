import './style.css'
import { useReducer } from "react"
import DigitButton from './digitcutton'
import OperationButton from './Operationbutton'
import React from 'react'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'chosse-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'

}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOp: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOp === "0") return state
      if (payload.digit === "." && state.currentOp.includes(".")) return state
      return {
        ...state,
        currentOp: `${state.currentOp || ''}${payload.digit}`
      }


    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOp == null && state.prevOp == null) {
        return state
      }
      if (state.prevOp == null) {
        return {
          ...state,
          Operation: payload.Operation,
          prevOp: state.currentOp,
          currentOp: null,
        }
      }
      if (state.currentOp == null) {
        return {
          ...state,
          Operation: payload.Operation
        }
      }
      return {
        ...state,
        prevOp: evaluate(state),
        Operation: payload.Operation,
        currentOp: null,
      }
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOp: null,
          overwrite: false,
        }
      }
      if (state.currentOp == null) return state
      if (state.currentOp.length === 1) {
        return {
          ...state,
          currentOp: null,
        }
      }
      return {
        ...state,
        currentOp: state.currentOp.slice(0, -1),
      }



    case ACTIONS.EVALUATE:
      if (state.prevOp == null || state.currentOp == null || state.Operation == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        currentOp: evaluate(state),
        prevOp: null,
        Operation: null,
      }
  }
  function evaluate({ prevOp, Operation, currentOp }) {
    const prev = parseFloat(prevOp)
    const current = parseFloat(currentOp)
    if (isNaN(prev) || isNaN(current)) return ""
    let computation = ""
    switch (Operation) {
      case "+":
        computation = prev + current
        break
      case "-":
        computation = prev - current
        break
      case "*":
        computation = prev * current
        break
      case "÷":
        computation = prev / current
        break

    }
    return computation.toString()
  }
}


function App() {
  const [{ prevOp, currentOp, Operation }, dispatch] = useReducer(reducer, {})
  return (
    <div className='calculator-grid'>
      <div className="output">
        <div className="previous-output">{prevOp} {Operation}</div>
        <div className="current-output">{currentOp}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })} >DEL</button>
      <OperationButton Operation='÷' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton Operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton Operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton Operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })} >=</button>

    </div>
  );
}

export default App;