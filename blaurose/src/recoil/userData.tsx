import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist"; //追加

const { persistAtom } = recoilPersist({　//追加
	key: "recoil-persist",
	storage: typeof window === "undefined" ? undefined : sessionStorage　//修正
});

export const userDataState = atom({
	key: "userData",
	default: {},
	effects_UNSTABLE: [persistAtom]　//追加
});