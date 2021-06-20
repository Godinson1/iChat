import React, { useState } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { useMutation } from "@apollo/client";

import { setPhotoModal, setUser, setSuccessMessage } from "../../redux";
import { readURI } from "../../utils";
import { UPLOAD_PHOTO } from "./index";
import "./user.scss";

const AddPhoto = () => {
  const user = useSelector((state: RootStateOrAny) => state.user);
  const [imageFile, setImageFile] = useState([]);
  const dispatch = useDispatch();

  const [addProfilePhoto, { loading }] = useMutation(UPLOAD_PHOTO, {
    onCompleted: (data) => {
      console.log(data);
      dispatch(setSuccessMessage("Profile photo updated successfully!!"));
      dispatch(setUser(data.addProfilePhoto));
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { validity, files } = e.target;

    const file = files![0];
    readURI(e, setImageFile);
    if (validity.valid)
      addProfilePhoto({
        variables: { file },
      });
  };

  return (
    <div>
      <div className="contacts">
        <div onClick={() => dispatch(setPhotoModal(false))} className="close">
          x
        </div>
        <div className="contact-header">
          <div>
            <h3>UPLOAD PHOTO</h3>
          </div>
        </div>
        <div className="photo-container">
          <div className="user-profile-photo">
            <img
              src={
                imageFile[0]
                  ? imageFile[0]
                  : user.user
                  ? user.user.photoUrl
                  : "/images/chat.png"
              }
              alt="user"
            />
          </div>
          {loading ? (
            <div className="lds-grid">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <div>
              <form method="post" action="" encType="multipart/form-data">
                <label className="upload-btn" htmlFor={"edit-picture"}>
                  Upload Photo
                  <input
                    type="file"
                    id={"edit-picture"}
                    style={{ display: "none" }}
                    name="image"
                    accept="image/jpeg,image/jpg,image/png"
                    data-original-title="upload photos"
                    onChange={handleImage}
                  />
                </label>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPhoto;
