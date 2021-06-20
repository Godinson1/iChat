import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { useQuery } from "@apollo/client";

import { Chat, GET_USER } from "../Chat";
import { Users, AddPhoto } from "../User";
import AllContacts from "../Contact/AllContacts";
import { setUser, clearData } from "../../redux";
import Loader from "./Loader/Loader";
import "./layout.scss";

interface ILayout {
  children: ReactNode;
}

const Layout = ({ children }: ILayout) => {
  const users = useSelector((state: RootStateOrAny) => state.user);
  const { data, loading } = useQuery(GET_USER);

  const dispatch = useDispatch();

  useEffect(() => {
    if (users.error || users.success) {
      setTimeout(() => {
        dispatch(clearData());
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users.error, users.success]);

  useEffect(() => {
    if (data) {
      dispatch(setUser(data.getUser));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="main">
          {users.error && (
            <div className="info-container red">{users.error}</div>
          )}
          {users.success && (
            <div className="info-container green">{users.success}</div>
          )}
          {users && users.openContactModal && (
            <div id="show-modal-picture">
              <div className="modal-container">
                <AllContacts />
              </div>
            </div>
          )}
          {users && users.openPoolModal && (
            <div id="show-modal-picture">
              <div className="modal-container">
                <Users />
              </div>
            </div>
          )}
          {users && users.openPhotoModal && (
            <div id="show-modal-picture">
              <div className="modal-container">
                <AddPhoto />
              </div>
            </div>
          )}
          <div className="active-chats">{children}</div>
          <div className="chat">
            <Chat />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
