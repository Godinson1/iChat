import { gql } from "@apollo/client";

export const UPLOAD_PHOTO = gql`
  mutation addProfilePhoto($file: FileUpload!) {
    addProfilePhoto(file: $file) {
      username
      photoUrl
      createdAt
    }
  }
`;
