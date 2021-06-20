import React, { useState } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { setPhotoModal } from "../../redux";
import HeaderOptions from "./HeaderOptions";

import "./layout.scss";

const Header = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Function;
}) => {
  const user = useSelector((state: RootStateOrAny) => state.user);
  const [showOptions, setShowOptions] = useState(false);
  const [showInfo] = useState(false);
  const dispatch = useDispatch();

  dayjs.extend(relativeTime);

  return (
    <div className="active-chats-header">
      <div className="active-chats-header-container">
        <div className="flex">
          <div
            className="user-avatar"
            onClick={() => {
              setShowOptions(false);
              dispatch(setPhotoModal(true));
            }}
          >
            <img
              src={user && user.user ? user.user.photoUrl : "/images/chat.png"}
              alt="user"
            />
          </div>
          <div>
            <div id="title">Hi {user.user && user.user.username},</div>
            <span id="desc">
              {user && user.user
                ? `You Joined ${dayjs(user.user?.createdAt).fromNow()}`
                : ""}
            </span>
          </div>
        </div>
        <div>
          <div
            onClick={() => setShowOptions(!showOptions)}
            className="active-chats-header-options"
          >
            ...
          </div>
          {showOptions && (
            <HeaderOptions
              showOptions={showOptions}
              setShowOptions={setShowOptions}
            />
          )}
        </div>
      </div>
      {showInfo && <div className="user-info">gggg</div>}
      <div className="active-chats-header-search border-gray">
        <div className="search-container">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or start a new chat"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
