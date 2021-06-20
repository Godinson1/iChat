import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { setPoolModal, setAllUsers } from "../../redux";
import { GET_USERS, IUser, User, LoaderChat } from "./index";

const Users = () => {
  const [search, setSearch] = useState("");
  const [usersData, setUsersData] = useState<Array<IUser>>([]);
  const [filteredData, setFilteredData] = useState<Array<IUser>>(usersData);
  const users = useSelector((state: RootStateOrAny) => state.user);

  const dispatch = useDispatch();

  //Get all iChat users
  const { data, loading } = useQuery(GET_USERS);

  dayjs.extend(relativeTime);

  useEffect(() => {
    if (users && users.users) {
      const filterData = users.users.filter((data: IUser) =>
        data.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filterData);
      setUsersData(filterData);
    }
  }, [users, search]);

  useEffect(() => {
    if (data) {
      dispatch(setAllUsers(data.getUsers));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (users && users.users) {
      setUsersData(users.users);
    }
  }, [users]);

  useEffect(() => {
    setFilteredData(usersData);
  }, [usersData]);

  return (
    <div>
      <div className="contacts">
        <div onClick={() => dispatch(setPoolModal(false))} className="close">
          x
        </div>
        <div className="contact-header">
          <div className="active">
            <h3>iChat POOL</h3>
          </div>
          <div className="active-chats-header-search">
            <div className="search-container">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user"
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="no-data">
            <LoaderChat />
          </div>
        ) : filteredData && filteredData.length === 0 ? (
          <div className="no-data">No Result Found! Try again.</div>
        ) : (
          filteredData &&
          filteredData.map((data: IUser) => (
            <User key={data.username} data={data} />
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
