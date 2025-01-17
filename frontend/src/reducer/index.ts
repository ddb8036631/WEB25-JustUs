import { combineReducers } from "redux";
import GroupModalReducer from "./GroupModalReducer";
import groupReducer from "./GroupReducer";
import ModalReducer from "./Modal";
import AddressReducer from "./AddressReducer";
import Theme from "./Theme";
import UserReducer from "./UserReducer";
import AlbumReducer from "./AlbumReducer";

const rootReducer = combineReducers({
  groupModal: GroupModalReducer,
  groups: groupReducer,
  modal: ModalReducer,
  theme: Theme,
  address: AddressReducer,
  user: UserReducer,
  album: AlbumReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
