import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface IApp {
  loading?: boolean;
  money: number;
  mileStoneCompare: number;
  isBetRollUnder: boolean;
}

const initialState: IApp = {
  loading: false,
  money: 100000000,
  mileStoneCompare: 49999,
  isBetRollUnder: true,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state: IApp, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    increase: (state: IApp, action: PayloadAction<number>) => {
      state.money = state.money + action.payload;
    },
    priceBet: (state: IApp, action: PayloadAction<number>) => {
      state.money = state.money - action.payload;
    },
    winBet: (state: IApp, action: PayloadAction<number>) => {
      state.money = state.money + action.payload;
    },
    setMileStoneCompare: (state: IApp, action: PayloadAction<number>) => {
      state.mileStoneCompare = action.payload;
    },
    setIsBetRollUnder: (state: IApp, action: PayloadAction<boolean>) => {
      state.isBetRollUnder = action.payload;
    },
  },
});

export const {
  setLoading,
  priceBet,
  winBet,
  setMileStoneCompare,
  setIsBetRollUnder,
} = appSlice.actions;

export const selectLoading = (state: RootState): boolean | undefined =>
  state.app.loading;

export const getCurrentMoney = (state: RootState): number => state.app.money;
export const getMileStoneCompare = (state: RootState): number =>
  state.app.mileStoneCompare;

export const selectIsBetRollUnder = (state: RootState): boolean | undefined =>
  state.app.isBetRollUnder;

export default appSlice.reducer;
