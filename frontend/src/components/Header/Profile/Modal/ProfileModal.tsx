import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import COLOR from "@src/styles/Color";
import { RootState } from "@src/reducer";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "@src/reducer/UserReducer";

interface ProfileModalProps {
  isModalOpened: boolean;
  setIsModalOpened: Dispatch<SetStateAction<boolean>>;
}

interface ModalListItem {
  id: number;
  name: string;
  payload: string;
}

const ProfileModal = ({ isModalOpened, setIsModalOpened }: ProfileModalProps) => {
  const modalListItem: ModalListItem[] = [
    { id: 0, name: "회원정보", payload: "ProfileModal" },
    { id: 1, name: "테마설정", payload: "ThemeModal" },
    { id: 2, name: "로그아웃", payload: "" },
  ];

  const dispatch = useDispatch();
  const { userNickName } = useSelector((state: RootState) => state.user);
  const onClickProfileItem = ({ payload, id }: ModalListItem) => {
    setIsModalOpened((prev) => !prev);
    if (id === 2) {
      dispatch(logoutRequestAction());
    } else {
      const type = "OPEN_MODAL";
      dispatch({ type, payload });
    }
  };

  return (
    <ModalWrapper>
      <Container>
        <div>{userNickName}</div>
        <ul>
          {modalListItem.map((item) => (
            <li onClick={() => onClickProfileItem(item)} key={item.id}>
              {item.name}
            </li>
          ))}
        </ul>
      </Container>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  width: 15%;
  background-color: ${COLOR.WHITE};
  position: absolute;
  right: 1vw;
  top: 5vh;
  border-radius: 1rem;
  z-index: 10;
`;

const Container = styled.div`
  margin: 10%;
  font-size: 2rem;

  & li {
    padding: 10%;

    &:hover {
      font-weight: bold;
      cursor: pointer;
    }
  }
`;

export default ProfileModal;
