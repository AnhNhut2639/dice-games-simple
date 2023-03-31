import React, { useCallback, useEffect, useState } from "react";
import { useShallowEqualSelector } from "../../hooks/useShallowEqualSelector";
import {
  getCurrentMoney,
  priceBet,
  winBet,
  selectLoading,
  setLoading,
  getMileStoneCompare,
  setMileStoneCompare,
} from "../../store/slices/appSlice";
import { formatNumber } from "../../utils";
import { useDispatch } from "react-redux";
import AnimatedNumbers from "react-animated-numbers";
import SuccessSound from "../../audio/success.mp3";
import SpinSound from "../../audio/spin.mp3";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
const HashDice = () => {
  const dispatch = useDispatch();
  const [numberRandom, setNumberRandom] = useState<number>(0);
  const [countRight, setCountRight] = useState<boolean>(false);
  const [MoneyAdd, setMoneyAdd] = useState<number>(0);
  const [arrayNumbersRandom, setArrayNumbersRandom] = useState<Array<string>>(
    []
  );
  // low and hight
  const [low, setLow] = useState<number>(50000);
  const [high, setHigh] = useState<number>(49999);
  // audio
  const audioSuccess = new Audio(SuccessSound);
  const audioSpin = new Audio(SpinSound);

  // amount
  const currentMoney = useShallowEqualSelector(getCurrentMoney);
  const isLoading = useShallowEqualSelector(selectLoading);
  const currentMileStoneCompare = useShallowEqualSelector(getMileStoneCompare);
  const [amount, setAmount] = useState<number>(100000);
  const [payout, setPayout] = useState<number>(1.98);
  const [chance, setChance] = useState<number>(50);

  const maxLimit = 99000;
  const setDoubleAmount = () => {
    if (amount >= currentMoney) {
      setAmount(currentMoney);
      return;
    }
    setAmount(amount * 2);
  };
  const setDivideDoubleAmount = () => {
    if (amount <= 100000) {
      setAmount(100000);
      return;
    }
    setAmount(amount / 2);
  };
  const generateNumbers = () => {
    const min = 10000;
    const max = 99999;

    audioSpin.play();
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    const arr = num.toString();
    const highSet = max - chance;
    if (isNaN(payout) || payout === 0) {
      setPayout(1);
    }
    if (payout > 500) {
      setPayout(500);
    }
    flushSync(() => {
      setLow(chance);
      setHigh(highSet);
    });
    dispatch(priceBet(amount));
    dispatch(setLoading(true));
    const newNumbers = Array.from(arr);
    setArrayNumbersRandom(newNumbers);
    setNumberRandom(num);
  };
  useEffect(() => {
    dispatch(setMileStoneCompare(high));
  }, [high, low]);

  const compare = useCallback(() => {
    if (Math.round(currentMileStoneCompare) === high) {
      if (Math.round(numberRandom) > high) {
        setCountRight(true);
        const result = amount * payout + amount;
        setMoneyAdd(amount * payout);
        audioSuccess.play();
        dispatch(winBet(result));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        return;
      }
    }
    if (Math.round(currentMileStoneCompare) === low) {
      if (Math.round(numberRandom) <= low) {
        setCountRight(true);
        const result = amount * payout + amount;
        setMoneyAdd(amount * payout);
        audioSuccess.play();
        dispatch(winBet(result));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        return;
      }
    }
    dispatch(setLoading(false));
  }, [numberRandom]);

  useEffect(() => {
    if (numberRandom <= 0) return;
    setTimeout(() => {
      compare();
    }, 2000);
  }, [arrayNumbersRandom]);

  useEffect(() => {
    if (countRight) {
      setTimeout(() => {
        setCountRight(false);
      }, 2000);
    }
  }, [countRight]);

  // set chance
  useEffect(() => {
    if (isNaN(payout) || payout === 0) {
      const setChanceCan = Math.round(maxLimit / 1);
      setChance(setChanceCan);
    }
    if (payout > 500) {
      alert("Limit 500");
      const setChanceCan = Math.round(maxLimit / 500);
      setPayout(500);
      setChance(setChanceCan);
    } else {
      const setChanceCan = Math.round(maxLimit / payout);
      setChance(setChanceCan);
    }
  }, [payout]);
  return (
    <div className="h-[100vh] w-[100vw] flex items-start justify-start bg-[#17181b]">
      <div className="game-menu flex flex-col items-center justify-start w-[8%] h-full bg-gray-500  py-4 text-white space-y-10">
        <Link to={"/"}>
          <div className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:text-white/75">
            <div className="h-10 w-10 ">
              <img
                src={"/number-7.png"}
                className="h-full w-full object-contain"
              />
            </div>
            <div>Hash Dice</div>
          </div>
        </Link>

        <Link to={"/classic-dice"}>
          <div className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:text-white/75">
            <div className="h-10 w-10 ">
              <img
                src={"/classic-dice.png"}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-center">Classic Dice</div>
          </div>
        </Link>
        <Link to={"/ultimate-dice"}>
          <div className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:text-white/75">
            <div className="h-10 w-10 ">
              <img
                src={"/ultimate-dice.png"}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-center">Ultimate Dice</div>
          </div>
        </Link>
      </div>
      <div className="sidebar w-1/5 h-full py-4 text-white space-y-4">
        <div className="flex items-center justify-center gap-4 px-4">
          <div className="bg-gray-600 shadow-lg px-4 py-1 text-white font-semibold cursor-pointer ">
            Manual
          </div>
          <div className="bg-gray-600 shadow-lg px-4 py-1 text-white opacity-70 hover:opacity-100 cursor-pointer ">
            Auto
          </div>
        </div>
        <div className="px-4 space-y-3">
          <div className="space-y-2 ">
            <div className="flex items-center justify-between ">
              <div>Amount</div>
              <div>0 USD</div>
            </div>
            <div className=" flex justify-between gap-1 w-full h-10 bg-gray-500 ">
              <input
                type="number"
                className="outline-none h-full font-semibold w-2/4 px-1 bg-transparent"
                value={amount}
                readOnly
              />
              <div
                className="flex items-center justify-center h-full w-12 bg-[#31343b] cursor-pointer opacity-70 hover:opacity-100"
                onClick={setDoubleAmount}
              >
                x2
              </div>
              <div
                className="flex items-center justify-center h-full w-12 bg-[#31343b] cursor-pointer opacity-70 hover:opacity-100"
                onClick={setDivideDoubleAmount}
              >
                /2
              </div>
              <div className="flex items-center justify-center h-full text-sm w-12 bg-[#31343b] cursor-pointer opacity-70 hover:opacity-100 ">
                {`< >`}
              </div>
            </div>
          </div>
          {/* Payout  */}
          <div className="space-y-2 ">
            <div className="flex items-center justify-between ">
              <div>Payout</div>
              <div>
                Chance: {isNaN(chance) ? 99 : formatNumber(chance / 1000)}%
              </div>
            </div>
            <div className=" flex gap-1 w-full h-10 bg-gray-500 ">
              <input
                type="number"
                className="outline-none h-full font-semibold w-full px-1 bg-transparent"
                value={payout}
                onChange={(e) => setPayout(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div
          onClick={generateNumbers}
          className="mx-4 h-16 bg-green-500 hover:bg-green-600  font-semibold text-lg flex items-center justify-center cursor-pointer"
        >
          <button
            disabled={isLoading}
            className="h-full w-full disabled:bg-slate-400"
          >
            Bet
          </button>
        </div>
      </div>
      <div className="content relative w-4/5 h-full flex flex-col gap-6 items-center justify-center ">
        <div className="absolute flex gap-1 top-10 right-20 font-semibold text-xl text-white">
          <div>Wallet:</div>
          <div className="relative">
            {formatNumber(currentMoney)}
            <div
              className={` ${
                countRight ? "animation-effect" : "animation-effect-reverse"
              } absolute  font-semibold text-green-700 text-2xl w-max`}
            >
              + {formatNumber(MoneyAdd)}
            </div>
          </div>
        </div>
        <div className="wrap-number text-white flex items-center justify-center gap-4 text-5xl font-semibold">
          {arrayNumbersRandom.length <= 0 ? (
            <>
              <div>0</div>
              <div>0</div>
              <div>0</div>
              <div>0</div>
              <div>0</div>
            </>
          ) : arrayNumbersRandom ? (
            arrayNumbersRandom.map((number, index) => (
              <AnimatedNumbers
                key={index}
                includeComma
                animateToNumber={parseInt(number)}
                locale="en-US"
                configs={[
                  { mass: 1, tension: 220, friction: 100 },
                  { mass: 1, tension: 180, friction: 130 },
                  { mass: 1, tension: 280, friction: 90 },
                  { mass: 1, tension: 180, friction: 135 },
                  { mass: 1, tension: 260, friction: 100 },
                  { mass: 1, tension: 210, friction: 180 },
                ]}
              ></AnimatedNumbers>
            ))
          ) : (
            <>
              <div>0</div>
              <div>0</div>
              <div>0</div>
              <div>0</div>
              <div>0</div>
            </>
          )}
        </div>
        <div>
          <button
            onClick={generateNumbers}
            className="px-4 py-1 bg-green-500 text-white rounded-xl shadow-lg disabled:bg-slate-400"
            disabled={isLoading}
          >
            Spin
          </button>
        </div>
        <div className="flex items-center justify-center text-white">
          <div
            onClick={() => dispatch(setMileStoneCompare(high))}
            className={`${
              currentMileStoneCompare === high && "text-green-500"
            } px-4 py-2 cursor-pointer bg-slate-500`}
          >
            High
          </div>
          <div className="bg-gray-600 px-4 py-2 text-white font-semibold ">
            {currentMileStoneCompare === high ? ">" : "<"}
            {Math.round(currentMileStoneCompare)}
          </div>
          <div
            onClick={() => dispatch(setMileStoneCompare(low))}
            className={`${
              currentMileStoneCompare === low && "text-green-500"
            } px-4 py-2 cursor-pointer bg-slate-500`}
          >
            Low
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashDice;
