import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  logoutUser,
  setContactModal,
  setPhotoModal,
  setPoolModal,
} from "../../redux";
import { useCloseOnClickOutside } from "../../utils";
import "./layout.scss";

const HeaderOptions = ({
  setShowOptions,
  showOptions,
}: {
  setShowOptions: Function;
  showOptions: boolean;
}) => {
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  useCloseOnClickOutside(wrapperRef, setShowOptions, showOptions);

  return (
    <div ref={wrapperRef} className="ichat-dropdown dropdown-header">
      <div
        onClick={() => {
          setShowOptions(false);
          dispatch(setContactModal(true));
        }}
      >
        Contacts
      </div>
      <div
        onClick={() => {
          setShowOptions(false);
          dispatch(setPoolModal(true));
        }}
      >
        iChat Pool
      </div>
      <div
        onClick={() => {
          setShowOptions(false);
          dispatch(setPhotoModal(true));
        }}
      >
        Upload Profile Photo
      </div>
      <div style={{ color: "red" }} onClick={() => dispatch(logoutUser())}>
        Logout
      </div>
    </div>
  );
};

export default HeaderOptions;
