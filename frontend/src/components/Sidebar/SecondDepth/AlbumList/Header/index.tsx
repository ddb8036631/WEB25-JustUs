import styled from "styled-components";
import AlbumSettingModal from "./Modal";
import { ReactComponent as ArrowDownSVG } from "@styles/icons/arrow-down.svg";
import { ReactComponent as ArrowRightSVG } from "@styles/icons/arrow-right.svg";
import { ReactComponent as MoreVertSVG } from "@styles/icons/more-vert.svg";
import { useSelector } from "react-redux";
import { RootState } from "@src/reducer";
import { flexRowCenterAlign } from "@src/styles/StyledComponents";

interface HeaderProps {
  albumId: number;
  albumName: string;
  postToggle: boolean;
  setPostToggle: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpenedIdx: number;
  setModalOpenedIdx: React.Dispatch<React.SetStateAction<number>>;
  AlbumDragHandler: (ev: React.DragEvent<HTMLDivElement>) => void;
  DragEndHandler: (ev: React.DragEvent<HTMLDivElement>) => void;
}

const Header = ({
  albumId,
  albumName,
  postToggle,
  setPostToggle,
  modalOpenedIdx,
  setModalOpenedIdx,
  AlbumDragHandler,
  DragEndHandler,
}: HeaderProps) => {
  const { nowTheme }: any = useSelector((state: RootState) => state.theme);

  const onClickArrowDown = () => {
    setPostToggle((prev) => !prev);
  };

  const onClickMoreBtn = () => {
    setModalOpenedIdx(albumId);
  };

  return (
    <HeaderWrapper draggable={true} onDrag={AlbumDragHandler} onDragEnd={DragEndHandler} className={"albumTitle"}>
      <ArrowIcon onClick={onClickArrowDown}>
        {postToggle && <ArrowDownSVG fill={nowTheme.MENUTEXT} />}
        {!postToggle && <ArrowRightSVG fill={nowTheme.MENUTEXT} />}
      </ArrowIcon>
      <AlbumNameWrapper>
        <AlbumName>{albumName}</AlbumName>
      </AlbumNameWrapper>
      {albumName !== "기본 앨범" && (
        <MoreIcon className="modifying-album-btn" onClick={onClickMoreBtn}>
          <MoreVertSVG fill={nowTheme.MENUTEXT} />
          {modalOpenedIdx === albumId && (
            <AlbumSettingModal albumId={albumId} albumName={albumName} setModalOpenedIdx={setModalOpenedIdx} />
          )}
        </MoreIcon>
      )}
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  color: ${(props) => props.theme.MENUTEXT};
  font-weight: bold;
  display: grid;
  grid-template-columns: 10% 80% 10%;
  cursor: grab;
`;
const ArrowIcon = styled.div`
  cursor: pointer;
  ${flexRowCenterAlign}
`;
const AlbumNameWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const AlbumName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 12rem;
`;
const MoreIcon = styled.div`
  cursor: pointer;
`;

export default Header;
