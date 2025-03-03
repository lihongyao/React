import { ChangeEvent, memo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { decrement, increment, incrementAsync, incrementByAmount, selectCount } from "@/store/slices/counterSlice";
import "./index.css";

export default memo(function Counter() {
  // -- state
  const [incrementAmount, setIncrementAmount] = useState("5");
  // -- stores
  const count = useAppSelector(selectCount);
  // -- dispatch
  const dispatch = useAppDispatch();
  // -- methods
  const getNumAmount = () => Number(incrementAmount) || 0;
  // -- events
  const onIncrement = () => dispatch(increment());
  const onDecrement = () => dispatch(decrement());
  const onAddAmount = () => dispatch(incrementByAmount(getNumAmount()));
  const onAddAsync = () => dispatch(incrementAsync(getNumAmount()));
  const onInputChange = ($event: ChangeEvent<HTMLInputElement>) => setIncrementAmount($event.target.value);
  // -- renders
  return (
    <div className="counter">
      <div className="row">
        <button className="button" onClick={onIncrement}>
          +
        </button>
        <span className="value">{count}</span>
        <button className="button" onClick={onDecrement}>
          -
        </button>
      </div>
      <div className="row">
        <input className="textbox" value={incrementAmount} onChange={onInputChange} />
        <button className="button" onClick={onAddAmount}>
          Add Amount
        </button>
        <button className="button asyncButton" onClick={onAddAsync}>
          Add Async
        </button>
      </div>
    </div>
  );
});
