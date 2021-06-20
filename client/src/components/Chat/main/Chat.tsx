import React, { useEffect } from "react";
import { useSelector, RootStateOrAny, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSubscription } from "@apollo/client";

import { RECEIVE_MESSAGES } from "../index";
import { addContactMessage } from "../../../redux";
import { useViewport } from "../../../utils";
import { MainChat } from "./index";
import { IContact } from "../../Contact";

const Chat = () => {
  const users = useSelector((state: RootStateOrAny) => state.user);
  const contacts = useSelector((state: RootStateOrAny) => state.contact);
  const { data: subData, error: subError } = useSubscription(RECEIVE_MESSAGES);

  const dispatch = useDispatch();
  const history = useHistory();
  const { url } = useRouteMatch();
  const { width } = useViewport();

  /*
   *Check if url has selected user
   *If true and screen size is out of mobile view
   *Push user to main chat
   */
  useEffect(() => {
    if (url.slice(1) && width > 768) {
      history.push("/");
    }
  }, [width, url, history]);

  /*
   *Check if subscription has error, if true, console error
   *Check if subscription data and carry out the below
   - Check if the incoming message is part of authenticated user's contact
   - If not among user's contact, Return null;
   - Else check if the incoming message is from current authenticated user or other user
   * Add message to state..
   */
  useEffect(() => {
    if (subError) {
      console.log(subError);
    }
    if (subData) {
      const message = subData.newMessage;
      const isContact = contacts.contacts?.find(
        (contact: IContact) => contact.contactRecipient === message.from
      );

      //Ascertain user sending the message (whether authenticated user or other contact)
      const userContact =
        message.to === users.user.username ? message.from : message.to;

      //Todo - Perform a check to see if message is coming from a contact
      //If message is coming from authenticated user, dispatch message else don't dispatch.
      if (isContact === undefined) {
        if (message.from === users.user.username) {
          dispatch(addContactMessage({ username: userContact, message }));
        }
        return;
      }

      //If both parties are connected as contact on both end, they both receive the message
      dispatch(addContactMessage({ username: userContact, message }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subData, subError]);

  //Check for page reload on mobile
  /*
   * Currently if page reloads, it refreshes state and loose data
   * Hence I am listening and pushing user back to main chat so as to
   * select user again and register selected user in state.
   * PS: Just a way of doing this which might have it's downside but works
   * and other solution will be employed..
   */
  useEffect(() => {
    if (url.slice(1)) {
      window.onload = function () {
        history.push("/");
        return true;
      };
    }
    return () => {
      window.onload = null;
    };
  }, [history, url]);

  return <MainChat />;
};

export default Chat;
