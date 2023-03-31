import React, { useEffect, useLayoutEffect, useState } from "react";
import { useShallowEqualSelector } from "../../hooks/useShallowEqualSelector";
import {
  getCurrentMoney,
  priceBet,
  winBet,
  selectLoading,
  setLoading,
  setIsBetRollUnder,
  selectIsBetRollUnder,
} from "../../store/slices/appSlice";
import { formatNumber } from "../../utils";
import { useDispatch } from "react-redux";
import AnimatedNumbers from "react-animated-numbers";
import SuccessSound from "../../audio/success.mp3";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Link } from "react-router-dom";
const UltimateDice = () => {
  const dispatch = useDispatch();
  const currentMoney = useShallowEqualSelector(getCurrentMoney);
  const isLoading = useShallowEqualSelector(selectLoading);
  // roll under - over
  const isRollUnder = useShallowEqualSelector(selectIsBetRollUnder);
  const [onWinEffect, setOnWinEffect] = useState<boolean>(false);
  const [arrayNumbersRandom, setArrayNumbersRandom] = useState<Array<string>>(
    []
  );
  const [initial, setInitial] = useState<boolean>(true);
  const [rollNumber, setRollNumber] = useState<number>(50); //MileStone
  const [resultRandom, setResultRandom] = useState<number>(5000); // to compare
  const [chance, setChance] = useState<number>(50);
  const audioSuccess = new Audio(SuccessSound); //audio
  const [amount, setAmount] = useState<number>(100000);
  const [payout, setPayout] = useState<number>(1.98);
  const [rangeWin, setRangeWin] = useState({
    minMileStone: 2500,
    maxMileStone: 7500,
  });
  const maxChance = 98;
  const minChance = 2;
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
    const min = 0;
    const max = 9999;
    setInitial(false);
    handleCheckPayout();
    handleCheckChance();
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    const arr = num.toString();
    dispatch(setLoading(true));
    const newNumbers = Array.from(arr);
    setArrayNumbersRandom(newNumbers);
    setResultRandom(num);
  };
  // Compare result
  const handleCheckBeforeGenerate = () => {
    if (rangeWin.maxMileStone === rangeWin.minMileStone) {
      if (
        window.confirm(`
      The bet amount may exceed the potential maximum profit. Please confirm you're aware that you may not get the full amount when you win a higher payout.
      `)
      ) {
        generateNumbers();
      } else {
        return;
      }
    } else {
      generateNumbers();
    }
  };

  const compare = () => {
    const moneyWin = payout * amount - amount;
    if (isRollUnder) {
      if (
        resultRandom >= rangeWin.minMileStone &&
        resultRandom <= rangeWin.maxMileStone
      ) {
        setOnWinEffect(true);
        audioSuccess.play();
        dispatch(winBet(moneyWin));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } else {
        dispatch(priceBet(amount));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      }
    }
    if (isRollUnder === false) {
      //roll Over
      if (resultRandom > rollNumber) {
        audioSuccess.play();
        setOnWinEffect(true);
        dispatch(winBet(moneyWin));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } else {
        dispatch(priceBet(amount));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      }
    }
  };
  const handleCheckPayout = () => {
    if (isNaN(payout) || payout === 0 || payout === null) {
      setPayout(1.0102);
      // alert("Minimun is 1.0102");
    }
    if (payout > 495) {
      // alert("maximun is 495");
      setPayout(495);
    }
  };
  // handle Manual change chance
  const handleCheckChance = () => {
    if (chance > 98) {
      setChance(98);
    }
    if (chance <= 0) {
      setChance(1);
    }
    if (isRollUnder) {
      setRollNumber(chance);
    }
    if (isRollUnder === false) {
      setRollNumber(100 - chance);
    }
  };
  // handle compare
  useEffect(() => {
    if (initial) return;
    compare();
  }, [resultRandom]);
  const onChangePackage = (value: number | number[]) => {
    if (Array.isArray(value)) {
      // setRollNumber(value);
      setRangeWin({ minMileStone: value[0], maxMileStone: value[1] });
    }
  };
  const onSetMaxChance = () => {
    setChance(maxChance);
    setRangeWin({ minMileStone: 200, maxMileStone: 9999 });
  };
  const onSetMinChance = () => {
    setChance(0.01);
    setRangeWin({ minMileStone: 5100, maxMileStone: 5100 });
  };
  const onSetDecreaseFiveChance = () => {
    if (chance <= minChance) {
      setChance(minChance);
    } else {
      setChance(chance - 5);
    }
  };
  const onSetIncreaseFiveChance = () => {
    if (chance >= maxChance) {
      setChance(maxChance);
    } else {
      setChance(chance + 5);
    }
  };

  //calculate Payout
  const numberFixed = (number: number) => {
    return parseFloat(number.toFixed(4));
  };
  const maxCalculator = 9900;
  useEffect(() => {
    const result =
      maxCalculator / (rangeWin.maxMileStone + 1 - rangeWin.minMileStone);
    const fixedNumber = numberFixed(result);
    setPayout(fixedNumber);
  }, [rangeWin]);

  // handle setChance
  useEffect(() => {
    // new win chance
    const chancePercent = (rangeWin.maxMileStone - rangeWin.minMileStone) / 100;
    setChance(chancePercent);
  }, [rangeWin]);
  // end setChance
  // animation when win
  useEffect(() => {
    if (onWinEffect) {
      setTimeout(() => {
        setOnWinEffect(false);
      }, 1000);
    }
  }, [onWinEffect]);

  // validate range win
  // const isIn = true; // In or Out
  useLayoutEffect(() => {
    if (isNaN(rangeWin.minMileStone)) {
      setRangeWin({ ...rangeWin, minMileStone: 0 });
    }
    if (isNaN(rangeWin.maxMileStone)) {
      setRangeWin({ ...rangeWin, maxMileStone: 0 });
    }
  }, [rangeWin]);
  // validate min value
  useEffect(() => {
    // if (isIn) {
    if (rangeWin.minMileStone >= rangeWin.maxMileStone) {
      setRangeWin({ ...rangeWin, minMileStone: rangeWin.maxMileStone });
    }
    // }
  }, [rangeWin.minMileStone]);
  const onCheckMaxInput = () => {
    // if (isIn) {
    if (rangeWin.maxMileStone <= rangeWin.minMileStone) {
      setRangeWin({ ...rangeWin, maxMileStone: rangeWin.minMileStone });
    }
    // }
  };
  // set win chance

  // useEffect(() => {}, [chance]);

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
      <div className="sidebar w-1/5 h-full bg-black py-4 text-white space-y-4">
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
              <div>Win Amount</div>
            </div>
            <div className=" flex items-center px-2 font-semibold justify-start gap-1 w-full h-10 bg-gray-500 ">
              {isNaN(payout) ? 0 : formatNumber(payout * amount)}
            </div>
          </div>
          <div
            // onClick={generateNumbers}
            onClick={handleCheckBeforeGenerate}
            className="h-16 bg-green-500 hover:bg-green-600  font-semibold text-lg flex items-center justify-center cursor-pointer"
          >
            <button
              disabled={isLoading}
              className="h-full w-full disabled:bg-slate-400"
            >
              Roll now
            </button>
          </div>
        </div>
      </div>
      <div className="content relative w-4/5 h-full flex flex-col gap-6 items-center justify-center ">
        <div className="absolute flex gap-1 top-10 right-20 font-semibold text-xl text-white">
          <div>Wallet:</div>
          <div className="relative">
            {formatNumber(currentMoney)}

            {!initial && (
              <div
                className={` ${
                  onWinEffect ? "animation-effect" : "animation-effect-reverse"
                } absolute  font-semibold text-green-700 text-2xl w-max`}
              >
                + {formatNumber(payout * amount - amount)}
              </div>
            )}
          </div>
        </div>
        {/* Choose Number */}
        <div className="w-[80%] flex items-center justify-center mb-36 h-32 p-4  mt-2">
          <div className="wrap-content font-semibold text-3xl flex items-center justify-center gap-4">
            <div className="min-stone text-gray-700">
              {rangeWin.minMileStone} {`<=`}
            </div>
            <div className="choose-number h-36 w-[500px] border-2 border-solid border-gray-600 py-2 px-4 ">
              <div className="wrap-choose flex flex-col items-center justify-start h-full w-full">
                <div className="uppercase text-2xl text-slate-500">
                  choose numbers
                </div>
                <div className="flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="text-xl text-white">Low</div>
                    <div className="h-12 w-32">
                      <input
                        type="tel"
                        className="h-full w-full bg-gray-700 text-center outline-none text-white"
                        maxLength={4}
                        value={rangeWin.minMileStone}
                        onChange={(e) =>
                          setRangeWin({
                            ...rangeWin,
                            minMileStone: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="text-xl text-green-500 font-semibold cursor-pointer">
                    &#8646;
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="text-xl text-white">High</div>
                    <div className="h-12 w-32">
                      <input
                        type="tel"
                        className="h-full w-full bg-gray-700 text-center outline-none text-white"
                        maxLength={4}
                        value={rangeWin.maxMileStone}
                        onChange={(e) =>
                          setRangeWin({
                            ...rangeWin,
                            maxMileStone: parseInt(e.target.value),
                          })
                        }
                        defaultValue={rangeWin.maxMileStone}
                        onBlur={onCheckMaxInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-stone text-gray-700">
              {`<=`}
              {rangeWin.maxMileStone}
            </div>
          </div>
        </div>
        {/* Slider */}
        <div className="slider-area mt-10 w-[80%] flex flex-col items-center justify-start h-24 relative">
          <div className="absolute text-black flex items-center justify-center bg-green-600s font-semibold mt-2 -top-[170px] w-full h-[150px] px-4">
            <div
              style={{ left: `${resultRandom / 100}%` }}
              className={`h-full flex flex-col items-center justify-center w-1 bg-red-500s gap-2 absolute transition-all duration-300`}
            >
              <div className="w-44 flex items-center justify-center text-xl text-green-400 font-semibold h-14 border-[6px] border-solid border-gray-600  bg-[#24262b]">
                {resultRandom}
              </div>
              <div className="h-20 w-44">
                <img
                  src="/dice.png"
                  className="object-contain h-full w-full "
                />
              </div>
            </div>
          </div>
          <div className="w-full h-[50%] flex items-center justify-center px-6 rounded-lg bg-[#474852] relative">
            <Slider
              range
              allowCross={false}
              min={0}
              max={9999}
              defaultValue={[2500, 7500]}
              value={[rangeWin.minMileStone, rangeWin.maxMileStone]}
              draggableTrack
              className={`custom-slider ${!isRollUnder && "over"}`}
              onChange={(value) => onChangePackage(value)}
            />
            <div
              style={{ left: `${resultRandom / 100}%` }}
              className={`h-[10px] flex flex-col bg-white items-center justify-center w-2 mt-[6px] absolute`}
            ></div>
          </div>
          <div className="absolute text-white px-4 font-semibold mt-2 top-[50%] w-full h-4 flex items-center justify-between">
            <div>0</div>
            <div className="left-[24.5%] absolute">2500</div>
            <div className="left-[49.5%] absolute">5000</div>
            <div className="left-[74.5%] absolute">7500</div>
            <div>9999</div>
          </div>
        </div>
        <div className="w-[80%] h-32 p-4  bg-[#222328] mt-4">
          <div className="wrap-content flex items-center justify-start space-x-8  h-full w-full text-white ">
            <div className="payout h-12 w-1/4 space-y-2">
              <div>Payout</div>
              <input
                type="number"
                className="outline-none focus:outline-green-500 h-full font-semibold w-full px-1 bg-[#474852]"
                value={payout}
                onChange={(e) => setPayout(parseInt(e.target.value))}
              />
            </div>
            <div
              className="roll h-12 w-1/4 space-y-2 cursor-pointer relative"
              // onClick={() => dispatch(setIsBetRollUnder(!isRollUnder))}
            >
              <div>Win Amount</div>
              <div className="flex items-center justify-start h-full font-semibold w-full px-1 bg-[#474852] cursor-pointer">
                {isNaN(payout) ? 0 : formatNumber(payout * amount)}
              </div>
            </div>
            <div className="win-chance h-12 w-1/3 space-y-2">
              <div>Win Chance</div>
              <div className="flex gap-1 w-full h-full bg-[#474852] hover:border-green-500 hover:border-2 border-solid ">
                <input
                  type="number"
                  className="outline-none  h-full font-semibold w-2/4 px-1 bg-transparent"
                  value={chance}
                  onChange={(e) => setChance(parseInt(e.target.value))}
                />
                <div className="flex items-center justify-center h-full w-12 text-green-500">
                  %
                </div>
                <div
                  className="flex items-center justify-center h-full w-12 bg-[#31343b] cursor-pointer opacity-70 hover:opacity-100"
                  onClick={onSetMinChance}
                >
                  Min
                </div>
                <div
                  className="flex items-center justify-center h-full w-12 bg-[#31343b] cursor-pointer opacity-70 hover:opacity-100"
                  onClick={onSetIncreaseFiveChance}
                >
                  +5
                </div>
                <div
                  className="flex items-center justify-center h-full w-12 bg-[#31343b] cursor-pointer opacity-70 hover:opacity-100"
                  onClick={onSetDecreaseFiveChance}
                >
                  -5
                </div>
                <div
                  className="flex items-center justify-center h-full w-12 bg-[#31343b] cursor-pointer opacity-70 hover:opacity-100"
                  onClick={onSetMaxChance}
                >
                  Max
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimateDice;
