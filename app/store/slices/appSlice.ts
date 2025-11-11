"use client";
import { createSlice } from "@reduxjs/toolkit";
interface IAppSlice {
  isOpenModal: boolean;
  errorText: string;
  errorMethod: string;
  errorCode: number | null;
  loaderVisible: boolean;
  isOpenRegisterModal: boolean;
  isVisibleLoginModal: boolean;
  isOpenMobMenu: boolean;
}
const initialState: IAppSlice = {
  isOpenModal: false,
  errorText: "",
  errorMethod: "",
  errorCode: null,
  loaderVisible: false,
  isOpenRegisterModal: false,
  isVisibleLoginModal: false,
  isOpenMobMenu: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setIsOpenModal: (state, action) => {
      state.isOpenModal = action.payload;
    },
    setErrorText: (state, action) => {
      state.errorText = action.payload;
    },
    serErrorMethod: (state, action) => {
      state.errorMethod = action.payload;
    },
    setVisibleLoader: (state, action) => {
      state.loaderVisible = action.payload;
    },
    setErrorCode: (state, action) => {
      state.errorCode = action.payload;
    },
    setIsOpenRegisterModal: (state, action) => {
      state.isOpenRegisterModal = action.payload;
    },
    setIsOpenLoginModal: (state, action) => {
      state.isVisibleLoginModal = action.payload;
    },
    setIsOpenMobMenu: (state, action) => {
      state.isOpenMobMenu = action.payload;
    },
  },
});

export const {
  setIsOpenModal,
  setErrorText,
  serErrorMethod,
  setVisibleLoader,
  setErrorCode,
  setIsOpenRegisterModal,
  setIsOpenLoginModal,
  setIsOpenMobMenu,
}: {
  setIsOpenModal: any;
  setErrorText: any;
  serErrorMethod: any;
  setVisibleLoader: any;
  setErrorCode: any;
  setIsOpenRegisterModal: any;
  setIsOpenLoginModal: any;
  setIsOpenMobMenu: any;
} = appSlice.actions;
